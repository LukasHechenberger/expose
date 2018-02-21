// @flow
import type Context from './Context';

export interface ArgumentHandler {

  handle(context: Context): Promise<Context>

}
