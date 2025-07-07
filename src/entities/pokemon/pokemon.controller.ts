import { Controller, Get, Param, ParseIntPipe, Query, DefaultValuePipe, ParseBoolPipe, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PokemonService } from 'src/entities/pokemon/pokemon.service';
import { RequestWithUser } from 'src/auth/auth.types';

import { PaginatedList } from 'src/entities/pokemon/pokemon.service';

import { Pokemon } from './pokemon.model';

// todo: validace, chyby, return codes, swagger/openapi; dto?

@UseGuards(AuthGuard('jwt'))
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getPokemons(
    @Req() req: RequestWithUser,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('nameSearchQuery') nameSearchQuery?: string,
    @Query('typeFilter') typeFilter?: string,
    @Query('isFavoriteFilter', new DefaultValuePipe(false), ParseBoolPipe) isFavoriteFilter?: boolean,
  ): Promise<PaginatedList<Pokemon>> {
    console.log(isFavoriteFilter);
    return this.pokemonService.getList(req.user.id, limit, offset, nameSearchQuery, typeFilter, isFavoriteFilter);
  }

  @Get(':id(\\d+)')
  getPokemonById(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    return this.pokemonService.getOneById(req.user.id, id);
  }

  @Get('name/:name')
  getPokemonByName(@Req() req: RequestWithUser, @Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.getOneByName(req.user.id, name);
  }

  @Put(':id/favorite-flag')
  markAsFavorite(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.setFavoriteFlag(req.user.id, id);
  }

  @Delete(':id/favorite-flag')
  unmarkAsFavorite(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.removeFavoriteFlag(req.user.id, id);
  }
}
