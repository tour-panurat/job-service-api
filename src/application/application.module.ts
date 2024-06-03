import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { User, UserSchema } from 'src/user/user.schema';
import { Job, JobSchema } from 'src/job/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  providers: [ApplicationResolver, ApplicationService],
  exports: [],
})
export class ApplicationModule {}
