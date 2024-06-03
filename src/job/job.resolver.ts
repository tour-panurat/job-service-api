import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { JobService } from './job.service';
import { UseGuards } from '@nestjs/common';
import { Job } from './job.schema';
import { GraphqlAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from 'src/user/users.service';
import { CurrentUser } from '../user/user.decorator';
import { User } from 'src/user/user.schema';
import { PaginatedJobs } from './dto/paginated-jobs-output.dto';
import { Role } from 'src/user/enum/role.enum';

@Resolver()
export class JobResolver {
  constructor(
    private readonly jobService: JobService,
    private readonly userService: UsersService,
  ) {}

  @Query(() => PaginatedJobs)
  async jobListings(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedJobs> {
    return this.jobService.getJobListings(page, limit);
  }

  @Mutation(() => Job)
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.COMPANY)
  async createJob(
    @Args('title') title: string,
    @Args('description') description: string,
    @CurrentUser() user: User,
  ) {
    const createBy = user.username;
    return this.jobService.createJob(title, description, createBy);
  }

  @Mutation(() => Job)
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.COMPANY)
  async activeJob(@Args('id') id: string, @CurrentUser() user: User) {
    return this.jobService.activeJob(id, user);
  }
  @Mutation(() => Job)
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.COMPANY)
  async closeJob(@Args('id') id: string, @CurrentUser() user: User) {
    return this.jobService.closeJob(id, user);
  }
}
