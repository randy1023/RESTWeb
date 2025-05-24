import { Server } from "./presentation/server";

(() => {
  main();
})();

async function main() {
  const server = new Server();
  server.start();
}
