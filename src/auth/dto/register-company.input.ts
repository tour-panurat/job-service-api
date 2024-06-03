// auth/dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterCompanyInput {
  @Field()
  username!: string;

  @Field()
  password!: string;

  @Field()
  companyName!: string;
}
