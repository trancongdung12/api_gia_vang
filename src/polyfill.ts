import { v4 as uuidv4 } from 'uuid';

// Create a global crypto polyfill if it doesn't exist
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => uuidv4(),
  } as Crypto;
}

export {}; 