import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenOutput {
  @Field()
  access_token: string;
}
