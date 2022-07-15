import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthTokenDocument = AuthToken & Document;

@Schema(<SchemaOptions>{collection: "auth-token"})
export class AuthToken {
    @Prop()
    token: string;
    @Prop()
    invalidated: boolean;
    @Prop()
    ttl: Date;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);