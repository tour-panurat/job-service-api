import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from './enum/role.enum';

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID, { description: 'The unique identifier for the user' })
  _id: Types.ObjectId;

  @Field({ description: 'The username of the user, used for authentication' })
  @Prop()
  username!: string;

  @Prop()
  password!: string;

  @Field(() => Role, {
    description: 'The role of the user, either "applicant" or "company"',
  })
  @Prop({
    type: String,
    enum: Role,
    default: Role.APPLICANT,
  })
  role!: string;

  @Field({
    description:
      'The name of the company the user represents (only for company role)',
  })
  @Prop()
  companyName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
