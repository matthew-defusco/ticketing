import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@mdcommon/gittix-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
