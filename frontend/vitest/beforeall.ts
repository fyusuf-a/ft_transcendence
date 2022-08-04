import { beforeAll } from 'vitest';
(global as any).CSS = { supports: () => false };

beforeAll(() => {
  global.CSS = {
    supports: (str: string) => false,
    escape: (str: string) => str,
  };
});
