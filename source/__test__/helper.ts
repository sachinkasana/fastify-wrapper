import Fastify from "fastify";
import fp from "fastify-plugin";
import App,{customFastifyApp} from "../packages/index";

export function build() {
  const app = App;

  beforeAll(async () => {
    void app.register(fp(customFastifyApp));
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}