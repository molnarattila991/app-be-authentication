import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserDocument, UserSchema } from 'src/models/schemas/user.schema';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { ENV } from 'src/constatns/env';
import { AuthToken, AuthTokenDocument, AuthTokenSchema } from 'src/models/schemas/token.schema';
import { TokenValidationCheckerService } from './token-validation-checker/token-validation-checker.service';
import { ExtractJwtTokenFromHeaderService } from './extract-token/extract-token.service';
import { TokenCreateService } from './token-create/token-create.service';
import { RedisService } from './redis/redis.service';
import { Model } from 'mongoose';

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
    RedisService,
    TokenValidationCheckerService,
    ExtractJwtTokenFromHeaderService,
    TokenCreateService
  ],
  exports: [AuthService],
})
export class AuthModule {
  public constructor(
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthTokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    this.initAuthTokenCollection();
    this.initUserCollection();
  }

  private async initAuthTokenCollection() {
    await this.authTokenModel.createCollection<AuthTokenDocument>();
    if (await this.authTokenModel.collection.indexExists("ttl") == false) {
      this.authTokenModel.collection.createIndex({ ttl: 1 }, { expireAfterSeconds: ENV.auth.ttl });
    }
  }

  private async initUserCollection() {
    await this.userModel.createCollection<UserDocument>();
    if (await this.userModel.collection.indexExists("email") == false) {
      this.userModel.collection.createIndex({ email: 1 }, { unique: true });
    }
  }
}