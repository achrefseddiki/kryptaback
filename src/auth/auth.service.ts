import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    this.mailService.sendWelcome(user.email, user.firstName);
    return this.sign(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, user.email);
  }

  async validateOAuthUser(data: {
    provider: string;
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<string> {
    const { user, isNew } = await this.usersService.findOrCreateOAuth(data);
    if (isNew) this.mailService.sendWelcome(user.email, user.firstName);
    return this.sign(user.id, user.email).access_token;
  }

  private sign(userId: string, email: string) {
    return { access_token: this.jwtService.sign({ sub: userId, email }) };
  }
}
