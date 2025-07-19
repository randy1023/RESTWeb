import { envs } from "../src/config/envs";
import { Server } from "../src/presentation/server";

jest.mock("../src/presentation/server");
describe("test on app.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should work", async () => {
    await import("../src/app");
    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith(
      expect.objectContaining({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        router: expect.any(Function),
      })
    );
    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
