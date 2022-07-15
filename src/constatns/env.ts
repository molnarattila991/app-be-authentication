import { config } from "dotenv";

config();

export const ENV = {
    app: {
        name: process.env["NEST_APP_NAME"],
    },
    message: {
        connectionString: process.env["NEST_MQ_CONNECTION_STRING"]
    },
    mongoDB: {
        connectionString: process.env["NEST_MONGODB_CONNECTION_STRING"],
        name: process.env["NEST_MONGODB_DB_NAME"]
    },
    redis: {
        host: process.env["NEST_REDIS_HOST"],
        port: process.env["NEST_REDIS_PORT"],
        password: process.env["NEST_REDIS_PASSWORD"]
    },
    auth: {
        ttl: 3600
    }
}