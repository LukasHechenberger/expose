import { number } from 'yup';
import type { Schema } from 'yup'; // eslint-disable-line
import Option from '../Option';
import type { DescribableAliasOptions } from '../Usage/Describable';

export const schema = number();

export default class NumberOption extends Option<number> {

  static get typeName(): string {
    return 'number';
  }

  constructor(options: DescribableAliasOptions) {
    super(Object.assign({}, options, { schema }));
  }

}
