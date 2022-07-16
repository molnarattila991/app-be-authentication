import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthToken, AuthTokenDocument } from 'src/models/schemas/token.schema';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokenCreateService {
    constructor(
        private redis: RedisService,
        @InjectModel(AuthToken.name) private authTokenModel: Model<AuthTokenDocument>
    ) { }

    public async save(token: string) {
        await this.redis.set(token, "valid");

        const created = new this.authTokenModel(<AuthToken>{
            token: token,
            invalidated: false,
            ttl: new Date()
        });

        await created.save();
    }
}
