import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const user = await service.createUser('John Doe', 'john@example.com');

      expect(user).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(Number),
        name: 'John Doe',
        email: 'john@example.com',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        createdAt: expect.any(Date),
        isActive: true,
      });
    });

    it('should throw error when name is missing', async () => {
      await expect(service.createUser('', 'john@example.com')).rejects.toThrow(
        'Name and email are required',
      );
    });

    it('should throw error when email is missing', async () => {
      await expect(service.createUser('John Doe', '')).rejects.toThrow(
        'Name and email are required',
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      await service.createUser('John Doe', 'john@example.com');

      await expect(
        service.createUser('Jane Doe', 'john@example.com'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no users', async () => {
      const users = await service.findAll();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      await service.createUser('John Doe', 'john@example.com');
      await service.createUser('Jane Doe', 'jane@example.com');

      const users = await service.findAll();
      expect(users).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const createdUser = await service.createUser(
        'John Doe',
        'john@example.com',
      );
      const foundUser = await service.findById(createdUser.id);

      expect(foundUser).toEqual(createdUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const createdUser = await service.createUser(
        'John Doe',
        'john@example.com',
      );
      const foundUser = await service.findByEmail('john@example.com');

      expect(foundUser).toEqual(createdUser);
    });

    it('should return null when user not found', async () => {
      const foundUser = await service.findByEmail('notfound@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const user = await service.createUser('John Doe', 'john@example.com');
      const updatedUser = await service.updateUser(user.id, {
        name: 'John Smith',
      });

      expect(updatedUser.name).toBe('John Smith');
      expect(updatedUser.email).toBe('john@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(
        service.updateUser(999, { name: 'John Smith' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const user = await service.createUser('John Doe', 'john@example.com');
      const deletedUser = await service.deleteUser(user.id);

      expect(deletedUser).toEqual(user);

      const users = await service.findAll();
      expect(users).toHaveLength(0);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getActiveUsersCount', () => {
    it('should return count of active users', async () => {
      await service.createUser('John Doe', 'john@example.com');
      await service.createUser('Jane Doe', 'jane@example.com');

      const count = await service.getActiveUsersCount();
      expect(count).toBe(2);
    });

    it('should not count inactive users', async () => {
      const user = await service.createUser('John Doe', 'john@example.com');
      await service.deactivateUser(user.id);

      const count = await service.getActiveUsersCount();
      expect(count).toBe(0);
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      const user = await service.createUser('John Doe', 'john@example.com');
      const deactivatedUser = await service.deactivateUser(user.id);

      expect(deactivatedUser.isActive).toBe(false);
    });
  });
});
