import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: { userId: number }) {
    //
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new UnauthorizedException('User does not exist!');
    delete user.password;

    return user;
  }
}
