/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class UsersService {
  // eslint-disable-next-line prettier/prettier
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      categories: [],
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'SECRETKEY',
      { expiresIn: '1h' },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { token };
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<User> {
    const { id, category } = updateCategoryDto;

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Array.isArray(user.categories)) {
      user.categories = [];
    }

    if (!user.categories.includes(category)) {
      user.categories.push(category);
    }

    return user.save();
  }

  async updateAccount(updateAccountDto: UpdateAccountDto): Promise<User> {
    const { id, account } = updateAccountDto;

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Array.isArray(user.categories)) {
      user.accounts = [];
    }

    if (!user.accounts.includes(account)) {
      user.accounts.push(account);
    }

    return user.save();
  }
}
