import { Controller, Get, Param, ParseIntPipe, Query, DefaultValuePipe, ParseBoolPipe, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PokemonService } from 'src/entities/pokemon/pokemon.service';

import { PaginatedList } from 'src/entities/pokemon/pokemon.service';

import { Pokemon } from './pokemon.model';

// todo: validace, chyby, return codes, swagger/openapi; dto?

@UseGuards(AuthGuard('jwt'))
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getPokemons(
    @Req() req: Request & { user: { identifier: string } },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('nameSearchQuery') nameSearchQuery?: string,
    @Query('typeFilter') typeFilter?: string,
    @Query('isFavoriteFilter', new DefaultValuePipe(false), ParseBoolPipe) isFavoriteFilter?: boolean,
  ): Promise<PaginatedList<Pokemon>> {
    return this.pokemonService.getList(req.user.identifier, limit, offset, nameSearchQuery, typeFilter, isFavoriteFilter);
  }

  @Get(':id(\\d+)')
  getPokemonById(@Req() req: Request & { user: { identifier: string } }, @Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    return this.pokemonService.getOneById(req.user.identifier, id);
  }

  @Get('name/:name')
  getPokemonByName(@Req() req: Request & { user: { identifier: string } }, @Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.getOneByName(req.user.identifier, name);
  }

  @Put(':id/favorite-flag')
  markAsFavorite(@Req() req: Request & { user: { identifier: string } }, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.setFavoriteFlag(req.user.identifier, id);
  }

  @Delete(':id/favorite-flag')
  unmarkAsFavorite(@Req() req: Request & { user: { identifier: string } }, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.removeFavoriteFlag(req.user.identifier, id);
  }
}
