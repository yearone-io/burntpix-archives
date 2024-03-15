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
    mapping(uint256 => Canvas) public burntPicArchives;

    // create a new fractal that can be iterated and rendered.
    constructor(
        address _codehub,
        uint256 _seed
    ){
        registry = msg.sender;
        codehub  = _codehub;
        (bool ok, ) = CodeHub(codehub).attractor().delegatecall(
            abi.encodeWithSignature("init(uint256,uint256,uint256)", _seed, 16, 16)
        );
        require(ok);
    }

    function refineClone(uint256 iters) public {
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
    function latestCloneImage() public view returns (string memory) {
        return string(getData(keccak256("image")));
    }

    function getLatestPixels() public view returns (uint256[] memory) {
        return canvas.pixels;
    }

    /// errors
    /*
    error HouseOfBurntPixMintedOut();

    

    // todo: write refinement balancer that ensures that clone is always in sync with original

    // refine runs a number of refinement iterations on the fractal.
    function _refineClone(uint256 iters) internal {
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

    

    // gets metadata for the archive
    function getArchiveMetadataBytes(bytes memory encodedImage, address refiner) internal view returns (bytes memory, bytes memory) {
        bytes memory _encodedSVG = abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(encodedImage)
        );
        bytes memory collectionName = getData(_LSP4_TOKEN_NAME_KEY);
        // level needs to represent fibinacci level rather than iterations
        uint256 level = contributedIterations[refiner];
        // todo: need to figure out wtf encoded is supposed to be
        string memory encodedMetadata;
        // todo: figure out how to get parent burnt pic attributes at time of archive and include them here as well
        bytes memory _rawMetadata = abi.encodePacked(
            '{"LSP4Metadata": {"name": "',string(collectionName),'","description": "House of Burnt Pix. A community built archive of Burnt Pic: ',burntPicId,'","links": [],"icon":[],"images": [[{"width": 600,"height": 600,',
            '"url": "',_encodedSVG,'","verification": {"method": "keccak256(bytes)","data": "',encodedMetadata,'"}}]],',
            '"attributes":[{"key": "Type","value": "',level,'","type": "number"}]}}'
        );
        return (_rawMetadata, abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(_rawMetadata)
        ));
    }
    */

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

    // createArchive creates a new archive of the current state of the fractal.
    function createArchive() public {
        // Only allow refinements through the registry to allow enforcing fun limits
        require(msg.sender == registry);

        // Create a new archive of the current state of the fractal
        burntPicArchives[iterations] = canvas;
    }

    //
    function getDataForArchiveId(uint256 archiveId, bytes32 key) public returns (bytes memory) {
        Canvas memory currentCanvas = canvas;
        canvas = burntPicArchives[archiveId];
        bytes memory result = getData(key);
        canvas = currentCanvas;
        return result;
    }

    function getImageForArchiveId(uint256 archiveId) public returns (string memory) {
        return string(getDataForArchiveId(archiveId, keccak256("image")));
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
