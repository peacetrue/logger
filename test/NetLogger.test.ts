import {netLogger} from "./NetLogger";

describe('NetLogger', () => {
  xit('basic', () => {
    netLogger.url = "http://localhost:8080/logs";
    return netLogger.doLog("INFO", "11")
      .then(response => {
        expect(response.ok).toEqual(true);
      })
  });
});
