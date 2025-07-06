import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Pokemon, PokemonSchema } from './pokemon.model';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }])],
  providers: [PokemonService],
  exports: [PokemonService, MongooseModule],
})
export class PokemonModule {}
