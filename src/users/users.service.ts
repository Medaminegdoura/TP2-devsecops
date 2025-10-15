import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async createUser(name: string, email: string): Promise<User> {
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const existingUser = this.users.find((user) => user.email === email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user: User = {
      id: this.nextId++,
      name,
      email,
      createdAt: new Date(),
      isActive: true,
    };

    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: number): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async deleteUser(id: number): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    return this.users.splice(userIndex, 1)[0];
  }

  async getActiveUsersCount(): Promise<number> {
    return this.users.filter((user) => user.isActive).length;
  }

  async deactivateUser(id: number): Promise<User> {
    return this.updateUser(id, { isActive: false });
  }
}
