import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  isAdmin: boolean;
}
