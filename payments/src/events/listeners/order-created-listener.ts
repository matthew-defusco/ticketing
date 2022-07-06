import { Listener, OrderCreatedEvent, Subjects } from '@mdcommon/gittix-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      version: data.version,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}
