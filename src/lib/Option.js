import type { Schema } from 'yup';
import { UsageError } from './Error';
import { DescribableAlias } from './Usage/Describable';
import type { DescribableAliasOptions } from './Usage/Describable'; // eslint-disable-line
import type { ArgumentHandler } from './ArgumentHandler';
import type Context from './Context';

export type OptionValue = string | number | boolean;

export class MissingArgumentError extends UsageError {}
export class InvalidArgumentError extends UsageError {}

export default class Option<T: OptionValue> extends DescribableAlias implements ArgumentHandler {

  name: string
  alias: string[]
  schema: Schema<T>

  static get typeName(): string {
    throw new Error('Must be implemented by all subclasses');
  }

  constructor(options: DescribableAliasOptions & { schema: Schema<*> }) {
    super(options);

    this.schema = options.schema; // FIXME: Throw error if missing
  }

  async getValue(context: Context): Promise<T> {
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

    try {
      const converted: any = await this.schema.validate(rawValue);

      if (pickValueArg) {
        context.pickNextArg();
      }

      return converted;
    } catch (e) {
      throw new InvalidArgumentError(
        `Invalid value for '${this.name}' option: '${rawValue}'`,
        context
      );
    }
  }

  async handle(context: Context): Promise<Context> {
    const value: any = await this.getValue(context);

    context.setOption(this.name, value);

    return context;
  }

}
