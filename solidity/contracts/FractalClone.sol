// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

// Fractal
import "./common.sol";
import "./codehub.sol";

import { IERC165 }  from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { ERC725YCore, IERC725Y } from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import                 "@erc725/smart-contracts/contracts/errors.sol";

// House
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

interface IRegistry {
    function refine(bytes32 tokenId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
}

// Fractal represents a single specific instance of fractal that can used the
// global singleton attractor to iterate its data.
contract FractalClone is IERC165, IERC725Y {
    address public registry; // Registry to which this fractal belongs to
    address internal codehub;  // Repository to access implementation code through

    uint256    internal seed;   // Pseudo-random number generator state
    Canvas     internal canvas; // In-progress rendering state and image dimensions
    Function[] internal funcs;  // Functions composing the attractor
    State      internal state;  // Coordinate and color of the iterator

    uint256 public iterations; // Amount of iterations done cumulatively on the fractal
    uint256 public gasused;    // Amount of gas used cumulatively on refining the fractal
    uint256 public feesburnt;  // Amount of 1559 fees burns cumulatively on refining the fractal
    uint256 public tipspaid;   // Amount of miner tips paid cumulatively on refining the fractal

    // create a new fractal that can be iterated and rendered.
    constructor(
        address _registry,
        address _codehub,
        uint256 _seed
    ){
        registry = _registry;
        codehub  = _codehub;
        (bool ok, ) = CodeHub(codehub).attractor().delegatecall(
            abi.encodeWithSignature("init(uint256,uint256,uint256)", _seed, 24, 24)
        );
        require(ok);
    }

    function refine(uint256 iters) public {
        // Only allow refinements through the registry to allow enforcing fun limits
        require(msg.sender == registry);

        // Retrieve the amount of gas provided for stats tracking
        uint256 start = gasleft();

        // Run the fractal refinement
        (bool ok, ) = CodeHub(codehub).attractor().delegatecall(
            abi.encodeWithSignature("refine(uint256)", iters)
        );
        require(ok);

        // Update the gas trackers with the refinement stats
        uint256 end = gasleft();

        unchecked {
            iterations += iters;
            gasused    += start - end;
            feesburnt  += (start - end) * block.basefee;
            tipspaid   += (start - end) * (tx.gasprice - block.basefee);
        }
    }

    // image retrieves the current look of the fractal.
    function image() public view returns (string memory) {
        return string(getData(keccak256("image")));
    }

    // ------------------------------------------------------------------------
    // ORIGINAL FRACTAL CODE
    // ------------------------------------------------------------------------
    // Here be boilerplate
    // ------------------------------------------------------------------------

    // supportsInterface implements IERC165.
    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IERC725Y).interfaceId;
    }

    // getData implements IERC725Y.
    function getData(bytes32 key) public view returns (bytes memory) {
        // Solidity doesn't allow us to delegatecall into the proper contract
        // with a view method, so hack the system and go around it's back.
        function (bytes32) internal view returns (bytes memory) fakeFunc;
        function (bytes32) internal returns (bytes memory)      realFunc = getDataDelegated;

        assembly { fakeFunc := realFunc }
        return fakeFunc(key);
    }

    // getDataDelegated implements IERC725Y via a non-view method to allow using
    // delegate calls. It is used by getData().
    function getDataDelegated(bytes32 key) internal returns (bytes memory) {
        (bool ok, bytes memory result) = CodeHub(codehub).publisher().delegatecall(
            abi.encodeWithSignature("getData(bytes32)", key)
        );
        require(ok);
        return abi.decode(result, (bytes));
    }

    // getDataBatch implements IERC725Y.
    function getDataBatch(bytes32[] memory keys) public view returns (bytes[] memory) {
        bytes[] memory values = new bytes[](keys.length);
        for (uint256 i = 0; i < keys.length; i++) {
            values[i] = getData(keys[i]);
        }
        return values;
    }

    // setData implements IERC725Y.
    function setData(bytes32, bytes memory) external payable {
        if (msg.value != 0) revert ERC725Y_MsgValueDisallowed();

        // Yolo, no set, sorry
    }

    // setDataBatch implements IERC725Y.
    function setDataBatch(bytes32[] memory, bytes[] memory) external payable {
        if (msg.value != 0) revert ERC725Y_MsgValueDisallowed();

        // Yolo, no set, sorry
    }
}
