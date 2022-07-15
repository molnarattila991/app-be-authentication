import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BusModule } from 'moat-lib-be-pubsub/pub-sub';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { User, UserSchema } from './models/schemas/user.schema';
import { ENV } from './constatns/env';
import { AuthToken, AuthTokenSchema } from './models/schemas/token.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      ENV.mongoDB.connectionString,
      <MongooseModuleOptions>{
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1",
        dbName: ENV.mongoDB.name
      }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthToken.name, schema: AuthTokenSchema }
    ])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    BusModule.initConsumer(
      ENV.app.name,
      ENV.message.connectionString
    )
  ],
})
export class AppModule { }
