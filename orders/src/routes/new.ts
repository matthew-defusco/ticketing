import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@mdcommon/gittix-common';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketID must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket that the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run a query to look at all orders. Find an order where the ticket is the ticket we just found
    // and the order's status is NOT cancelled.
    // If we find an order from this, that means the ticket IS reserved already.
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('This ticket has already been reserved.');
    }

    // Calculate an exipiration date for the order
    const exipiration = new Date();
    exipiration.setSeconds(
      exipiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    // Build the order and save it to the DB
    const order = await Order.build({
      ticket,
      expiresAt: exipiration,
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
    });
    await order.save();

    // Emit an order:created event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
