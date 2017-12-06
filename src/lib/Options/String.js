import { string } from 'yup';
import type { Schema } from 'yup'; // eslint-disable-line
import Option from '../Option';
import type { OptionOptions } from '../Option'; // eslint-disable-line

export const schema: Schema<string> = string();

export default class StringOption extends Option<string> {

  constructor(options: OptionOptions) {
    super(Object.assign({}, options, { schema }));
  }

}
