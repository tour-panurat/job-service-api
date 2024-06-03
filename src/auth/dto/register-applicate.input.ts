// auth/dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterApplicateInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}
