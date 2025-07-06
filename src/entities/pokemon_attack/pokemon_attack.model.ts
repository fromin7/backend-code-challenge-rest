import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemon_attacks', timestamps: true })
export class PokemonAttack {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true })
  damage: number;

  @Prop({ type: Boolean, required: true })
  isSpecial: boolean;
}

export type PokemonAttackDocument = PokemonAttack & Document;
export const PokemonAttackSchema = SchemaFactory.createForClass(PokemonAttack);

PokemonAttackSchema.index({ name: 1 }, { unique: true });
