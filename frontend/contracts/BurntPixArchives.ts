/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface BurntPixArchivesInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "archiveCount"
      | "archiveHelpers"
      | "authorizeOperator"
      | "balanceOf"
      | "batchCalls"
      | "burntArchives"
      | "burntPicId"
      | "contributions"
      | "contributors"
      | "currentHighestLevel"
      | "fractalClone"
      | "getArchives"
      | "getContributions"
      | "getContributors"
      | "getData"
      | "getDataBatch"
      | "getDataBatchForTokenIds"
      | "getDataForTokenId"
      | "getOperatorsOf"
      | "getTopTenContributors"
      | "getTotalContributors"
      | "getTotalFeesBurnt"
      | "getTotalIterations"
      | "isOperatorFor"
      | "isOriginalUnclaimed"
      | "mintArchive(bytes32,address)"
      | "mintArchive(bytes32)"
      | "multiplier"
      | "owner"
      | "refineToArchive(uint256)"
      | "refineToArchive(uint256,address)"
      | "renounceOwnership"
      | "revokeOperator"
      | "setData"
      | "setDataBatch"
      | "setDataBatchForTokenIds"
      | "setDataForTokenId"
      | "supportsInterface"
      | "tokenIdsOf"
      | "tokenOwnerOf"
      | "tokenSupplyCap"
      | "totalSupply"
      | "transfer"
      | "transferBatch"
      | "transferOwnership"
      | "winnerIters"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "DataChanged"
      | "OperatorAuthorizationChanged"
      | "OperatorRevoked"
      | "OwnershipTransferred"
      | "RefineToArchive"
      | "TokenIdDataChanged"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "archiveCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "archiveHelpers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "authorizeOperator",
    values: [AddressLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "batchCalls",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "burntArchives",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "burntPicId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "contributions",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "contributors",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentHighestLevel",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fractalClone",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getArchives",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getContributions",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getContributors",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getData", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getDataBatch",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getDataBatchForTokenIds",
    values: [BytesLike[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getDataForTokenId",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOperatorsOf",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTopTenContributors",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalContributors",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalFeesBurnt",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalIterations",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isOperatorFor",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isOriginalUnclaimed",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintArchive(bytes32,address)",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mintArchive(bytes32)",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "multiplier",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refineToArchive(uint256)",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "refineToArchive(uint256,address)",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "revokeOperator",
    values: [AddressLike, BytesLike, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setData",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setDataBatch",
    values: [BytesLike[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setDataBatchForTokenIds",
    values: [BytesLike[], BytesLike[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setDataForTokenId",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenIdsOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOwnerOf",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenSupplyCap",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, AddressLike, BytesLike, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferBatch",
    values: [AddressLike[], AddressLike[], BytesLike[], boolean[], BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "winnerIters",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "archiveCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "archiveHelpers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "authorizeOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "batchCalls", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "burntArchives",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "burntPicId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentHighestLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fractalClone",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getArchives",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDataBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDataBatchForTokenIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDataForTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperatorsOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTopTenContributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalContributors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalFeesBurnt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalIterations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isOperatorFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isOriginalUnclaimed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintArchive(bytes32,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintArchive(bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multiplier", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refineToArchive(uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "refineToArchive(uint256,address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDataBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDataBatchForTokenIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDataForTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenIdsOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenOwnerOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenSupplyCap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "winnerIters",
    data: BytesLike
  ): Result;
}

export namespace DataChangedEvent {
  export type InputTuple = [dataKey: BytesLike, dataValue: BytesLike];
  export type OutputTuple = [dataKey: string, dataValue: string];
  export interface OutputObject {
    dataKey: string;
    dataValue: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorAuthorizationChangedEvent {
  export type InputTuple = [
    operator: AddressLike,
    tokenOwner: AddressLike,
    tokenId: BytesLike,
    operatorNotificationData: BytesLike
  ];
  export type OutputTuple = [
    operator: string,
    tokenOwner: string,
    tokenId: string,
    operatorNotificationData: string
  ];
  export interface OutputObject {
    operator: string;
    tokenOwner: string;
    tokenId: string;
    operatorNotificationData: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorRevokedEvent {
  export type InputTuple = [
    operator: AddressLike,
    tokenOwner: AddressLike,
    tokenId: BytesLike,
    notified: boolean,
    operatorNotificationData: BytesLike
  ];
  export type OutputTuple = [
    operator: string,
    tokenOwner: string,
    tokenId: string,
    notified: boolean,
    operatorNotificationData: string
  ];
  export interface OutputObject {
    operator: string;
    tokenOwner: string;
    tokenId: string;
    notified: boolean;
    operatorNotificationData: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RefineToArchiveEvent {
  export type InputTuple = [contributor: AddressLike, iters: BigNumberish];
  export type OutputTuple = [contributor: string, iters: bigint];
  export interface OutputObject {
    contributor: string;
    iters: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenIdDataChangedEvent {
  export type InputTuple = [
    tokenId: BytesLike,
    dataKey: BytesLike,
    dataValue: BytesLike
  ];
  export type OutputTuple = [
    tokenId: string,
    dataKey: string,
    dataValue: string
  ];
  export interface OutputObject {
    tokenId: string;
    dataKey: string;
    dataValue: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    operator: AddressLike,
    from: AddressLike,
    to: AddressLike,
    tokenId: BytesLike,
    force: boolean,
    data: BytesLike
  ];
  export type OutputTuple = [
    operator: string,
    from: string,
    to: string,
    tokenId: string,
    force: boolean,
    data: string
  ];
  export interface OutputObject {
    operator: string;
    from: string;
    to: string;
    tokenId: string;
    force: boolean;
    data: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface BurntPixArchives extends BaseContract {
  connect(runner?: ContractRunner | null): BurntPixArchives;
  waitForDeployment(): Promise<this>;

  interface: BurntPixArchivesInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  archiveCount: TypedContractMethod<[], [bigint], "view">;

  archiveHelpers: TypedContractMethod<[], [string], "view">;

  authorizeOperator: TypedContractMethod<
    [
      operator: AddressLike,
      tokenId: BytesLike,
      operatorNotificationData: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[tokenOwner: AddressLike], [bigint], "view">;

  batchCalls: TypedContractMethod<
    [data: BytesLike[]],
    [string[]],
    "nonpayable"
  >;

  burntArchives: TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, bigint, bigint, bigint, string] & {
        image: string;
        iterations: bigint;
        level: bigint;
        blockNumber: bigint;
        creator: string;
      }
    ],
    "view"
  >;

  burntPicId: TypedContractMethod<[], [string], "view">;

  contributions: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  contributors: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  currentHighestLevel: TypedContractMethod<[], [bigint], "view">;

  fractalClone: TypedContractMethod<[], [string], "view">;

  getArchives: TypedContractMethod<
    [contributor: AddressLike],
    [string[]],
    "view"
  >;

  getContributions: TypedContractMethod<
    [targetContributors: AddressLike[]],
    [bigint[]],
    "view"
  >;

  getContributors: TypedContractMethod<[], [string[]], "view">;

  getData: TypedContractMethod<[dataKey: BytesLike], [string], "view">;

  getDataBatch: TypedContractMethod<
    [dataKeys: BytesLike[]],
    [string[]],
    "view"
  >;

  getDataBatchForTokenIds: TypedContractMethod<
    [tokenIds: BytesLike[], dataKeys: BytesLike[]],
    [string[]],
    "view"
  >;

  getDataForTokenId: TypedContractMethod<
    [tokenId: BytesLike, dataKey: BytesLike],
    [string],
    "view"
  >;

  getOperatorsOf: TypedContractMethod<[tokenId: BytesLike], [string[]], "view">;

  getTopTenContributors: TypedContractMethod<
    [],
    [[string[], bigint[]]],
    "view"
  >;

  getTotalContributors: TypedContractMethod<[], [bigint], "view">;

  getTotalFeesBurnt: TypedContractMethod<[], [bigint], "view">;

  getTotalIterations: TypedContractMethod<[], [bigint], "view">;

  isOperatorFor: TypedContractMethod<
    [operator: AddressLike, tokenId: BytesLike],
    [boolean],
    "view"
  >;

  isOriginalUnclaimed: TypedContractMethod<[], [boolean], "view">;

  "mintArchive(bytes32,address)": TypedContractMethod<
    [archiveId: BytesLike, to: AddressLike],
    [void],
    "nonpayable"
  >;

  "mintArchive(bytes32)": TypedContractMethod<
    [archiveId: BytesLike],
    [void],
    "nonpayable"
  >;

  multiplier: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  "refineToArchive(uint256)": TypedContractMethod<
    [iters: BigNumberish],
    [void],
    "nonpayable"
  >;

  "refineToArchive(uint256,address)": TypedContractMethod<
    [iters: BigNumberish, contributor: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  revokeOperator: TypedContractMethod<
    [
      operator: AddressLike,
      tokenId: BytesLike,
      notify: boolean,
      operatorNotificationData: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  setData: TypedContractMethod<
    [dataKey: BytesLike, dataValue: BytesLike],
    [void],
    "payable"
  >;

  setDataBatch: TypedContractMethod<
    [dataKeys: BytesLike[], dataValues: BytesLike[]],
    [void],
    "payable"
  >;

  setDataBatchForTokenIds: TypedContractMethod<
    [tokenIds: BytesLike[], dataKeys: BytesLike[], dataValues: BytesLike[]],
    [void],
    "nonpayable"
  >;

  setDataForTokenId: TypedContractMethod<
    [tokenId: BytesLike, dataKey: BytesLike, dataValue: BytesLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  tokenIdsOf: TypedContractMethod<
    [tokenOwner: AddressLike],
    [string[]],
    "view"
  >;

  tokenOwnerOf: TypedContractMethod<[tokenId: BytesLike], [string], "view">;

  tokenSupplyCap: TypedContractMethod<[], [bigint], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BytesLike,
      force: boolean,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  transferBatch: TypedContractMethod<
    [
      from: AddressLike[],
      to: AddressLike[],
      tokenId: BytesLike[],
      force: boolean[],
      data: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  winnerIters: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "archiveCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "archiveHelpers"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "authorizeOperator"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      tokenId: BytesLike,
      operatorNotificationData: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[tokenOwner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "batchCalls"
  ): TypedContractMethod<[data: BytesLike[]], [string[]], "nonpayable">;
  getFunction(
    nameOrSignature: "burntArchives"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, bigint, bigint, bigint, string] & {
        image: string;
        iterations: bigint;
        level: bigint;
        blockNumber: bigint;
        creator: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "burntPicId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "contributions"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "contributors"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "currentHighestLevel"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "fractalClone"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getArchives"
  ): TypedContractMethod<[contributor: AddressLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "getContributions"
  ): TypedContractMethod<
    [targetContributors: AddressLike[]],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getContributors"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getData"
  ): TypedContractMethod<[dataKey: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getDataBatch"
  ): TypedContractMethod<[dataKeys: BytesLike[]], [string[]], "view">;
  getFunction(
    nameOrSignature: "getDataBatchForTokenIds"
  ): TypedContractMethod<
    [tokenIds: BytesLike[], dataKeys: BytesLike[]],
    [string[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getDataForTokenId"
  ): TypedContractMethod<
    [tokenId: BytesLike, dataKey: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getOperatorsOf"
  ): TypedContractMethod<[tokenId: BytesLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "getTopTenContributors"
  ): TypedContractMethod<[], [[string[], bigint[]]], "view">;
  getFunction(
    nameOrSignature: "getTotalContributors"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getTotalFeesBurnt"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getTotalIterations"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "isOperatorFor"
  ): TypedContractMethod<
    [operator: AddressLike, tokenId: BytesLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isOriginalUnclaimed"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "mintArchive(bytes32,address)"
  ): TypedContractMethod<
    [archiveId: BytesLike, to: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "mintArchive(bytes32)"
  ): TypedContractMethod<[archiveId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "multiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "refineToArchive(uint256)"
  ): TypedContractMethod<[iters: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "refineToArchive(uint256,address)"
  ): TypedContractMethod<
    [iters: BigNumberish, contributor: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "revokeOperator"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      tokenId: BytesLike,
      notify: boolean,
      operatorNotificationData: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setData"
  ): TypedContractMethod<
    [dataKey: BytesLike, dataValue: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setDataBatch"
  ): TypedContractMethod<
    [dataKeys: BytesLike[], dataValues: BytesLike[]],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setDataBatchForTokenIds"
  ): TypedContractMethod<
    [tokenIds: BytesLike[], dataKeys: BytesLike[], dataValues: BytesLike[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setDataForTokenId"
  ): TypedContractMethod<
    [tokenId: BytesLike, dataKey: BytesLike, dataValue: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "tokenIdsOf"
  ): TypedContractMethod<[tokenOwner: AddressLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "tokenOwnerOf"
  ): TypedContractMethod<[tokenId: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "tokenSupplyCap"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BytesLike,
      force: boolean,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferBatch"
  ): TypedContractMethod<
    [
      from: AddressLike[],
      to: AddressLike[],
      tokenId: BytesLike[],
      force: boolean[],
      data: BytesLike[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "winnerIters"
  ): TypedContractMethod<[], [bigint], "view">;

  getEvent(
    key: "DataChanged"
  ): TypedContractEvent<
    DataChangedEvent.InputTuple,
    DataChangedEvent.OutputTuple,
    DataChangedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorAuthorizationChanged"
  ): TypedContractEvent<
    OperatorAuthorizationChangedEvent.InputTuple,
    OperatorAuthorizationChangedEvent.OutputTuple,
    OperatorAuthorizationChangedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorRevoked"
  ): TypedContractEvent<
    OperatorRevokedEvent.InputTuple,
    OperatorRevokedEvent.OutputTuple,
    OperatorRevokedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RefineToArchive"
  ): TypedContractEvent<
    RefineToArchiveEvent.InputTuple,
    RefineToArchiveEvent.OutputTuple,
    RefineToArchiveEvent.OutputObject
  >;
  getEvent(
    key: "TokenIdDataChanged"
  ): TypedContractEvent<
    TokenIdDataChangedEvent.InputTuple,
    TokenIdDataChangedEvent.OutputTuple,
    TokenIdDataChangedEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "DataChanged(bytes32,bytes)": TypedContractEvent<
      DataChangedEvent.InputTuple,
      DataChangedEvent.OutputTuple,
      DataChangedEvent.OutputObject
    >;
    DataChanged: TypedContractEvent<
      DataChangedEvent.InputTuple,
      DataChangedEvent.OutputTuple,
      DataChangedEvent.OutputObject
    >;

    "OperatorAuthorizationChanged(address,address,bytes32,bytes)": TypedContractEvent<
      OperatorAuthorizationChangedEvent.InputTuple,
      OperatorAuthorizationChangedEvent.OutputTuple,
      OperatorAuthorizationChangedEvent.OutputObject
    >;
    OperatorAuthorizationChanged: TypedContractEvent<
      OperatorAuthorizationChangedEvent.InputTuple,
      OperatorAuthorizationChangedEvent.OutputTuple,
      OperatorAuthorizationChangedEvent.OutputObject
    >;

    "OperatorRevoked(address,address,bytes32,bool,bytes)": TypedContractEvent<
      OperatorRevokedEvent.InputTuple,
      OperatorRevokedEvent.OutputTuple,
      OperatorRevokedEvent.OutputObject
    >;
    OperatorRevoked: TypedContractEvent<
      OperatorRevokedEvent.InputTuple,
      OperatorRevokedEvent.OutputTuple,
      OperatorRevokedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RefineToArchive(address,uint256)": TypedContractEvent<
      RefineToArchiveEvent.InputTuple,
      RefineToArchiveEvent.OutputTuple,
      RefineToArchiveEvent.OutputObject
    >;
    RefineToArchive: TypedContractEvent<
      RefineToArchiveEvent.InputTuple,
      RefineToArchiveEvent.OutputTuple,
      RefineToArchiveEvent.OutputObject
    >;

    "TokenIdDataChanged(bytes32,bytes32,bytes)": TypedContractEvent<
      TokenIdDataChangedEvent.InputTuple,
      TokenIdDataChangedEvent.OutputTuple,
      TokenIdDataChangedEvent.OutputObject
    >;
    TokenIdDataChanged: TypedContractEvent<
      TokenIdDataChangedEvent.InputTuple,
      TokenIdDataChangedEvent.OutputTuple,
      TokenIdDataChangedEvent.OutputObject
    >;

    "Transfer(address,address,address,bytes32,bool,bytes)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
