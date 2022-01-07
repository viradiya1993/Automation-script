import { FileValuePair } from "./file-value-pair.model";
import { Locator } from "./locator.model";
import { TestScriptValuePair } from "./test-script-value-pair.model";

export interface Params {
  number: ParameterValue;
  text: ParameterValue;
  variable: ParameterValue;
  password?: ParameterValue;
  cookie: ParameterValue;
  expected: ParameterValue;
  test: TestScriptValuePair;
  file: FileValuePair;
  uiLocator: Locator;
  uiTable: Locator;
}

export interface ParameterValue {
  type: ValueType;
  value: string;
}

export enum ValueType {
  Undefined = -1,
  Data = 0,
  Column = 1,
  Configuration = 2
}
