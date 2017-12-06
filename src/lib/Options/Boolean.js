import { boolean } from 'yup';
import Option, { MissingArgumentError, InvalidArgumentError } from '../Option';
import type Context from '../Context';
import type { OptionOptions } from '../Option'; // eslint-disable-line

export const schema: * = boolean();

export default class BooleanOption extends Option<boolean> {

  constructor(options: OptionOptions) {
    super(Object.assign({}, options, { schema }));
  }

  async getValue(context: Context): Promise<boolean> {
    if (!context.currentArg) {
      throw new Error('Cannot get value without a current arg');
    }

    const currentArg = context.currentArg;

    let value: boolean;

    try {
      value = await super.getValue(context);
    } catch (e) {
      if (e instanceof MissingArgumentError) {
        value = true;
      } else if (e instanceof InvalidArgumentError && !currentArg.value) {
        value = true;
      } else {
        throw e;
      }
    }

    return currentArg.isNegated ? !value : value;
  }

}
