// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

struct Contribution {
    bytes32[] archiveIds;
    uint256 iterations;
}

// Registry implements the NFT existence and ownership tracking.
contract ReturnSizedArray {
    address[] public contributors;
    mapping(address => Contribution) public contributions;

    constructor() {
        contributors.push(msg.sender);
        contributions[msg.sender].iterations = 1;
        contributions[msg.sender].archiveIds.push(keccak256(abi.encodePacked(msg.sender)));
    }

    function getTopTenContributors()
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory topContributors;
        uint256[] memory topIterations;

        for (uint256 i = 0; i < contributors.length; i++) {
            uint256 iterations = contributions[contributors[i]].iterations;

            for (uint256 j = 0; j < topIterations.length; j++) {
                if (iterations > topIterations[j]) {
                    for (uint256 k = topIterations.length - 1; k > j; k--) {
                        topIterations[k] = topIterations[k - 1];
                        topContributors[k] = topContributors[k - 1];
                    }
                    topIterations[j] = iterations;
                    topContributors[j] = contributors[i];
                    break;
                }
            }
        }

        return (topContributors, topIterations);
    }
}
