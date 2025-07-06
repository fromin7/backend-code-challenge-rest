import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { Pokemon, PokemonDocument } from 'src/entities/pokemon/pokemon.model';
import { PokemonType, PokemonTypeDocument } from 'src/entities/pokemon_type/pokemon_type.model';
import { PokemonAttack, PokemonAttackDocument } from 'src/entities/pokemon_attack/pokemon_attack.model';

import { PokemonJsonRecord, PokemonsJson } from './seeder.types';
import { ObjectId } from 'mongoose';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private pokemonInsertObj: Pokemon[] = [];

  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
    @InjectModel(PokemonType.name) private pokemonTypeModel: Model<PokemonTypeDocument>,
    @InjectModel(PokemonAttack.name) private pokemonAttackModel: Model<PokemonAttackDocument>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Reading file contents...');
    const filePath = path.join(__dirname, './data/pokemons.json');
    const pokemonsJson = JSON.parse(fs.readFileSync(filePath, 'utf8')) as PokemonsJson;

    try {
      console.log('Clearing old database entries...');
      await Promise.all([this.pokemonModel.deleteMany({}), this.pokemonTypeModel.deleteMany({}), this.pokemonAttackModel.deleteMany({})]);

      // Note: I am loading the whole data in the memory here. This will suffice for this amount of data, but if it grew rapidly,
      // converting this to a stream may be necessary.

      console.log('Seeding new entries...');
      const promises = [];
      for (let i = 0; i < pokemonsJson.length; i++) {
        promises.push(this.addPokemonToBulkWriteObj(pokemonsJson[i]));
      }

      await Promise.all(promises);
      await this.pokemonModel.insertMany(this.pokemonInsertObj);

      console.log('✅ Completed successfully!');
    } catch (e) {
      console.log('❌ Seeding failed: ', e);
    }
  }

  private async addPokemonToBulkWriteObj(pokemonJsonRecord: PokemonJsonRecord): Promise<void> {
    await this.insertReferencedObjects(pokemonJsonRecord);

    const pokemon: Pokemon = {
      _id: parseInt(pokemonJsonRecord.id),
      name: pokemonJsonRecord.name,
      classification: pokemonJsonRecord.classification,
      types: pokemonJsonRecord.types,
      resistant: pokemonJsonRecord.resistant,
      weaknesses: pokemonJsonRecord.weaknesses,
      weight: {
        minimum: parseFloat(pokemonJsonRecord.weight.minimum),
        maximum: parseFloat(pokemonJsonRecord.weight.maximum),
      },
      height: {
        minimum: parseFloat(pokemonJsonRecord.height.minimum),
        maximum: parseFloat(pokemonJsonRecord.height.maximum),
      },
      fleeRate: pokemonJsonRecord.fleeRate,
      previousEvolutions: pokemonJsonRecord['Previous evolution(s)']?.map(ev => ev.id) || [],
      evolutionRequirements: pokemonJsonRecord.evolutionRequirements,
      evolutions: pokemonJsonRecord.evolutions?.map(ev => ev.id) || [],
      maxCP: pokemonJsonRecord.maxCP,
      maxHP: pokemonJsonRecord.maxHP,
      attacks: (
        await this.pokemonAttackModel
          .find({ name: { $in: pokemonJsonRecord.attacks.fast.map(a => a.name).concat(pokemonJsonRecord.attacks.special.map(a => a.name)) } })
          .select('_id')
          .exec()
      ).map(res => res._id) as ObjectId[],
      class: pokemonJsonRecord['Pokémon Class']?.replace('This is a ', '').replace(' Pokémon.', ''),
      commonCaptureAreas: pokemonJsonRecord['Common Capture Area']?.replace('Early reports that this Pokémon is likely to be found in: ', '').split(', '),
    };

    this.pokemonInsertObj.push(pokemon);
  }

  private async insertReferencedObjects(pokemonJsonRecord: PokemonJsonRecord): Promise<void> {
    const refPromises = [];

    const pokemonTypes = [...new Set([...pokemonJsonRecord.types, ...pokemonJsonRecord.resistant, ...pokemonJsonRecord.weaknesses])];
    refPromises.push(
      this.pokemonTypeModel.bulkWrite(
        pokemonTypes.map(pt => ({
          updateOne: {
            filter: { name: pt },
            update: { $set: { name: pt } },
            upsert: true,
          },
        })),
      ),
    );

    refPromises.push(
      this.pokemonAttackModel.bulkWrite(
        pokemonJsonRecord.attacks.fast.map(pa => ({
          updateOne: {
            filter: { name: pa.name },
            update: { $set: { ...pa, isSpecial: false } },
            upsert: true,
          },
        })),
      ),
    );

    refPromises.push(
      this.pokemonAttackModel.bulkWrite(
        pokemonJsonRecord.attacks.special.map(pa => ({
          updateOne: {
            filter: { name: pa.name },
            update: { $set: { ...pa, isSpecial: true } },
            upsert: true,
          },
        })),
      ),
    );

    await Promise.all(refPromises);
  }
}
