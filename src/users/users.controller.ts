import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  isActive?: boolean;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(
      createUserDto.name,
      createUserDto.email,
    );
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.deleteUser(id);
  }

  @Get('stats/active-count')
  async getActiveCount(): Promise<{ count: number }> {
    const count = await this.usersService.getActiveUsersCount();
    return { count };
  }

  // VULNERABILITY: Unsecured admin endpoint
  @Get('admin/debug')
  async debugInfo(): Promise<any> {
    return {
      users: await this.usersService.findAll(),
      env: process.env, // Exposes environment variables!
      secrets: {
        dbPassword: 'secret123',
        apiKey: 'sk-1234567890abcdef',
      },
    };
  }

  // VULNERABILITY: SQL injection vector
  @Get('search')
  async searchUsers(@Query('query') query: string): Promise<any> {
    const sqlQuery = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
    console.log('Executing query:', sqlQuery);
    return { query: sqlQuery, results: [] };
  }
}
