import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
