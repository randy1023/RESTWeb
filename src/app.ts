import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {
  const { PORT, PUBLIC_PATH } = envs;
  const routes = AppRoutes.routes;
  const server = new Server({
    port: PORT,
    public_path: PUBLIC_PATH,
    router: routes,
  });
  server.start();
}
