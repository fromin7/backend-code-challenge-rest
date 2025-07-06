import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonAttack, PokemonAttackDocument } from './pokemon_attack.model';
import { Model } from 'mongoose';

@Injectable()
export class PokemonAttackService {
  constructor(@InjectModel(PokemonAttack.name) private pokemonAttackModel: Model<PokemonAttackDocument>) {}
}
