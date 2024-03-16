import { mock } from 'bun:test';

mock.module('node:fs', () => ({
  default: {
    readdirSync: (dir: string) => {
      switch (true) {
        case dir.includes('frontend'):
          return ['compose-frontend.yml'];
        case dir.includes('backend'):
          return ['compose-backend.yml'];
        default:
          return ['compose.yml'];
      }
    },
    existsSync: (path: string) => true,
    lstatSync: (path: string) => ({ isFile: () => true }),
    readFileSync: (path: string) => '',
  },
}));
