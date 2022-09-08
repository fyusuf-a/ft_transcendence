export { PickType, OmitType, PartialType } from '@nestjs/mapped-types';

export interface ApiPropertyOptions {
  description?: string;
  enumName?: string;
  enum?: unknown[] | Record<string, unknown>;
  type?: Type<unknown> | string | Record<string, unknown>;
  examples?: unknown[] | Record<string, unknown>;
  isArray?: boolean;
  minimum?: number;
  maximum?: number;
  default?: unknown;
  format?: string;
}

// eslint-disable-next-line
export function ApiProperty(_: ApiPropertyOptions = {}) {
  // eslint-disable-next-line
  return function (object, property: string | symbol) {};
}

// eslint-disable-next-line
export function ApiPropertyOptional(_: ApiPropertyOptions = {}) {
  // eslint-disable-next-line
  return function (object, property: string | symbol) {}
}
