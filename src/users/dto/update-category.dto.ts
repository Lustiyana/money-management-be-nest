import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCategoryDto {
  @Field()
  @IsNotEmpty({ message: 'User ID is required' })
  id: string;

  @Field()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}