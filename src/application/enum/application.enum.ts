import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
});
