import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './entities/pokemon/pokemon.module';
import { PokemonAttackModule } from './entities/pokemon_attack/pokemon_attack.module';
import { PokemonTypeModule } from './entities/pokemon_type/pokemon_type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    AuthModule,
    PokemonModule,
    PokemonAttackModule,
    PokemonTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
