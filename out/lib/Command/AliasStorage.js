'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class AliasStorage {

  constructor(...args) {
    this._storage = args;

    this._byName = {}; // FIXME: Add initial values
  }

  add(value) {
    const length = this._storage.push(value);

    this._byName[value.name] = value;
    value.alias.forEach(alias => {
      this._byName[alias] = value;
    });

    return length;
  }

  get(name) {
    return this._byName[name];
  }

  toArray() {
    return Array.from(this._storage);
  }

}
exports.default = AliasStorage;