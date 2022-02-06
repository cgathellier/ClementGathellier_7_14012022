import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './authDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-token.interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  user(usersInputs: SignUpDto) {
    const { email, firstName, lastName, password } = usersInputs;
    return Prisma.validator<Prisma.UserCreateInput>()({
      email,
      firstName,
      lastName,
      password,
    });
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    if (users.length === 0) {
      throw new NotFoundException("Aucun utilisateur n'a été trouvé.");
    } else {
      return users;
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Aucun utilisateur n'a été trouvé");
    } else {
      return user;
    }
  }

  async signUp(signUpInputs: SignUpDto): Promise<User> {
    try {
      const { password } = signUpInputs;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      signUpInputs.password = hashedPassword;

      const user = await this.prisma.user.create({
        data: signUpInputs,
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Un compte existe déjà avec cette adresse email',
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async signIn(signInInputs: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInInputs;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      //   throw new
    } else {
      if (user && (await bcrypt.compare(password, user.password))) {
        const { id, email } = user;

        const payload: JwtPayload = { id, email };
        const accessToken: string = this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException(
          'Aucun compte ne correspond à ces identifiants.',
        );
      }
    }
  }
}
