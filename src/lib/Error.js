export default class ExposeError extends Error {

  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }

}

export class UsageError extends ExposeError {

  constructor(message, context) {
    super(message);

    this.context = context;
  }

}
