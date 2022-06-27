import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@mdcommon/gittix-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
