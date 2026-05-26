import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface OAuthUserData {
  provider: string;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User not found');

    if (dto.newPassword) {
      if (!dto.currentPassword) throw new BadRequestException('Current password required');
      if (!user.password) throw new BadRequestException('Account uses social login — no password set');
      const valid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!valid) throw new BadRequestException('Current password is incorrect');
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;

    return this.repo.save(user);
  }

  async getWishlist(userId: string): Promise<Product[]> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.wishlistProductIds?.length) return [];
    return this.productRepo.find({ where: { id: In(user.wishlistProductIds) } });
  }

  async getPublicWishlist(userId: string): Promise<{ firstName: string; products: Product[] }> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const products = user.wishlistProductIds?.length
      ? await this.productRepo.find({ where: { id: In(user.wishlistProductIds) } })
      : [];
    return { firstName: user.firstName, products };
  }

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.wishlistProductIds.includes(productId)) {
      user.wishlistProductIds = [...user.wishlistProductIds, productId];
      await this.repo.save(user);
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.wishlistProductIds = user.wishlistProductIds.filter((id) => id !== productId);
    await this.repo.save(user);
  }

  async findOrCreateOAuth(data: OAuthUserData): Promise<{ user: User; isNew: boolean }> {
    const existing = await this.repo.findOne({
      where: { provider: data.provider, providerId: data.providerId },
    });
    if (existing) return { user: existing, isNew: false };

    const byEmail = await this.repo.findOne({ where: { email: data.email } });
    if (byEmail) {
      byEmail.provider = data.provider;
      byEmail.providerId = data.providerId;
      return { user: await this.repo.save(byEmail), isNew: false };
    }

    const user = await this.repo.save(
      this.repo.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        provider: data.provider,
        providerId: data.providerId,
        password: null,
        role: UserRole.USER,
      }),
    );
    return { user, isNew: true };
  }
}
