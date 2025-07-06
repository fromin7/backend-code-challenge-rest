import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonType, PokemonTypeDocument } from './pokemon_type.model';
import { Model } from 'mongoose';

@Injectable()
export class PokemonTypeService {
  constructor(@InjectModel(PokemonType.name) private pokemonTypeModel: Model<PokemonTypeDocument>) {}

  async getTypes(): Promise<string[]> {
    const result = await this.pokemonTypeModel.find().sort({ name: 1 }).select('name').exec();
    return result.map(r => r.name);
  }
}
