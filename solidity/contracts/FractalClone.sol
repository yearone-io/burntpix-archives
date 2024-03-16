// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import "./codehub.sol";
import {FractalShared} from "./FractalShared.sol";

contract FractalClone is FractalShared {
    // create a new fractal that can be iterated and rendered.
    constructor(
        address _registry,
        address _codehub,
        uint256 _seed
    ){
        registry = _registry;
        codehub  = _codehub;
        (bool ok, ) = CodeHub(codehub).attractor().delegatecall(
            abi.encodeWithSignature("init(uint256,uint256,uint256)", _seed, 64, 64)
        );
        require(ok);
    }
}
