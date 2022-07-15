import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ENV } from 'src/constatns/env';
import { AuthToken, AuthTokenDocument } from 'src/models/schemas/token.schema';
import { User, UserDocument } from 'src/models/schemas/user.schema';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private redis: RedisService,
    @InjectModel(AuthToken.name) private authTokenModel: Model<AuthTokenDocument>
  ) {
    this.initIndex();
  }

  private async initIndex() {
    await this.authTokenModel.createCollection<AuthTokenDocument>();
    if (await this.authTokenModel.collection.indexExists("ttl") == false) {
      this.authTokenModel.collection.createIndex({ ttl: 1 }, { expireAfterSeconds: ENV.auth.ttl });
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {

    const user = await this.userModel.findOne({ email: username });
    if (user && user.password === pass) {
      return { userId: user._id, username: user.email };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const accesToken = this.jwtService.sign(payload);

    await this.redis.set(accesToken, "valid");
    
    const created = new this.authTokenModel(<AuthToken>{
      token: accesToken,
      invalidated: false,
      ttl: new Date()
    });
    await created.save();

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}