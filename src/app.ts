import fastify from 'fastify'
import routes from './routes/index'

const app = fastify({
    logger:
        process.env.NODE_ENV === 'dev'
            ? {
                  transport: {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          ignore: 'pid, hostname',
                      },
                  },
              }
            : true,
})

app.register(routes)

app.setErrorHandler((error, request, reply) => {
    app.log.error(
        {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
            },
            request: {
                method: request.method,
                url: request.url,
                query: request.query,
                params: request.params,
            },
        },
        'Unhandled error occurred'
    )

    const statusCode = error.statusCode || 500

    reply.status(statusCode).send({
        message: statusCode === 500 ? 'Internal Server Error' : error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
})

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
