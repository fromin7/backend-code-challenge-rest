import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { escapeRegex } from 'src/app.utils';

import { Pokemon, PokemonDocument } from './pokemon.model';
import { PokemonType, PokemonTypeDocument } from '../pokemon_type/pokemon_type.model';
import { User, UserDocument } from '../user/user.model';

export type PaginatedList<T> = {
  data: T[];
  totalCount: number;
};

@Injectable()
export class PokemonService {
  private defaultPokemonPopulation = [
    {
      path: 'attacks',
      select: ['-__v'],
    },
    {
      path: 'evolutions',
      select: ['_id', 'name'],
    },
    {
      path: 'previousEvolutions',
      select: ['_id', 'name'],
    },
  ];

  private defaultPokemonSelection = '-__v';

  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
    @InjectModel(PokemonType.name) private pokemonTypeModel: Model<PokemonTypeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getList(
    userIdentifier: string,
    limit: number,
    offset: number,
    nameSearchQuery?: string,
    typeFilter?: string,
    isFavoriteFilter?: boolean,
  ): Promise<PaginatedList<Pokemon>> {
    // The regex condition does not use the MongoDB index by design. For the purposes of this exercise, I have used it regardless.
    // However, for a production environment, implementing a solution like Atlas Search or Elasticsearch would be ideal,
    // expecially if the number of Pokemons grew rapidly (the current soultion would still suffice for the amount of data provided).
    const conditions = {
      ...(nameSearchQuery ? { name: { $regex: escapeRegex(nameSearchQuery), $options: 'i' } } : {}),
      ...(typeFilter ? { types: { $elemMatch: { $eq: typeFilter } } } : {}),
      ...(isFavoriteFilter ? { isFavorite: true } : {}), // TODO: per user
    };

    const result = await this.pokemonModel
      .find(conditions)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(offset)
      .populate(this.defaultPokemonPopulation)
      .select(this.defaultPokemonSelection)
      .exec();

    const totalCount = await this.pokemonModel.countDocuments(conditions).exec();

    return { data: result, totalCount };
  }

  async getOneById(userIdentifier: string, id: number): Promise<PokemonDocument> {
    return this.pokemonModel.findById(id).populate(this.defaultPokemonPopulation).select(this.defaultPokemonSelection).exec();
  }

  async getOneByName(userIdentifier: string, name: string): Promise<PokemonDocument> {
    return this.pokemonModel.findOne({ name }).populate(this.defaultPokemonPopulation).select(this.defaultPokemonSelection).exec();
  }

  async setFavoriteFlag(userIdentifier: string, id: number): Promise<void> {
    console.log(id);
  }

  async removeFavoriteFlag(userIdentifier: string, id: number): Promise<void> {
    console.log(id);
  }
}
