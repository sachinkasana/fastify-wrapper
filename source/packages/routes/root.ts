import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/root2', async function (request, reply) {
    return { root2: true }
  })
}

export default root;