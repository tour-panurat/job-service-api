import { InputType, Field, ID } from '@nestjs/graphql';
import { ApplicationStatus } from '../enum/application.enum';

@InputType()
export class UpdateApplicationInput {
  @Field(() => ID)
  applicationId: string;

  @Field(() => ApplicationStatus)
  status: ApplicationStatus;
}
