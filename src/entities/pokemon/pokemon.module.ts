import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Pokemon, PokemonSchema } from './pokemon.model';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonTypeModule } from '../pokemon_type/pokemon_type.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]), PokemonTypeModule],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService, MongooseModule],
})
export class PokemonModule {}
