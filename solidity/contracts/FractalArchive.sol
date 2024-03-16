// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import {ArchiveData} from "./common.sol";
import {FractalShared} from "./FractalShared.sol";

contract FractalArchive is FractalShared {
    // create a new fractal archive
    constructor(
        address _registry,
        address _codehub,
        ArchiveData memory _archive
    ){
        registry = _registry;
        codehub  = _codehub;
        canvas   = _archive.canvas;
        iterations = _archive.iterations;
        gasused    = _archive.gasused;
        feesburnt  = _archive.feesburnt;
        tipspaid   = _archive.tipspaid;
    }
}
