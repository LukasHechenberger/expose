import { string } from 'yup';
import Option from '../Option';

export const schema = string();

export default class StringOption extends Option {

  constructor(options = {}) {
    super(Object.assign({ schema }, options));
  }

}
