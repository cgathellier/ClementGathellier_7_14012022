import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import {
  UpdateUserInfosDto,
  UpdateUserPasswordDto,
  UserContext,
  GetUserByIdReturnObj,
} from './usersDto';
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
  getUserById(@Param('id') id: string): Promise<GetUserByIdReturnObj> {
    return this.usersService.getUserById(+id);
  }

  @Post('/checkToken')
  checkToken(@GetUser() user: User): UserContext {
    return this.usersService.getUserContext(user);
  }

  @Patch('/infos')
  updateUserInfos(
    @GetUser() user: User,
    @Body() userInfos: UpdateUserInfosDto,
  ): Promise<[{ accessToken: string }, UserContext]> {
    return this.usersService.updateUserInfos(user, userInfos);
  }

  @Patch('/password')
  updateUserPassword(
    @GetUser() user: User,
    @Body() userInfos: UpdateUserPasswordDto,
  ): Promise<void> {
    return this.usersService.updateUserPassword(user, userInfos);
  }
}
