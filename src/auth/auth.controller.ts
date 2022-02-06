import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { SignInDto, SignUpDto } from './authDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(+id);
  }

  @Post('/signup')
  signUp(@Body() signUpInputs: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpInputs);
  }

  @Post('/login')
  signIn(@Body() signInInputs: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInInputs);
  }
}
