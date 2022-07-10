import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BusModule } from 'moat-lib-be-pubsub/pub-sub';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://attila:Idq2fdKRxWMceDx4@cluster0.ml4i0.mongodb.net/nestjs-practise?retryWrites=true&w=majority',
      <any>{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1" }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    BusModule.initConsumer("authenticationGroup", "localhost:50000")
  ],
})
export class AppModule { }
