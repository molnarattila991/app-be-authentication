import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthToken, AuthTokenDocument } from 'src/models/schemas/token.schema';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TokenValidationCheckerService {
    public constructor(
        @InjectModel(AuthToken.name) private authTokenModel: Model<AuthTokenDocument>,
        private redis: RedisService
    ) { }

    public async check(token: string): Promise<boolean> {
        let tokenIsValid = false;
        const redisToken = await this.redis.get(token);
        if (redisToken) {
            if (redisToken == "valid") {
                tokenIsValid = true;
            } else {
                tokenIsValid = false;
            }
        } else {
            const dbToken = await this.authTokenModel.findOne({ token });
            if (dbToken && dbToken.invalidated == false) {
                tokenIsValid = true;
            } else {
                tokenIsValid = false;
            }
        }

        return tokenIsValid;
    }
}
