import { name, secondary, desc } from './format';

export type DescribableOptions = {
  name: string,
  description?: string,
};

export default class Describable {

  name: string
  description: string

  constructor(options: DescribableOptions) {
    this.name = options.name;
    this.description = options.description || '';
  }

}

export type DescribableAliasOptions = DescribableOptions & {
  alias?: (string | string[]),
}

export class DescribableAlias extends Describable {

  alias: string[]

  constructor(options: DescribableAliasOptions) {
    super(options);

    if (options.alias) {
      this.alias = Array.isArray(options.alias) ? options.alias : [options.alias];
    } else {
      this.alias = [];
    }
  }

  get usageInfoName(): string {
    let nameText = this.name;

    if (this.alias.length) {
      nameText = `${nameText} ${secondary(
        this.alias.map(a => `-${a}`).join(', ')
      )}`;
    }

    return nameText;
  }

  get usageInfo(): string[] {
    return [name(this.usageInfoName), desc(this.description)];
  }

}
