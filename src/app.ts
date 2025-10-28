import fastify from 'fastify'
import routes from './routes/index'
import {
    validatorCompiler,
    serializerCompiler,
    RequestValidationError,
    ResponseSerializationError,
} from 'fastify-zod-openapi'

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

//zod setup
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
    //tratar e logar erro de validacao zod
    if (error instanceof RequestValidationError) {
        app.log.warn({ error }, 'Zod validation failed')

        return reply.status(400).send({
            message: 'Validation failed',
            errors: error.cause.message,
        })
    }

    //logar erro de serializacao zod
    if (error instanceof ResponseSerializationError) {
        app.log.error({ error }, 'Zod response serialization failed')
    }

    //erros genericos
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
