import 'dotenv/config'
import app from './app'

const start = async () => {
    app.listen({ port: 3000 }, (err) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    })
}

start()
