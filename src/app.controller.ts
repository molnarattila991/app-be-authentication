import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './features/auth/local-auth.guard';

@Controller()
export class AppController {
  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('/')
  async get(@Request() req) {
    return req.body;
  }
}