import { number } from 'yup';
import type { Schema } from 'yup'; // eslint-disable-line
import Option from '../Option';
import type { TypedOptionOptions } from '../Option'; // eslint-disable-line

export const schema = number();

export default class NumberOption extends Option<number> {

  constructor(options: TypedOptionOptions<number>) {
    super(Object.assign({}, options, { schema }));
  }

}
