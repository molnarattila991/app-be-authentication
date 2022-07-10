import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { SubscribeService } from 'moat-lib-be-pubsub/pub-sub';
import { CHANNELS } from './constatns/message-channels';
import { AuthService } from './features/auth/auth/auth.service';
import { JwtAuthGuard } from './features/auth/jwt-auth.guard';
import { LocalAuthGuard } from './features/auth/local-auth.guard';

@Controller()
export class AppController {

  public constructor(private authService: AuthService, private bus: SubscribeService) {
    this.bus.getChannel<any>(CHANNELS.user.event.v1_0_0.create).subscribe(item => {
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
}