export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserProps {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
}

export class User {
  private _userId?: string;
  readonly email: string;
  readonly createdAt: Date;

  username: string;
  name: string;
  passwordHash: string;
  role: UserRole;

  private constructor(
    props: UserProps,
    createdAt: Date,
    role: UserRole = UserRole.USER,
    userId?: string
  ) {
    this._userId = userId;
    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.name = props.name;
    this.role = role;
    this.createdAt = createdAt;
  }

  static create(props: UserProps): User {
    return new User(props, new Date(), UserRole.USER);
  }

  setUserId(id: string) {
    if (this._userId)
      throw new Error("userId sudah diset dan tidak boleh diubah");
    this._userId = id;
  }
}
