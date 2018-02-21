'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class ExposeError extends Error {

  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }

}

exports.default = ExposeError;
class UsageError extends ExposeError {

  constructor(message, context) {
    super(message);

    this.context = context;
  }

}

exports.UsageError = UsageError;
class ImplementationError extends UsageError {

  get additionalInfo() {
    return `This error occured because of an incorrect implementation.
Please report it to the maintainers of the ${this.context.cli.name} package.`;
  }

}
exports.ImplementationError = ImplementationError;