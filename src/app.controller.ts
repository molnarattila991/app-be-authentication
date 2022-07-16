import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscribeService } from 'moat-lib-be-pubsub/pub-sub';
import { Model } from 'mongoose';
import { CHANNELS } from './constatns/message-channels';
import { AuthService } from './features/auth/auth/auth.service';
import { JwtAuthGuard } from './features/auth/jwt-auth.guard';
import { LocalAuthGuard } from './features/auth/local-auth.guard';
import { User, UserDocument } from './models/schemas/user.schema';

@Controller()
export class AppController {

  public constructor(
    private authService: AuthService,
    private bus: SubscribeService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    this.bus.getChannel<any>(CHANNELS.user.event.v1_0_0.create).subscribe(async item => {
      const created = new this.userModel(item);
      await created.save();

      console.log(item);
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async get(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/validate')
  async validate(@Request() req) {
    return true;
  }
}