import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { InjectModel } from '@nestjs/mongoose';
import { AuthToken, AuthTokenDocument } from 'src/models/schemas/token.schema';
import { Model } from 'mongoose';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthTokenDocument>,
    private redis: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any) {
    const token: string = JSON.stringify(req.headers["authorization"].split(" ")[1]).replace('"', "").replace('"', "");
    console.log(token);
    console.log(await this.redis.get(token));
    const redisToken = await this.redis.get(token);
    if (redisToken) {
      if (redisToken == "valid") {
        return { userId: payload.sub, username: payload.username };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      const dbToken = await this.authTokenModel.findOne({ token });
      if (dbToken && dbToken.invalidated == false) {
        return { userId: payload.sub, username: payload.username };
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}