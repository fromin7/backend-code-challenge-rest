import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  identifier: string;

  @Prop({ type: String, required: true })
  pin: string;

  @Prop({ type: [Number], required: true })
  favoritePokemonIds: number[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ identifier: 1 }, { unique: true });
