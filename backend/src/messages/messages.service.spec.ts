import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { mockMessageEntity } from './mocks/message.entity.mock';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            findOne: jest.fn(() => new mockMessageEntity()),
            find: jest.fn(() => [
              new mockMessageEntity(),
              new mockMessageEntity(),
            ]),
            save: jest.fn(() => new mockMessageEntity()),
            delete: jest.fn(() => void {}),
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
