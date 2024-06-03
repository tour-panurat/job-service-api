import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Job } from '../job.schema';

@ObjectType()
export class PaginatedJobs {
  @Field(() => [Job])
  jobs: Job[];

  @Field(() => Int)
  totalPages: number;
}
