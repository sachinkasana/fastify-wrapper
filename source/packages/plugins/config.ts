import fp from 'fastify-plugin';
import { walkDir, readFileSync } from '../utils/files.util';

export interface ConfigPluginOptions {
  path: string;
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<ConfigPluginOptions>(async (fastify, opts) => {
  fastify.decorate('loadConfig', async function () {
    const arr: Array<object> = [];
    let path = process.env.SECRETS_MOUNT_PATH;
    if (opts.path) {
      path = opts.path;
    }
    if (!path) return;
    const dirs = await walkDir(path);
    dirs.forEach((element: string) => {
      const { key, value } = readFileSync(element);
      arr.push({ [key]: value });
      process.env[key] = value;
    });
    return arr;
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    loadConfig(): Array<object>;
  }
}
