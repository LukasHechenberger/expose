import { UsageError } from './Error';

export default class Option {

  constructor(options = {}) {
    this.options = options;
    this.schema = options.schema; // FIXME: Throw error if missing
  }

  async getValue(context) {
    const { currentArg } = context;

    let rawValue;

    if (currentArg.hasValue) {
      rawValue = currentArg.value;
    } else if (!context.hasNextArg || context.nextArg.isOption) {
      throw new UsageError(`Missing argument for '${this.options.name}' option`, context);
    } else {
      rawValue = context.pickNextArg().raw;
    }

    try {
      return await this.schema.validate(rawValue);
    } catch (e) {
      throw new UsageError(
        `Invalid value for '${this.options.name}' option: '${currentArg.value}'`,
        context
      );
    }
  }

  async handle(context) {
    const value = await this.getValue(context);

    context.setOption(this.options.name, value);

    return context;
  }

}
