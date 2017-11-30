import type Context from './Context';

export default class ExposeError extends Error {

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
