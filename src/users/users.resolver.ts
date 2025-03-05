import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './dto/user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => UserType)
export class UsersResolver {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  async users() {
    return this.usersService.findAll();
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserDto) {
    return this.usersService.create(input);
  }

  @Mutation(() => String)
  async loginUser(@Args('input') input: LoginUserDto) {
    const { token } = await this.usersService.login(input);
    return token;
  }
}
