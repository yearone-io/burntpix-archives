// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import {FractalArchive} from "./FractalArchive.sol";
import "./common.sol";

contract FractalArchiveFactory {
    // create a new fractal archive
    function create(
        address _codehub,
        ArchiveData calldata _archive
    ) external returns (FractalArchive) {
        return new FractalArchive(msg.sender, _codehub, _archive);
    }
}