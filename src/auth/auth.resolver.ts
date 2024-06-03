import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '../user/user.schema';
import { LoginInput } from './dto/login.input';
import { RegisterApplicateInput } from './dto/register-applicate.input';
import { RegisterCompanyInput } from './dto/register-company.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenOutput } from './dto/access-token-output.dto';
import { Role } from '../user/enum/role.enum';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Mutation(() => AccessTokenOutput)
  async registerApplicate(
    @Args('data') { username, password }: RegisterApplicateInput,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
      role: Role.APPLICANT,
    });
    await user.save();
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  @Mutation(() => AccessTokenOutput)
  async registerCompany(
    @Args('data') { username, password, companyName }: RegisterCompanyInput,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
      role: Role.COMPANY,
      companyName: companyName,
    });
    await user.save();
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
  @Mutation(() => AccessTokenOutput)
  async login(
    @Args('data') { username, password }: LoginInput,
  ): Promise<{ access_token: string }> {
    const token = await this.authService.signIn(username, password);
    return { access_token: token };
  }
}
