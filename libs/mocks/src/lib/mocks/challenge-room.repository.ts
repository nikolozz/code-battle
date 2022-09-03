/* eslint-disable @typescript-eslint/no-unused-vars */
export const challengeRoomMock = {
  id: '1',
  duration: 'FIFTEEN_MINS',
  level: 'EASY',
  createdBy: {},
  createdAt: new Date(),
  active: true,
  isPrivate: false,
};

export const mockChallengeRoomRepository = {
  getActiveRooms: () => Promise.resolve([challengeRoomMock]),
  createRoom: (userId: number, room: never) =>
    Promise.resolve(challengeRoomMock),
  markRoomAsInactive: (roomId: string) => Promise.resolve(1),
};
