import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from '@mdcommon/gittix-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new NotFoundError();
    }
    // Mark ticket as reserved by setting orderId
    ticket.set({ orderId: data.id });
    // Save ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack message
    msg.ack();
  }
}
