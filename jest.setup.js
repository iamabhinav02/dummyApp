import { jest } from '@jest/globals';

jest.mock('react-native-device-info', () => ({
  deviceId: jest.fn(() => 'mock'),
  version: jest.fn(() => 'mock'),
  brand: jest.fn(() => 'mock'),
  buildId: jest.fn(() => 'mock'),
  ipAddress: jest.fn(() => 'mock'),
}));
