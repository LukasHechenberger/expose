import { boolean } from 'yup';
import Option, { MissingArgumentError, InvalidArgumentError } from '../Option';
import type Context from '../Context';
import type { TypedOptionOptions } from '../Option'; // eslint-disable-line

export const schema: * = boolean();

export default class BooleanOption extends Option<boolean> {

  constructor(options: TypedOptionOptions<boolean>) {
    super(Object.assign({}, options, { schema }));
  }

  async getValue(context: Context): Promise<boolean | boolean[]> {
    if (!context.currentArg) {
      throw new Error('Cannot get value without a current arg');
    }

    const currentArg = context.currentArg;

    let value: boolean | boolean[];

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

    if (currentArg.isNegated) {
      if (Array.isArray(value)) {
        return value.map(v => !v);
      }

      return !value;
    }

    return currentArg.isNegated ? !value : value;
  }

}
