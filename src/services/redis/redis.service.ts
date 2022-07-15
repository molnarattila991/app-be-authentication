import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ENV } from 'src/constatns/env';

@Injectable()
export class RedisService {
    client: RedisClientType;
    public constructor() {

        this.client = createClient({
            url: `redis://${ENV.redis.host}:${ENV.redis.port}`,
            //password: ENV.Redis.Password
        });

        this.init();
    }

    public async init() {
        await this.client.connect();
    }

    public async set(key: string, value: string) {
        await this.client.set(key, value);
        await this.client.expire(key, ENV.auth.ttl);
    }

    public async get(key: string) {
        return await this.client.get(key);
    }

    public async quit() {
        await this.client.quit();
    }
}
