'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidArgumentError = exports.MissingArgumentError = undefined;

var _Error = require('./Error');

var _Describable = require('./Usage/Describable');

var _format = require('./Usage/format');

// eslint-disable-line
class MissingArgumentError extends _Error.UsageError {}
exports.MissingArgumentError = MissingArgumentError;
class InvalidArgumentError extends _Error.UsageError {

  constructor(message, validationError, context) {
    super(message, context);

    this.validationError = validationError;
  }

  get additionalInfo() {
    const errors = this.validationError.errors;

    if (errors.length > 1) {
      return ` - ${errors.join('\n - ')}`;
    }

    return errors[0];
  }

}

exports.InvalidArgumentError = InvalidArgumentError;
class Option extends _Describable.DescribableAlias {

  get typeName() {
    return `${this.schema._type}${this._isArrayOption ? '[]' : ''}`;
  }

  constructor(options) {
    super(options);

    this.schema = options.schema.label(options.name); // FIXME: Throw error if missing

    if (options.extendSchema) {
      this.schema = options.extendSchema(this.schema);
    }

    if (options.run) {
      this._action = options.run;
    }

    if (options.set) {
      this._setValueCallback = options.set;
    }

    this._isArrayOption = options.array || false;
  }

  async getValue(context) {
    const { currentArg } = context;

    let rawValue;
    let pickValueArg = false;

    if (!currentArg) {
      throw new Error('Cannot get value without a current arg');
    }

    if (currentArg.value) {
      rawValue = currentArg.value;
    } else {
      const nextArg = context.nextArg;
      pickValueArg = true;

      if (!nextArg || nextArg.isOption) {
        throw new MissingArgumentError(`Missing argument for '${this.name}' option`, context);
      }

      rawValue = nextArg.raw;
    }

    let value;
    try {
      value = await this.schema.validate(rawValue, { abortEarly: false });

      if (pickValueArg) {
        context.pickNextArg();
      }
    } catch (e) {
      throw new InvalidArgumentError(`Invalid value for '${this.name}' option: '${rawValue}'`, e, context);
    }

    if (this._isArrayOption) {
      value = [value];

      while (context.nextArg) {
        const nextArg = context.nextArg;

        if (nextArg.isOption || context.currentCommand.commands.get(nextArg.raw)) {
          break;
        } else {
          try {
            value.push((await this.schema.validate(nextArg.raw, { abortEarly: true })));
            context.pickNextArg();
          } catch (e) {
            break;
          }
        }
      }
    }

    return value;
  }

  async handle(context) {
    const value = await this.getValue(context);

    context.setOption(this.name, value);

    if (this._setValueCallback) {
      await Promise.resolve().then(() => this._setValueCallback && this._setValueCallback(value));
    }

    if (this._action) {
      context.setAction(this._action);
    }

    return context;
  }

  formatUsageName(usageName) {
    return super.formatUsageName(`--${usageName}`);
  }

  formatUsageAlias(alias) {
    return super.formatUsageAlias(`-${alias}`);
  }

  get usageInfo() {
    return [...super.usageInfo, (0, _format.info)(`${this.typeName}`)];
  }

}
exports.default = Option;