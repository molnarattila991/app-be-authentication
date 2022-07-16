import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/schemas/user.schema';
import { TokenCreateService } from '../token-create/token-create.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenCreate: TokenCreateService
  ) { }

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

    await this.tokenCreate.save(accesToken);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}