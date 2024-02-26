// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for the target contract with the `refine` function
interface IBurntPixContract {
    // Function signature for `refine`
    function refine(bytes32 tokenId, uint256 iters) external;
}

contract HouseOfBurntPix {
    // Address of the target contract on Lukso testnet
    address public targetContractAddress = 0x12167f1c2713aC4f740B4700c4C72bC2de6C686f;

    // Mapping to keep track of refinement calls per address
    mapping(address => uint256) public refinementCount;

    // Function to refine on the target contract, with simplified name
    function refine(bytes32 tokenId, uint256 iters) public {
        // Increase the caller's refinement count
        refinementCount[msg.sender]++;

        // Cast the target address to the interface
        IBurntPixContract target = IBurntPixContract(targetContractAddress);
        
        // Call the `refine` function of the target contract with specified parameters
        target.refine(tokenId, iters);
    }
}
