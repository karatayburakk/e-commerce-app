import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(body: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: body });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOneById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateOneById(id: number, body: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: body });
  }

  deleteOneById(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
