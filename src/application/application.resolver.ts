import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { ApplicationService } from './application.service';
import { CreateApplicationInput } from './dto/create-application.input';
import { Application } from './application.schema';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.schema';
import { CurrentUser } from 'src/user/user.decorator';
import { UpdateApplicationInput } from './dto/update-application.input';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/enum/role.enum';

@Resolver(() => Application)
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => Application)
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.APPLICANT)
  async applyForJob(
    @Args('createApplicationInput')
    createApplicationInput: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    const { jobId, coverLetter } = createApplicationInput;
    const { username } = user;
    return this.applicationService.applyForJob(username, jobId, coverLetter);
  }

  @Query(() => [Application])
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.APPLICANT)
  async getJobsApply(@CurrentUser() user: User): Promise<Application[]> {
    const { username } = user;
    return this.applicationService.findApplicationsByUserName(username);
  }

  @Mutation(() => Application)
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.COMPANY)
  async updateApplicationStatus(
    @Args('updateApplicationInput')
    updateApplicationInput: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.updateApplicationStatus(
      updateApplicationInput,
      user.username,
    );
  }

  @Query(() => [Application])
  @UseGuards(GraphqlAuthGuard)
  @Roles(Role.COMPANY)
  async findApplicationsByJobId(
    @Args('jobId', { type: () => ID }) jobId: string,
    @CurrentUser() user: User,
  ): Promise<Application[]> {
    return this.applicationService.findApplicationsByJobId(
      jobId,
      user.username,
    );
  }
}
