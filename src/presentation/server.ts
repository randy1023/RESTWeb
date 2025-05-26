import express, { Router } from "express";
import path from "path";
import { AppRoutes } from "./routes";
interface Options {
  port: number;
  router: Router;
  public_path?: string;
}
export class Server {
  private app = express();
  private readonly port: number;
  private readonly public_path: string;
  private readonly routes: Router;
  constructor(options: Options) {
    const { port, public_path = "public", router } = options;
    this.port = port;
    this.public_path = public_path;
    this.routes = router;
  }

  async start() {
    //* Middlewares
    this.app.use(express.json());// permite serializar a un json todas las request
    this.app.use(express.urlencoded({ extended: true }));// permite x-www-form-urlencode
    //* Public Folder
    this.app.use(express.static(this.public_path));

    //*Routes
    this.app.use(this.routes);
    //*SPA
    this.app.get("/{*splat}", (req, res) => {
      const indexPath = path.join(
        `${__dirname}../../../${this.public_path}/index.html`
      );
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
