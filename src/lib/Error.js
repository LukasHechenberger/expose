import type Context from './Context';

export default class ExposeError extends Error {

  +additionalInfo: ?string

  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }

}

export class UsageError extends ExposeError {

  context: Context

  constructor(message: string, context: Context) {
    super(message);

    this.context = context;
  }

}

export class ImplementationError extends UsageError {

  get additionalInfo(): string {
    return `This error occured because of an incorrect implementation.
Please report it to the maintainers of the ${this.context.cli.name} package.`;
  }

}
