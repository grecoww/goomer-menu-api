import fastify from 'fastify'
import routes from './routes/index'

const app = fastify({ logger: true })

app.register(routes)

app.setNotFoundHandler((request, reply) => {
    app.log.warn(
        {
            request: {
                method: request.method,
                url: request.url,
                query: request.query,
                params: request.params,
            },
        },
        'Resource not found'
    )

    reply.status(404).send({ message: 'Not found' })
})

export default app
