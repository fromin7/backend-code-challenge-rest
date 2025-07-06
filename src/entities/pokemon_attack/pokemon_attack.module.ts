import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonAttack, PokemonAttackSchema } from './pokemon_attack.model';
import { PokemonAttackService } from './pokemon_attack.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PokemonAttack.name, schema: PokemonAttackSchema }])],
  providers: [PokemonAttackService],
  exports: [PokemonAttackService, MongooseModule],
})
export class PokemonAttackModule {}
