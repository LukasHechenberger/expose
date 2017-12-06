declare module 'yup' {
  // Typedefs
  declare type SchemaDescription = {
    type: string;
    label: string;
    meta: {};
    tests: Array<string>;
  };

  declare type ValidationOptions = {
    strict: ?boolean; // default to false;
    abortEarly: ?boolean; // default to true;
    stripUnknown: ?boolean; // defaults to false;
    recursive: ?boolean; // defaults to true;
    context: ?{};
  }

  // Classes
  declare export class Schema<T> {
    _type: string;
    clone(): Schema<T>;
    label(label: string): Schema<T>;
    meta(metadata: {}): Schema<T>;
    describe(): SchemaDescription;
    concat(schema: Schema<T>): void;
    validate(value: any, options?: ValidationOptions): Promise<T>; // Rejects with ValidationError
    validateSync(value: any, options?: ValidationOptions): T;
    isValid(value: any, options?: ValidationOptions): Promise<boolean>;
    isValidSync(value: any, options: ?ValidationOptions): boolean;
    cast(value: any): any;
    isType(value: any): boolean;
    strict(isStrict: ?boolean): Schema<T>; // isStrict defaults to false
    strip(stripField: ?boolean): Schema<T>; // stripField default to true
    withMutation(builder: (current: Schema<T>) => void): void;
    default(value: any): Schema<T>;
    default(): any;
    nullable(isNullable: boolean): Schema<T>; // isNullable default to false
    required(message: ?string): Schema<T>;
    typeError(message: string): Schema<T>;
    oneOf(arrayOfValues: Array<any>, message: ?string): Schema<T>;
    equals(arrayOfValues: Array<any>, message: ?string): Schema<T>; // alias
    notOneOf(arrayOfValues: Array<any>, message: ?string): Schema<T>;
    when(keys: string | string[], builder: {} | (value: any, schema: Schema<T>) => Schema<T>): Schema<T>;
    test(name: string, message: string, test: (value: any) => boolean): Schema<T>;
    test(options: {}): Schema<T>;
    transform(transformer: (currentValue: any, originalValue: any) => any): Schema<T>
  }

  declare export class MixedSchema extends Schema<mixed> {}

  declare export class StringSchema extends Schema<string> {
    min(limit: number | Ref, message: ?string): StringSchema;
    max(limit: number | Ref, message: ?string): StringSchema;
    matches(regex: RegExp, message: ?string): StringSchema;
    matches(regex: RegExp, options: { message: string, excludeEmptyString: bool }): StringSchema;
    email(message: ?string): StringSchema;
    url(message: ?string): StringSchema;
    ensure(): StringSchema;
    trim(message: ?string): StringSchema;
    lowercase(message: ?string): StringSchema;
    uppercase(message: ?string): StringSchema;
  }

  declare export class NumberSchema extends Schema<number> {
    min(limit: number | Ref, message: ?string): NumberSchema;
    max(limit: number | Ref, message: ?string): NumberSchema;
    positive(message: ?string): NumberSchema;
    negative(message: ?string): NumberSchema;
    integer(message: ?string): NumberSchema;
    truncate(): NumberSchema;
    round(type?: 'floor' | 'ceil' | 'trunc' | 'round'): NumberSchema; // type default to round
  }

  declare export class BooleanSchema extends Schema<boolean> {
  }

  declare export class DateSchema extends Schema<Date> {
    min(limit: Date | string | Ref, message: ?string): DateSchema;
    max(limit: Date | string | Ref, message: ?string): DateSchema;
  }

  declare export class ArraySchema extends Schema<Array<mixed>> {
    of(type: Schema<any>): ArraySchema;
    min(limit: number | Ref, message: ?string): ArraySchema;
    max(limit: number | Ref, message: ?string): ArraySchema;
    ensure(): ArraySchema;
    compact(rejector: (value: any) => boolean): ArraySchema;
  }

  declare export class ObjectSchema extends Schema<{}> {
    shape(fields: object, noSortEdges: ?Array<[string, string]>): ObjectSchema;
    from(fromKey: string, toKey: string, alias?: boolean): ObjectSchema; // alias default to false
    noUnknown(onlyKnownKeys?: boolean, message?: string): ObjectSchema; // onlyKnownKeys default to true
    camelCase(): ObjectSchema;
    constantCase(): ObjectSchema;
  }

  declare class Ref {}
  declare class Lazy {}

  // Methods
  declare export function reach(schema: Schema<any>, path: string, value: ?{}, context: ?{}): Schema<any>;
  declare export function addMethod(schemaType: Schema<any>, name: string, method: () => Schema<any>): void;
  declare export function ref(path: string, options: { contextPrefix: string }): Ref;
  declare export function lazy(callback: (value: any) => Schema<any>): Lazy;

  // Exported Classes
  declare export class ValidationError {
    name: 'ValidationError';
    path: ?string;
    errors: string[]; // TODO: Validate
    inner: ?ValidationError[];
    constructor(errors: string | Array<string>, value: any, path: string): ValidationError;
  }

  // Types
  declare export function mixed(): MixedSchema;
  declare export function string(): StringSchema;
  declare export function number(): NumberSchema;
  declare export function boolean(): BooleanSchema;
  declare export function date(): DateSchema;
  declare export function array(): ArraySchema;
  declare export function object(fields?: { [string]: Schema<any> }): ObjectSchema;
}
