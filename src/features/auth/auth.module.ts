import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/models/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from 'src/services/redis/redis.service';
import { ENV } from 'src/constatns/env';
import { AuthToken, AuthTokenSchema } from 'src/models/schemas/token.schema';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthToken.name, schema: AuthTokenSchema }
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: `${ENV.auth.ttl}s` },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RedisService
    //UsersService
  ],
  exports: [AuthService],
})
export class AuthModule { }