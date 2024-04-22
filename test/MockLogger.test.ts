// @ts-ignore
import {mockLogger} from "./MockLogger";

describe('MockLogger', () => {
  it('basic', () => {
    mockLogger.info("11");
    expect(mockLogger.messages[0].msg).toEqual("11");
  });
});
