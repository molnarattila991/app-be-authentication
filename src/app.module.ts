import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BusModule } from 'moat-lib-be-pubsub/pub-sub';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { User, UserSchema } from './models/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(process.env["NEST_MONGODB_CONNECTION_STRING"],
      <MongooseModuleOptions>{
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1",
        dbName: process.env["NEST_MONGODB_DB_NAME"]
      }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    BusModule.initConsumer(process.env["NEST_APP_NAME"], process.env["NEST_MQ_CONNECTION_STRING"])
  ],
})
export class AppModule { }
