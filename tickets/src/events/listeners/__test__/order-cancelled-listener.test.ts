import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@mdcommon/gittix-common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: 'concnert', price: 11, userId: 'asdf' });
  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('removes the orderId from the ticket, publishes an event, and acks the message', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
