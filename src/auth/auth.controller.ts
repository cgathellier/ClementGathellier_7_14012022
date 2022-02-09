import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { LoginDto, SignUpDto } from './authDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpInputs: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpInputs);
  }

  @Post('/login')
  login(@Body() loginInputs: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginInputs);
  }

  @Post('/createAdmin')
  createAdmin(): Promise<User> {
    const adminObj = {
      firstName: 'Admin',
      lastName: 'Groupomania',
      email: 'admin@groupomania.com',
      password: 'admin123',
      admin: true,
    };

    return this.authService.createAdmin(adminObj);
  }
}
