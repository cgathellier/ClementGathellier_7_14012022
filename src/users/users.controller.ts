import { Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
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

  @Post('/checkToken')
  checkToken(@GetUser() user: User): {
    id: number;
    email: string;
    isAdmin: boolean;
  } {
    return this.usersService.checkToken(user);
  }
}
