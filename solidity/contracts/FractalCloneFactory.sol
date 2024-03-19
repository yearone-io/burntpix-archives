// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import {FractalClone} from "./FractalClone.sol";

contract FractalCloneFactory {
    function createFractalClone(address codehub, uint256 seed) external returns (address) {
        FractalClone fractalClone = new FractalClone(codehub, seed);
        return address(fractalClone);
    }
}
