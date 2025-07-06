import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonType, PokemonTypeSchema } from './pokemon_type.model';
import { PokemonTypeService } from './pokemon_type.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PokemonType.name, schema: PokemonTypeSchema }])],
  providers: [PokemonTypeService],
  exports: [PokemonTypeService, MongooseModule],
})
export class PokemonTypeModule {}
