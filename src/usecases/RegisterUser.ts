import { Email } from "../entities/Email";
import { User, UserProps } from "../entities/User";

export class PasswordConfirmationError extends Error {
  constructor() {
    super("Password and confirmation password do not match.");
    this.name = "PasswordConfirmationError";
  }
}

export class PasswordLengthError extends Error {
  constructor(minLength: number = 8) {
    super(`Password must be at least ${minLength} characters long.`);
    this.name = "PasswordTooShortError";
  }
}

export class EmailUsedError extends Error {
  constructor(email: Email) {
    super(`The email "${email.toString()}" is already in use.`);
    this.name = "EmailAlreadyUsedError";
  }
}

export interface RegisterUserInput {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface IUserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<number>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<void> {
    if (input.password !== input.passwordConfirm) {
      throw new PasswordConfirmationError();
    }

    if (input.password.length < 8) {
      throw new PasswordLengthError(8);
    }

    const email = Email.create(input.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailUsedError(email);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const userProps: UserProps = {
      username: input.username,
      name: input.name,
      email: input.email,
      passwordHash,
    };

    const user = User.create(userProps);
    await this.userRepository.save(user);
  }
}
