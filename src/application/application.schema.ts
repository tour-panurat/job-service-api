import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from 'src/job/job.schema';
import { User } from 'src/user/user.schema';
import { ApplicationStatus } from './enum/application.enum';

@Schema({ timestamps: true })
@ObjectType()
export class Application extends Document {
  @Field(() => ID, {
    description: 'The unique identifier for the job application',
  })
  _id: Types.ObjectId;

  @Field(() => User, { description: 'The user who applied for the job' })
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Field(() => Job, {
    description: 'The job for which the application is made',
  })
  @Prop({ type: Types.ObjectId, ref: Job.name, required: true })
  job: Job;

  @Field(() => ApplicationStatus, {
    description: 'The status of the job application',
  })
  @Prop({
    type: String,
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Field({ description: 'The cover letter provided by the applicant' })
  @Prop()
  coverLetter: string;

  @Field(() => User, {
    nullable: true,
    description: 'The user who reviewed the application, if any',
  })
  @Prop({ type: Types.ObjectId, ref: User.name })
  reviewer?: Types.ObjectId;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
