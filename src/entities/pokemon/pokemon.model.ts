import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { PokemonWeight, PokemonEvolutionRequirements, PokemonEvolution, PokemonAttacks } from './Pokemon.model.nontrivials';

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

  @Prop({ type: PokemonWeight, required: true })
  weight: PokemonWeight;

  @Prop({ type: Number, required: true })
  fleeRate: number;

  @Prop({ type: PokemonEvolutionRequirements })
  evolutionRequirements?: PokemonEvolutionRequirements;

  @Prop({ type: [PokemonEvolution], required: true })
  evolutions: PokemonEvolution[];

  @Prop({ type: Number, required: true })
  maxCP: number;

  @Prop({ type: Number, required: true })
  maxHP: number;

  @Prop({ type: PokemonAttacks, required: true })
  attacks: PokemonAttacks;

  @Prop({ type: Boolean })
  isFavorite?: boolean;
}

export type PokemonDocument = Pokemon & Document;
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

PokemonSchema.index({ name: 1 });
PokemonSchema.index({ types: 1 });
PokemonSchema.index(
  { isFavorite: 1 },
  {
    partialFilterExpression: { isFavorite: true },
  },
);
