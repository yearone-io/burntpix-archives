// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import {FractalClone} from "./FractalClone.sol";

contract FractalCloneFactory {
    // create a new fractal that can be iterated and rendered.
    function create(
        address _codehub,
        uint256 _seed
    ) external returns (FractalClone) {
        return new FractalClone(msg.sender, _codehub, _seed);
    }
}