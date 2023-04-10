import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { SigninDto, SignupDto } from './dtos';
import { Token } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(body: SignupDto): Promise<Token> {
    const { email, password, passwordConfirm } = body;

    if (!this.arePasswordsSame(password, passwordConfirm))
      throw new BadRequestException('Passwords do not match!');
    delete body.passwordConfirm;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) throw new BadRequestException('Email already in use!');

    const hashedPassowrd = await this.encryptPassword(password);
    body.password = hashedPassowrd;

    const newUser = await this.prisma.user.create({ data: body });

    const accessToken = await this.signToken({ userId: newUser.id });

    return { accessToken };
  }

  async signin(body: SigninDto): Promise<Token> {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !this.comparePasswordWithHashed(password, user.password))
      throw new NotFoundException('Email or password is incorret!');

    const accessToken = await this.signToken({ userId: user.id });

    return { accessToken };
  }

  private arePasswordsSame(password: string, passwordConfirm: string): boolean {
    return password === passwordConfirm;
  }

  private async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  private async signToken(payload: { userId: number }): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_KEY'),
      expiresIn: 60,
    });
  }

  private async comparePasswordWithHashed(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return compare(password, storedPassword);
  }
}
