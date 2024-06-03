import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  APPLICANT = 'applicant',
  COMPANY = 'company',
}

registerEnumType(Role, {
  name: 'Role',
});
