import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@mdcommon/gittix-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
