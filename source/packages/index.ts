import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import {
  fastify,
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import FastifyFormBody from '@fastify/formbody';
import error from './errors/index';

import fastifyHealthcheck from 'fastify-healthcheck';
// Read the .env file.
// dot env file
import * as dotenv from 'dotenv';

dotenv.config();

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};
const customFastiFy = fastify({logger:true});
const customFastifyApp: FastifyPluginAsync<AppOptions> = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify
    .register(AutoLoad, {
      dir: join(__dirname, 'plugins'),
      options: opts,
    })
    .ready((err) => {
      fastify.loadConfig();
    });

  fastify.register(FastifyFormBody); // To parse 'application/x-www-form-urlencoded' content-type

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({ prefix: `/${process.env.PROJECT_KEY}` }, opts),
  });

  fastify.register(fastifyHealthcheck, { prefix: `/${process.env.PROJECT_KEY}/actuator` });
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`);

    reply.status(404).send({
      statusCode: 404,
      error: error.NOT_FOUND,
      message: `Route ${request.method}:${request.raw.url} not found`,
    });
  });

  fastify.setErrorHandler((err, request, reply) => {
    fastify.log.debug(`Request url: ${request.raw.url}`);
    fastify.log.debug(`Payload: ${request.body}`);
    fastify.log.error(`Error occurred: ${err}`);

    const code = err.statusCode ?? 500;

    reply.status(code).send({
      statusCode: code,
      error: err.name ?? error.INTERNAL_SERVER_ERROR,
      message: err.message ?? err,
    });
  });
};

export default customFastiFy;
export { customFastifyApp, options };