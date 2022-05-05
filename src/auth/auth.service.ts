import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto, LoginDto, SignUpDto } from './authDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-token.interface';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    generateToken = (id: number, email: string): { accessToken: string } => {
        const payload: JwtPayload = { id, email };
        const accessToken: string = this.jwtService.sign(payload);

        return { accessToken };
    };

    async hashPassword(plainPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    }

    async signUp(signUpInputs: SignUpDto): Promise<{ accessToken: string }> {
        try {
            const { password } = signUpInputs;

            signUpInputs.password = await this.hashPassword(password);

            const user = await this.prisma.user.create({
                data: signUpInputs,
            });
            return this.generateToken(user.id, user.email);
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

    async login(loginInputs: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginInputs;

        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException(
                'Aucun compte ne correspond à ces identifiants.',
            );
        } else {
            if (user && (await bcrypt.compare(password, user.password))) {
                return this.generateToken(user.id, user.email);
            } else {
                throw new UnauthorizedException(
                    'Aucun compte ne correspond à ces identifiants.',
                );
            }
        }
    }

    async createAdmin(
        createAdminDto: CreateAdminDto,
    ): Promise<{ accessToken: string }> {
        try {
            const { password } = createAdminDto;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            createAdminDto.password = hashedPassword;

            const user = await this.prisma.user.create({
                data: createAdminDto,
            });
            return this.generateToken(user.id, user.email);
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
}
