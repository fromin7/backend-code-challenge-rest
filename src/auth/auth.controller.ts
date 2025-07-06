import { Controller, Post, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/get-tokens')
  async getTokens(@Query('identifier') identifier: string, @Query('pin') pin: string) {
    if (!(await this.authService.verifyCredentials(identifier, pin))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.authService.getTokens({ sub: identifier });
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh-tokens')
  async refreshTokens(@Req() req) {
    const { sub, username } = req.user;
    return this.authService.getTokens({ sub, username });
  }
}
