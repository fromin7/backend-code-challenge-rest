import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from 'src/entities/pokemon/pokemon.module';
import { PokemonTypeModule } from 'src/entities/pokemon_type/pokemon_type.module';
import { PokemonAttackModule } from 'src/entities/pokemon_attack/pokemon_attack.module';
import { UserModule } from 'src/entities/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    PokemonModule,
    PokemonTypeModule,
    PokemonAttackModule,
    UserModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
