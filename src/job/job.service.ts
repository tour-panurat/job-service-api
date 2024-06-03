import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from './job.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,

    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createJob(title: string, description: string, createBy: string) {
    const companyRecord = await this.userModel.findOne({
      username: createBy,
    });
    if (!companyRecord) {
      throw new UnauthorizedException('Company not found');
    }
    const job = new this.jobModel({
      title,
      description,
      createBy: companyRecord._id,
    });
    return job.save();
  }

  async findOne(jobId: string): Promise<Job | undefined> {
    return this.jobModel.findOne({ _id: new Types.ObjectId(jobId) });
  }

  async activeJob(id: string, user: User) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
    if (!objectId) {
      throw new NotFoundException('Invalid ID');
    }
    const job = await this.jobModel
      .findByIdAndUpdate(objectId, { isOpen: true }, { new: true })
      .exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const userCheck = await this.userModel.findOne({
      username: user.username,
    });
    if (!userCheck) {
      throw new NotFoundException('User not found');
    }
    if (job.createBy.toString() != userCheck._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to activate this job',
      );
    }
    return job;
  }

  async closeJob(id: string, user: User) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
    if (!objectId) {
      throw new NotFoundException('Invalid ID');
    }
    const job = await this.jobModel
      .findByIdAndUpdate(objectId, { isOpen: false }, { new: true })
      .exec();
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const userCheck = await this.userModel.findOne({
      username: user.username,
    });
    if (!userCheck) {
      throw new NotFoundException('User not found');
    }
    if (job.createBy.toString() != userCheck._id.toString()) {
      throw new ForbiddenException(
        'You are not authorized to activate this job',
      );
    }
    return job;
  }

  async getJobListings(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ jobs: Job[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const totalCount = await this.jobModel
      .countDocuments({ isOpen: true })
      .exec();
    const jobs = await this.jobModel
      .find({ isOpen: true })
      .populate('createBy')
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(totalCount / limit);
    return { jobs, totalPages };
  }

  async getApplications(companyId: string) {
    return this.jobModel.find({ company: companyId }).populate('applicants');
  }
}
