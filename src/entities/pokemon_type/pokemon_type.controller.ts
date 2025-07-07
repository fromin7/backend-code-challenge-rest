import { Controller, Get, UseGuards } from '@nestjs/common';
import { PokemonTypeService } from './pokemon_type.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('/pokemon-types')
export class PokemonTypeController {
  constructor(private readonly pokemonTypeService: PokemonTypeService) {}

  @Get()
  getPokemonTypes(): Promise<string[]> {
    return this.pokemonTypeService.getTypes();
  }
}
