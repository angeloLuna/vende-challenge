import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

export type MockPrisma = DeepMockProxy<PrismaClient>;

export const createMockPrisma = (): MockPrisma => {
  return mockDeep<PrismaClient>();
};
