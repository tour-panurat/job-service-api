import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobService } from './job.service';
import { JobResolver } from './job.resolver';
import { Job, JobSchema } from './job.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  providers: [JobService, JobResolver],
})
export class JobModule {}
