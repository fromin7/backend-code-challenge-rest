import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { PokemonDimensions, PokemonEvolutionRequirements } from './Pokemon.model.nontrivials';
import { PokemonAttack } from '../pokemon_attack/pokemon_attack.model';

@Schema({ collection: 'pokemons' })
export class Pokemon {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  classification: string;

  @Prop({ type: [String], required: true })
  types: string[];

  @Prop({ type: [String], required: true })
  resistant: string[];

  @Prop({ type: [String], required: true })
  weaknesses: string[];

  @Prop({ type: PokemonDimensions, required: true })
  weight: PokemonDimensions;

  @Prop({ type: PokemonDimensions, required: true })
  height: PokemonDimensions;

  @Prop({ type: Number, required: true })
  fleeRate: number;

  @Prop({
    type: [
      {
        type: Number,
        ref: Pokemon.name,
      },
    ],
    required: true,
  })
  previousEvolutions: number[];

  @Prop({ type: PokemonEvolutionRequirements })
  evolutionRequirements?: PokemonEvolutionRequirements;

  @Prop({
    type: [
      {
        type: Number,
        ref: Pokemon.name,
      },
    ],
    required: true,
  })
  evolutions: number[]; // todo: typ po populate (všude)

  @Prop({ type: Number, required: true })
  maxCP: number;

  @Prop({ type: Number, required: true })
  maxHP: number;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: PokemonAttack.name,
      },
    ],
    required: true,
  })
  attacks: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String })
  class?: string;

  @Prop({ type: [String], required: true })
  commonCaptureAreas: string[];
}

export type PokemonDocument = Pokemon & Document;
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

PokemonSchema.index({ name: 1 });
PokemonSchema.index({ types: 1 });
