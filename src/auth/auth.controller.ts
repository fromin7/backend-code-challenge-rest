import { Controller, Post, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/get-tokens')
  async getTokens(@Query('identifier') identifier: string, @Query('pin') pin: string) {
    const userId = await this.authService.verifyCredentials(identifier, pin);
    if (!userId) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.authService.getTokens(userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh-tokens')
  async refreshTokens(@Req() req) {
    return this.authService.getTokens(req.user.id);
  }
}
