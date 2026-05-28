import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactMessage) private repo: Repository<ContactMessage>) {}

  create(dto: { name: string; email: string; subject?: string; message: string }) {
    const msg = this.repo.create(dto);
    return this.repo.save(msg);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async markRead(id: string) {
    await this.repo.update(id, { read: true });
    return this.repo.findOneBy({ id });
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
