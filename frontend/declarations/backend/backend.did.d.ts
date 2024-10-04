import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getShaderCode' : ActorMethod<[], string>,
  'getShaderExamples' : ActorMethod<[], Array<[string, string]>>,
  'getTime' : ActorMethod<[], bigint>,
  'updateShaderCode' : ActorMethod<[string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
