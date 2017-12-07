declare module 'ava' {
  declare class ExecutionObject {
    is(a: any, b: any): void;
  }

  declare type Implementation = (t: ExecutionObject) => void;

  declare class AVA {
    serial(title?: string, implementation: Implementation): void;
    cb(title?: string, implementation: Implementation): void;
    only(title?: string, implementation: Implementation): void;
    skip(title?: string, implementation: Implementation): void;
    todo(title: string): void;
    failing(title?: string, implementation: Implementation): void;
    before(title?: string, implementation: Implementation): void;
    after(title?: string, implementation: Implementation): void;
    beforeEach(title?: string, implementation: Implementation): void;
    afterEach(title?: string, implementation: Implementation): void;
  }

  declare var test: (title?: string, implementation: Implementation) => void & AVA;

  declare export default typeof test;
}
