// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import {
    LSP8Mintable, ILSP8Mintable
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";
import {
    _LSP8_TOKENID_FORMAT_NUMBER
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {
    _LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY, _LSP4_TOKEN_NAME_KEY
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import { IERC725Y } from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";

// Burnt Pix Collection
interface IBurntPixContract is ILSP8Mintable {
    function refine(bytes32 tokenId, uint256 iters) external;
}

// Burnt Pix Fractal
interface IBurntPixFractal is IERC725Y {
    // Function signature for `refine`
    function image() external view returns (string memory);
    function iterations() external view returns (uint256);
}

bytes32 constant _BURNTPIX_IMAGE_KEY = keccak256("image");
bytes32 constant _BURNTPIX_PIXELS_KEY = keccak256("pixels");

contract BurntPixClone is LSP8Mintable {
    address public burntPixContract;
    bytes32 public burntPicId;
    address public burntPicTokenAddress;
    bytes public bytesImage;
    string public stringImage;
    bytes public burntPicMetadata;
    mapping(address => uint256) public contributedIterations;

    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner,
        address _burntPixContract,
        bytes32 _burntPicId
    ) LSP8Mintable(
        nftCollectionName,
        nftCollectionSymbol,
        contractOwner,
        _LSP4_TOKEN_TYPE_COLLECTION,
        _LSP8_TOKENID_FORMAT_NUMBER
    ){
        require(_burntPixContract != address(0), "Invalid target contract address");
        require(_burntPicId != bytes32(0), "Invalid target token ID");
        burntPixContract = _burntPixContract;
        burntPicId = _burntPicId;
        burntPicTokenAddress = address(uint160(uint256(_burntPicId)));
    }

    function getImage() view public returns (bytes memory) {
        return IBurntPixFractal(burntPicTokenAddress).getData(_BURNTPIX_IMAGE_KEY);
    }

    function getPixels() view public returns (bytes memory) {
        return IBurntPixFractal(burntPicTokenAddress).getData(_BURNTPIX_IMAGE_KEY);
    }

    function getAndSetImage() public {
        bytesImage = IBurntPixFractal(burntPicTokenAddress).getData(_BURNTPIX_IMAGE_KEY);
    }

    
}
