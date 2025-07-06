import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonType, PokemonTypeDocument } from './pokemon_type.model';
import { Model } from 'mongoose';

@Injectable()
export class PokemonTypeService {
  constructor(@InjectModel(PokemonType.name) private pokemonTypeModel: Model<PokemonTypeDocument>) {}
}
