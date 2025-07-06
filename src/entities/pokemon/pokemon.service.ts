import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonDocument } from './Pokemon.model';
import { Model } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>) {}
}
