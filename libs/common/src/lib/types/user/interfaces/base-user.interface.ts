export interface BaseUser {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly rank?: number;
}
