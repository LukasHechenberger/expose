// @flow
import type { Schema, ValidationError } from 'yup';
import { UsageError } from './Error';
import { DescribableAlias } from './Usage/Describable';
import { info } from './Usage/format';
import type { DescribableAliasOptions } from './Usage/Describable'; // eslint-disable-line
import type { ArgumentHandler } from './ArgumentHandler';
import type Context, { RunAction } from './Context';

export type OptionValue = string | number | boolean;
export type SetValueCallback = (OptionValue) => any

export class MissingArgumentError extends UsageError {}
export class InvalidArgumentError extends UsageError {

  +validationError: ValidationError

  constructor(message: string, validationError: ValidationError, context: Context) {
    super(message, context);

    this.validationError = validationError;
  }

  get additionalInfo(): string {
    const errors = this.validationError.errors;

    if (errors.length > 1) {
      return ` - ${errors.join('\n - ')}`;
    }

    return errors[0];
  }

}

export type TypedOptionOptions<T> = DescribableAliasOptions & {
  run?: RunAction,
  set?: SetValueCallback,
  array?: boolean,
  extendSchema?: (schema: Schema<T>) => Schema<T>,
}

export type RawOptionOptions<T> = TypedOptionOptions<T> & {
  schema: Schema<T>,
}

export default class Option<T: OptionValue> extends DescribableAlias implements ArgumentHandler {

  name: string
  alias: string[]
  schema: Schema<T>
  _action: ?RunAction
  _setValueCallback: ?SetValueCallback
  _isArrayOption: boolean

  get typeName(): string {
    return `${this.schema._type}${this._isArrayOption ? '[]' : ''}`;
  }

  constructor(options: RawOptionOptions<T>) {
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

  async getValue(context: Context): Promise<T | T[]> {
    const { currentArg } = context;

    let rawValue: string;
    let pickValueArg: boolean = false;

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

    let value: T | T[];
    try {
      value = await this.schema.validate(rawValue, { abortEarly: false });

      if (pickValueArg) {
        context.pickNextArg();
      }
    } catch (e) {
      throw new InvalidArgumentError(
        `Invalid value for '${this.name}' option: '${rawValue}'`,
        e,
        context
      );
    }

    if (this._isArrayOption) {
      value = [value];

      while (context.nextArg) {
        const nextArg = context.nextArg;

        if (nextArg.isOption || context.currentCommand.commands.get(nextArg.raw)) {
          break;
        } else {
          try {
            value.push(await this.schema.validate(nextArg.raw, { abortEarly: true }));
            context.pickNextArg();
          } catch (e) {
            break;
          }
        }
      }
    }

    return value;
  }

  async handle(context: Context): Promise<Context> {
    const value: any = await this.getValue(context);

    context.setOption(this.name, value);

    if (this._setValueCallback) {
      await Promise.resolve()
        .then(() => this._setValueCallback && this._setValueCallback(value));
    }

    if (this._action) {
      context.setAction(this._action);
    }

    return context;
  }

  formatUsageName(usageName: string): string {
    return super.formatUsageName(`--${usageName}`);
  }

  formatUsageAlias(alias: string): string {
    return super.formatUsageAlias(`-${alias}`);
  }

  get usageInfo(): string[] {
    return [...super.usageInfo, info(`${this.typeName}`)];
  }

}
