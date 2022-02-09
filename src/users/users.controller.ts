import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id);
  }
}
