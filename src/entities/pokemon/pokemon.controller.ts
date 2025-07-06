import { Controller, Get, Param, ParseIntPipe, Query, DefaultValuePipe, ParseBoolPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PokemonService } from 'src/entities/pokemon/pokemon.service';

import { PaginatedList } from 'src/entities/pokemon/pokemon.service';

import { Pokemon } from './pokemon.model';

// todo: validace, chyby, return codes, swagger/openapi; dto?

@UseGuards(AuthGuard('jwt'))
@Controller('/pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getPokemons(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('nameSearchQuery') nameSearchQuery?: string,
    @Query('typeFilter') typeFilter?: string,
    @Query('isFavoriteFilter', new DefaultValuePipe(false), ParseBoolPipe) isFavoriteFilter?: boolean,
  ): Promise<PaginatedList<Pokemon>> {
    return this.pokemonService.getList(limit, offset, nameSearchQuery, typeFilter, isFavoriteFilter);
  }

  @Get('/:id(\\d+)')
  getPokemonById(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    return this.pokemonService.getOneById(id);
  }

  @Get('/name/:name')
  getPokemonByName(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.getOneByName(name);
  }
}
