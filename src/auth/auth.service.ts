import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/entities/user/user.model';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async verifyCredentials(identifier: string, pin: string): Promise<string | null> {
    const user = await this.userModel.findOne({ identifier }).select(['_id', 'pin']).exec();
    if (!user._id) {
      return null;
    }

    return bcrypt.compare(pin, user.pin) ? user._id.toString() : null;
  }

  async verifyUserExists(userId: string): Promise<boolean> {
    return Boolean(await this.userModel.findById(userId).select('_id').exec());
  }

  async getTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
