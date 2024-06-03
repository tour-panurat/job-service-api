import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateApplicationInput {
  @Field()
  jobId: string;

  @Field()
  coverLetter: string;
}
