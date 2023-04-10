import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { User } from '@prisma/client';
import { JwtGuard } from '../../common/guards';
import { Serialize } from '../../common/interceptors';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtGuard)
@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body);
  }

  @Get()
  findAll(@CurrentUser() user: User): Promise<User[]> {
    console.log(user);
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  updateOneById(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOneById(id, body);
  }

  @Delete(':id')
  deleteOneById(@Param('id') id: number): Promise<User> {
    return this.usersService.deleteOneById(id);
  }
}
