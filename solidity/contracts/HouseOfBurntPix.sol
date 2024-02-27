// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for the target contract with the `refine` function
interface IBurntPixContract {
    // Function signature for `refine`
    function refine(bytes32 tokenId, uint256 iters) external;
}

contract HouseOfBurntPix {
    address public targetContractAddress;
    address public targetTokenId;

    constructor(
        address _targetContractAddress,
        address _targetTokenId
    ) {
        require(_targetContractAddress != address(0), "Invalid target contract address");
        require(_targetTokenId != address(0), "Invalid target token ID");
        targetContractAddress = _targetContractAddress;
        targetTokenId = _targetTokenId;
    }

    // Mapping to keep track of refinement calls per address
    mapping(address => uint256) public refinementCount;

    // Function to refine on the target contract, with simplified name
    function refine(uint256 iters) public {
        // Increase the caller's refinement count
        refinementCount[msg.sender]++;

        // Cast the target address to the interface
        IBurntPixContract target = IBurntPixContract(targetContractAddress);
        
        // Call the `refine` function of the target contract with specified parameters
        target.refine(targetTokenId, iters);
    }
}
