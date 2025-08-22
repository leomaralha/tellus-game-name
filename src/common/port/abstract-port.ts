/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import {
  plainToInstance,
  type ClassConstructor,
  type ClassTransformOptions,
} from 'class-transformer';
import { validateSync, type ValidationError } from 'class-validator';
import { WrongCommandParametersError } from '../errors/validation-errors/wrong-command-parameters.js';

export type AnyFunction = (...args: unknown[]) => unknown;
export type Serializable<T> = {
  [K in keyof T as T[K] extends AnyFunction | Function
    ? never
    : K]: Required<T>[K] extends AnyFunction | Function
    ? never
    : Required<T>[K] extends Date
      ? Date
      : T[K] & Serializable<T[K]>;
};

export abstract class AbstractPort extends Object {
  static create<T extends ClassConstructor<AbstractPort>>(
    this: T,
    plain: Serializable<InstanceType<T>>,
    transformOpts?: ClassTransformOptions,
  ): InstanceType<T> {
    const value = plainToInstance(
      this,
      plain,
      transformOpts ?? { excludeExtraneousValues: true },
    ) as InstanceType<T>;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errors: ValidationError[] = validateSync(value);

    if (errors.length > 0) {
      throw new WrongCommandParametersError(errors);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
