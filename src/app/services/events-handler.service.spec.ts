import { TestBed } from '@angular/core/testing';

import { EventsHandlerService } from './events-handler.service';

describe('EventsHandlerService', () => {
  let service: EventsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
