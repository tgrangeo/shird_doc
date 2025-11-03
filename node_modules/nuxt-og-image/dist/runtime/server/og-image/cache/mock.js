import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
const storage = createStorage({
  driver: memoryDriver()
});
export const htmlPayloadCache = storage;
export const prerenderOptionsCache = storage;
export const fontCache = storage;
export const emojiCache = storage;
