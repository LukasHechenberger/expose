import { boolean } from 'yup';
import Option from '../Option';
import { UsageError } from '../Error';

export const schema = boolean();

export default class BooleanOption extends Option {

  async getValue(context) {
    const { currentArg } = context;
    let value;

    if (currentArg.hasValue) {
      try {
        value = await schema.validate(currentArg.value);
      } catch (e) {
        throw new UsageError(
          `Invalid value for '${this.options.name}' option: '${currentArg.value}'`,
          context
        );
      }
    } else if (context.hasNextArg) {
      const nextArg = context.nextArg;

      try {
        value = await schema.validate(nextArg.raw);
        context.pickNextArg();
      } catch (_) {
        value = true;
      }
    } else {
      value = true;
    }

    return currentArg.isNegated ? !value : value;
  }

}
