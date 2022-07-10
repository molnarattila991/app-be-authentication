import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BusModule } from 'moat-lib-be-pubsub/pub-sub';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService,
    BusModule.initConsumer("authenticationGroup", "localhost:50000"),],
})
export class AppModule { }
