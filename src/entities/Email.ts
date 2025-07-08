export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`${email.toString} is not a valid email address`);
    this.name = "InvalidEmailError";
  }
}

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new InvalidEmailError(email);
    }

    return new Email(email);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toString(): string {
    return this.value;
  }
}
