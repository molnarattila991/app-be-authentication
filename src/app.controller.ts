import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './features/auth/auth/auth.service';
import { LocalAuthGuard } from './features/auth/local-auth.guard';

@Controller()
export class AppController {

  public constructor(private authService: AuthService) {

  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/')
  async get(@Request() req) {
    return req.body;
  }
}