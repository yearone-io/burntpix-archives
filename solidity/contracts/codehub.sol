// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// CodeHub tracks the current implementation contracts of various delegated
// fractal operations. The purpose is to make the system upgradeable if some
// bug is discovered or a polish is to be published.
contract CodeHub is Ownable {
    address public attractor; // Global attractor to refine fractals with
    address public pixelator; // Global pixelator to rasterize fractals with
    address public publisher; // Global publisher to generate consumable metadata

    // Creates a new instance of the CodeHub, initially empty with only the owner
    // specified that can upgrade afterwards.
    constructor() Ownable() {}

    // updateAttractor swaps out the attractor implementation to the specified
    // contract. Make sure the API is compatible as all deployed fractals will
    // start using it.
    function updateAttractor(address _attractor) public onlyOwner {
        attractor = _attractor;
    }

    // updatePixelator swaps out the pixelator implementation to the specified
    // contract. Make sure the API is compatible as all deployed fractals will
    // start using it.
    function updatePixelator(address _pixelator) public onlyOwner {
        pixelator = _pixelator;
    }

    // updatePublisher swaps out the publisher implementation to the specified
    // contract. Make sure the API is compatible as all deployed fractals will
    // start using it.
    function updatePublisher(address _publisher) public onlyOwner {
        publisher = _publisher;
    }
}