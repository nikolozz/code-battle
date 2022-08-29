import { ChallengeDuration, ChallengeLevel } from '@code-battle/common';
import {
  challengeRoomMock,
  mockChallengeRoomRepository,
  mockedConfigService,
} from '@code-battle/mocks';
import { Test } from '@nestjs/testing';
import { SqsService } from '@ssut/nestjs-sqs';
import { ConfigService } from '@nestjs/config';
import { ChallengeRoomService } from './challenge-room.service';
import { CHALLENGE_ROOM_REPOSIT0RY } from './constants';

describe('ChallengeRoomService', () => {
  let challengeRoomService: ChallengeRoomService;

  let createRoomSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;

  const mockSqsService = {
    send: jest.fn(),
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
          provide: SqsService,
          useValue: mockSqsService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
      exports: [ChallengeRoomService],
    }).compile();

    createRoomSpy = jest.spyOn(mockChallengeRoomRepository, 'createRoom');
    sendSpy = jest.spyOn(mockSqsService, 'send');

    challengeRoomService = challengeRoomModule.get(ChallengeRoomService);
  });

  afterAll(() => {
    jest.clearAllMocks();
    sendSpy.mockClear();
  });

  describe('createRoom', () => {
    afterEach(() => {
      sendSpy.mockClear();
    });

    const createRoomParams = {
      level: ChallengeLevel.EASY,
      duration: ChallengeDuration.FIFTEEN_MINS,
      isPrivate: false,
    };

    it('should create room', async () => {
      const createdRoom = await challengeRoomService.createRoom(
        1,
        createRoomParams
      );

      expect(createRoomSpy).toBeCalledTimes(1);
      expect(createdRoom).toBe(challengeRoomMock);
    });

    it('should send sqs message', async () => {
      await challengeRoomService.createRoom(1, createRoomParams);

      expect(sendSpy).toBeCalledTimes(1);
      expect(sendSpy).toBeCalledWith(
        'INACTIVE_CHALLENGE_ROOM_QUEUE',
        expect.objectContaining({
          id: expect.any(String),
          delaySeconds: expect.any(Number),
          body: {
            roomId: '1',
          },
        })
      );
    });
  });
});
