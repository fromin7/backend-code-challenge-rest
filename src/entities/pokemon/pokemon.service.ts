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
    userId: string,
    limit: number,
    offset: number,
    nameSearchQuery?: string,
    typeFilter?: string,
    isFavoriteFilter?: boolean,
  ): Promise<PaginatedList<Pokemon & { isFavorite: boolean }>> {
    const userFavorites = await this.getUserFavorites(userId);

    // The regex condition does not use the MongoDB index by design. For the purposes of this exercise, I have used it regardless.
    // However, for a production environment, implementing a solution like Atlas Search or Elasticsearch would be ideal,
    // expecially if the number of Pokemons grew rapidly (the current soultion would still suffice for the amount of data provided).
    const conditions = {
      ...(nameSearchQuery ? { name: { $regex: escapeRegex(nameSearchQuery), $options: 'i' } } : {}),
      ...(typeFilter ? { types: { $elemMatch: { $eq: typeFilter } } } : {}),
      ...(isFavoriteFilter ? { _id: { $in: userFavorites } } : {}),
    };

    const result = await this.pokemonModel
      .find(conditions)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(offset)
      .populate(this.defaultPokemonPopulation)
      .select(this.defaultPokemonSelection)
      .lean()
      .exec();

    // Using the index below is crucial to count documents efficiently (see comment above).
    // I have verified that it is being used for "types" and "isFavorite" props, the name remains unsolved for the time being
    // as per the comment above.
    const totalCount = await this.pokemonModel.countDocuments(conditions).exec();

    return { data: result.map(r => ({ ...r, isFavorite: userFavorites.includes(r._id) })), totalCount };
  }

  async getOneById(userId: string, id: number): Promise<Pokemon & { isFavorite: boolean }> {
    const result = this.pokemonModel.findById(id).populate(this.defaultPokemonPopulation).select(this.defaultPokemonSelection).lean().exec();
    const userFavorites = await this.getUserFavorites(userId);

    return { ...(await result), isFavorite: userFavorites.includes(id) };
  }

  async getOneByName(userId: string, name: string): Promise<Pokemon & { isFavorite: boolean }> {
    const [result, userFavorites] = await Promise.all([
      await this.pokemonModel.findOne({ name }).populate(this.defaultPokemonPopulation).select(this.defaultPokemonSelection).lean().exec(),
      await this.getUserFavorites(userId),
    ]);

    return { ...result, isFavorite: userFavorites.includes(result._id) };
  }

  async setFavoriteFlag(userId: string, id: number): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $addToSet: { favoritePokemonIds: id } }).exec();
  }

  async removeFavoriteFlag(userId: string, id: number): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $pull: { favoritePokemonIds: id } }).exec();
  }

  private async getUserFavorites(userId: string): Promise<number[]> {
    return (await this.userModel.findById(userId).select('favoritePokemonIds').exec())?.favoritePokemonIds || [];
  }
}
