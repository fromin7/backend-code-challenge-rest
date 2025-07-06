import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemon_types' })
export class PokemonType {
  @Prop({ type: String, required: true })
  name: string;
}

export type PokemonTypeDocument = PokemonType & Document;
export const PokemonTypeSchema = SchemaFactory.createForClass(PokemonType);

PokemonTypeSchema.index({ name: 1 }, { unique: true });
