import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@mdcommon/gittix-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
