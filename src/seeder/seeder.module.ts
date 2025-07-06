import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from 'src/entities/pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    PokemonModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
