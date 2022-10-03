import { ChallengeDuration, ChallengeLevel } from '@code-battle/common';
import {
  challengeRoomMock,
  mockChallengeRoomRepository,
  mockedCacheProvider,
  mockedConfigService,
} from '@code-battle/mocks';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ChallengeRoomService } from './challenge-room.service';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';
import { ChallengeService } from './challenge.service';
import { CACHE_PROVIDER } from '@code-battle/cache';

describe('ChallengeRoomService', () => {
  let challengeRoomService: ChallengeRoomService;

  let createRoomSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;

  const mockQueue = {
    sendEvent: jest.fn(),
  };

  beforeEach(async () => {
    const challengeRoomModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ChallengeRoomService,
        {
          provide: CHALLENGE_ROOM_REPOSIT0RY,
          useValue: mockChallengeRoomRepository,
        },
        {
          provide: 'CHALLENGE_QUEUE',
          useValue: mockQueue,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: ChallengeService,
          useValue: {
            createChallenge: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CACHE_PROVIDER,
          useValue: mockedCacheProvider,
        },
      ],
      exports: [ChallengeRoomService],
    }).compile();

    createRoomSpy = jest.spyOn(mockChallengeRoomRepository, 'createRoom');
    sendSpy = jest.spyOn(mockQueue, 'sendEvent');

    challengeRoomService = challengeRoomModule.get(ChallengeRoomService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const createRoomParams = {
      level: ChallengeLevel.EASY,
      duration: ChallengeDuration.FIFTEEN_MINS,
      isPrivate: false,
    };

    it('should send eventBus message', async () => {
      jest
        .spyOn(mockChallengeRoomRepository, 'getActiveRooms')
        .mockResolvedValue([]);

      await challengeRoomService.createRoom(1, createRoomParams);

      expect(sendSpy).toBeCalledTimes(1);
      expect(sendSpy).toBeCalledWith(
        'CHALLENGE_QUEUE',
        expect.objectContaining({
          id: expect.any(String),
          body: {
            roomId: '1',
          },
        }),
        { delay: expect.any(Number) }
      );
    });

    it('should create room', async () => {
      jest
        .spyOn(mockChallengeRoomRepository, 'getActiveRooms')
        .mockResolvedValue([]);

      const createdRoom = await challengeRoomService.createRoom(
        1,
        createRoomParams
      );

      expect(createRoomSpy).toBeCalledTimes(1);
      expect(createdRoom).toBe(challengeRoomMock);
    });
  });
});
