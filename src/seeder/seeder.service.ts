import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonDocument } from 'src/entities/pokemon/pokemon.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>) {}

  async onApplicationBootstrap() {
    console.log('Reading file contents...');
    const filePath = path.join(__dirname, './pokemons.json');
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    try {
      console.log('Clearing old database entries...');
      await this.pokemonModel.deleteMany({});

      console.log('Seeding new entries...');
      await this.pokemonModel.insertMany(json);

      console.log('✅ Completed successfully');
    } catch (e) {
      console.log('❌ Seeding failed: ', e);
    }
  }
}
