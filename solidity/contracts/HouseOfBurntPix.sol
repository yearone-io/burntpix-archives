// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
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

// Interface for the target contract with the `refine` function
interface IBurntPixContract is ILSP8Mintable {
    // Function signature for `refine`
    function refine(bytes32 tokenId, uint256 iters) external;
    function image() external view returns (string memory);
    function iterations() external view returns (uint256);
    
}

bytes32 constant _BURNTPIX_IMAGE_KEY = 0xef285b02a4f711ad84793f73cc8ed6fea8af7013ece8132dacb7b33f6bce93da;

contract HouseOfBurntPix is LSP8Mintable {
    address public burntPixContract;
    bytes32 public burntPicId;
    string public burntPicIdString;
    uint256 public maxArchiveSupply;
    mapping(address => uint256) public contributedIterations;

    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner,
        uint256 _maxArchiveSupply,
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
        burntPicIdString = bytes32ToString(_burntPicId);
        maxArchiveSupply = _maxArchiveSupply;
    }
    /// errors
    error HouseOfBurntPixMintedOut();

    // Disable direct minting
    function mint(
        address,
        bytes32,
        bool,
        bytes memory
    ) public virtual override(LSP8Mintable) {
        revert("This function is disabled.");
    }

    function getLatestImage() public view returns (string memory) {
        IBurntPixContract targetFractal = IBurntPixContract(0x4E8BA475570385e3CC35A0e40293035cD45B9BE9);
        return targetFractal.image();
    }

    // Function to refine on the target contract, with simplified name
    function refineToMint(uint256 iters, address refiner) public  {
        if(totalSupply() + 1 > maxArchiveSupply) revert HouseOfBurntPixMintedOut();
        // Increase the caller's refinement count
        contributedIterations[refiner] = contributedIterations[refiner] + iters;

        // Cast the target address to the interface
        IBurntPixContract targetBurntPic = IBurntPixContract(burntPixContract);
        IBurntPixContract targetFractal = IBurntPixContract(0x4E8BA475570385e3CC35A0e40293035cD45B9BE9);
        
        // Call the `refine` function of the target contract with specified parameters
        //targetFractal.getData(_LSP4_METADATA_KEY);
        targetBurntPic.refine(burntPicId, iters);
        getLatestImage();
        /*
        if (iters > 0) {
            // Get current burntpic snapshot
            
            string memory snapshotImage = getLatestImage();
            
            (bytes memory _metadata, bytes memory _encoded) = getArchiveMetadataBytes(snapshotImage, refiner);
            bytes memory verfiableURI = bytes.concat(
                hex'00006f357c6a0020', // todo: figure out what this is
                keccak256(_metadata),
                _encoded
            );
            // Mint the refined token to the caller
            
            bytes32 tokenId = bytes32(totalSupply() + 1);
            //setDataForTokenId(tokenId, _LSP4_METADATA_KEY, verfiableURI);
            
            super._mint(refiner, tokenId, false, "");
        }
        */
    }

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

    function bytes32ToString(bytes32 _bytes) public pure returns (string memory) {
        // Characters for conversion
        bytes memory alphabet = "0123456789abcdef";

        // Initialize an empty string with enough space for "0x", 32 bytes, and 2 characters per byte
        bytes memory str = new bytes(2 + 64); // "0x" prefix + 64 hex chars
        str[0] = '0';
        str[1] = 'x';
        
        for (uint256 i = 0; i < 32; i++) {
            // Process each byte
            bytes1 b = _bytes[i];
            // Upper 4 bits to hex
            str[2 + i * 2] = alphabet[uint8(b) >> 4];
            // Lower 4 bits to hex
            str[3 + i * 2] = alphabet[uint8(b) & 0x0f];
        }

        return string(str);
    }
}
