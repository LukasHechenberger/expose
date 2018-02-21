import type { DescribableAlias } from '../Usage/Describable';

export default class AliasStorage<T: DescribableAlias> {

  _storage: Array<T>
  _byName: { [name: string]: T }

  constructor(...args: T[]) {
    this._storage = args;

    this._byName = {}; // FIXME: Add initial values
  }

  add(value: T): number {
    const length: number = this._storage.push(value);

    this._byName[value.name] = value;
    value.alias.forEach((alias: string) => {
      this._byName[alias] = value;
    });

    return length;
  }

  get(name: string): ?T {
    return this._byName[name];
  }

  toArray(): Array<T> {
    return Array.from(this._storage);
  }

}
