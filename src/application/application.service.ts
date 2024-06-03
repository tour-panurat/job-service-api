import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application } from './application.schema';
import { User } from 'src/user/user.schema';
import { Job } from 'src/job/job.schema';
import { UpdateApplicationInput } from './dto/update-application.input';
import { ApplicationStatus } from './enum/application.enum';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async applyForJob(
    username: string,
    jobId: string,
    coverLetter: string,
  ): Promise<Application> {
    const user = await this.userModel.findOne({
      username,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const objectId = Types.ObjectId.isValid(jobId)
      ? new Types.ObjectId(jobId)
      : null;
    const jobListing = await this.jobModel.findById(objectId);

    if (!jobListing) {
      throw new NotFoundException('Job listing not found');
    }

    if (!jobListing.isOpen) {
      throw new BadRequestException('Job listing is closed');
    }

    const newApplication = new this.applicationModel({
      user: user._id,
      job: jobListing._id,
      coverLetter: coverLetter,
      status: 'pending',
    });

    return newApplication.save();
  }

  async findApplicationsByUserName(userName: string): Promise<Application[]> {
    const user = await this.userModel.findOne({ username: userName }).exec();
    if (!user) {
      return [];
    }

    return this.applicationModel
      .find({ user: user._id })
      .populate('user')
      .populate('job')
      .exec();
  }

  async updateApplicationStatus(
    updateApplicationInput: UpdateApplicationInput,
    username: string,
  ): Promise<Application> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { applicationId, status } = updateApplicationInput;
    const application = await this.applicationModel
      .findById(applicationId)
      .populate('job');
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.createBy.toString() != user._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to activate this job',
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Cannot update status unless current status is pending',
      );
    }

    application.status = status;
    application.reviewer = user._id as Types.ObjectId;
    return application.save();
  }

  async findApplicationsByJobId(
    jobId: string,
    username: string,
  ): Promise<Application[]> {
    const objectId = Types.ObjectId.isValid(jobId)
      ? new Types.ObjectId(jobId)
      : null;
    const job = await this.jobModel.findById(objectId).exec();
    if (!job) {
      throw new NotFoundException('Job listing not found');
    }
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (job.createBy.toString() != user._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to activate this job',
      );
    }

    return this.applicationModel
      .find({ job: job._id })
      .populate('user')
      .populate('job')
      .exec();
  }
}
