import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateAccountDto {
  @Field()
  @IsNotEmpty({ message: 'User ID is required' })
  id: string;

  @Field()
  @IsNotEmpty({ message: 'Account is required' })
  account: string;
}
