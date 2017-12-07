'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DescribableAlias = undefined;

var _format = require('./format');

class Describable {

  constructor(options) {
    this.name = options.name;
    this.description = options.description || '';
  }

}

exports.default = Describable;
class DescribableAlias extends Describable {

  constructor(options) {
    super(options);

    if (options.alias) {
      this.alias = Array.isArray(options.alias) ? options.alias : [options.alias];
    } else {
      this.alias = [];
    }
  }

  formatUsageName(usageName) {
    return (0, _format.name)(usageName);
  }

  formatUsageAlias(alias) {
    return (0, _format.secondary)(alias);
  }

  get usageInfoName() {
    let nameText = this.name;

    if (this.alias.length) {
      nameText = `${nameText}${(0, _format.secondary)(`, ${this.alias.map(a => this.formatUsageAlias(a)).join(', ')}`)}`;
    }

    return this.formatUsageName(nameText);
  }

  get usageInfo() {
    return [(0, _format.name)(this.usageInfoName), (0, _format.desc)(this.description)];
  }

}
exports.DescribableAlias = DescribableAlias;