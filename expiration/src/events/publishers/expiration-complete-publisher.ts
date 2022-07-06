import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@mdcommon/gittix-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
