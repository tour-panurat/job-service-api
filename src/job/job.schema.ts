import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Job extends Document {
  @Field(() => ID, { description: 'The unique identifier for the job listing' })
  _id: Types.ObjectId;

  @Field({ description: 'The title of the job' })
  @Prop({ required: true })
  title: string;

  @Field({ description: 'The description of the job' })
  @Prop({ required: true })
  description: string;

  @Field({
    description:
      'The status of the job listing, indicating whether it is open or closed',
  })
  @Prop({ default: true })
  isOpen: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    description: 'The user who created the job listing',
  })
  createBy: User;
}

export const JobSchema = SchemaFactory.createForClass(Job);
