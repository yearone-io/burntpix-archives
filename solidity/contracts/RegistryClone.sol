// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23;

import "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAssetCore.sol";

import {LSP8IdentifiableDigitalAsset}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP8IdentifiableDigitalAssetCore}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAssetCore.sol";
import {LSP8Enumerable}                from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8Enumerable.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION}   from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_LSP4_METADATA_KEY}            from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_LSP4_CREATORS_ARRAY_KEY}      from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_LSP4_CREATORS_MAP_KEY_PREFIX} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

import {CodeHub} from "./codehub.sol";
import {FractalClone} from "./FractalClone.sol";

interface IRegistry {
    function refine(bytes32 tokenId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
}

interface IFractal {
    function iterations() external view returns (uint256);
}

// Registry implements the NFT existence and ownership tracking.
contract RegistryClone is LSP8Enumerable {
    address public originalRegistryAddr;
    FractalClone public fractalClone;  // Current banner of the collection latest version of fractal
    bytes32 public burntPicId;
    uint256 public maxArchiveSupply;
    mapping(address => uint256) public contributedIterations;
    uint256 public cloneIters;
    uint256 public originalIters;
    mapping(uint256 =>  uint256[]) public burntPicArchives;
    mapping(uint256 =>  string) public burntSVGArchives;

    // Construct a new NFT registry, keeping mostly everything standard and just
    // delegating it to Lukso's base contracts.
    constructor(address creator, address _codehub, address _originalRegistry, bytes32 _burntPicId)
        LSP8IdentifiableDigitalAsset(
            'House Of Burnt Pix',
            'HOPIX',
            msg.sender,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_ADDRESS
        ) {
            require(_burntPicId != bytes32(0), "Invalid target token ID");
            burntPicId = _burntPicId;
            address fractal = address(uint160(uint256(_burntPicId)));
            originalRegistryAddr = _originalRegistry;
            uint32 seed = IRegistry(originalRegistryAddr).seeds(fractal);
            fractalClone = new FractalClone(address(_codehub), uint256(seed));

            // Configure the creator address as the deployer
            _setData(_LSP4_CREATORS_ARRAY_KEY, hex"00000000000000000000000000000001");
            _setData(0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000, abi.encodePacked(creator));
            _setData(bytes32(abi.encodePacked(_LSP4_CREATORS_MAP_KEY_PREFIX, hex"0000", creator)) , hex"24871b3d00000000000000000000000000000000");
    }

    // Disable direct minting
    function _mint(
        address,
        bytes32,
        bool,
        bytes memory
    ) internal virtual override(LSP8IdentifiableDigitalAssetCore) {
        revert("This function is disabled.");
    }

    // Function to refine on the target contract, with simplified name
    /*
    function refineToMint(uint256 iters, address refiner) public  {
        if(totalSupply() + 1 > maxArchiveSupply) revert HouseOfBurntPixMintedOut();
        // Increase the caller's refinement count
        contributedIterations[refiner] = contributedIterations[refiner] + iters;

        // Cast the target address to the interface
        IRegistry originalRegistry = IRegistry(registry);

        if (iters > 0) {
            _refineClone(iters);
            originalRegistry.refine(burntPicId, iters);
            string memory snapshotImage = latestCloneImage();
            
            // (bytes memory _metadata, bytes memory _encoded) = getArchiveMetadataBytes(snapshotImage, refiner);
            // bytes memory verfiableURI = bytes.concat(
            //     hex'00006f357c6a0020', // todo: figure out what this is
            //     keccak256(_metadata),
            //     _encoded
            // );
            
            //setDataForTokenId(tokenId, _LSP4_METADATA_KEY, verfiableURI);
            bytes32 tokenId = bytes32(totalSupply() + 1);
            super._mint(refiner, tokenId, false, "");
        }
    }
    */

    // refine runs a number of refinement iterations on a requested fractal
    // todo: implement refinements balancer that ensures that clone is always in sync with original
    function refineToMint(uint256 iters) external {
        // Run refinements on clone using the burntpic id
        fractalClone.refineClone(iters);
        // Run refinements on the original fractal using original registry
        IRegistry originalRegistry = IRegistry(originalRegistryAddr);
        originalRegistry.refine(burntPicId, iters);
        // if mint condition is met, mint the token and inject art data using exposed pixels data
        // burntPicArchives[fractalClone.iterations()] = fractalClone.getLatestPixels();
        burntSVGArchives[fractalClone.iterations()] = fractalClone.latestCloneImage();
        //super._mint(msg.sender, tokenId, false, "");
    }

    function getArchive(uint256 iterations) public view returns (uint256[] memory) {
        return burntPicArchives[iterations];
    }

    function getSVGArchive(uint256 iterations) public view returns (string memory) {
        return burntSVGArchives[iterations];
    }

    function getLatestImage() public view returns (string memory) {
        return fractalClone.latestCloneImage();
    }

    // _getData implements IERC725Y.
    function _getData(bytes32 key) internal view override (ERC725YCore) returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return fractalClone.getData(keccak256("LSP4MetadataStripped"));
        }
        return super._getData(key);
    }

    // _getDataForTokenId overrides LSP8IdentifiableDigitalAssetCore.
    // gets archive NFT data
    function _getDataForTokenId(bytes32 tokenId, bytes32 key) internal view override (LSP8IdentifiableDigitalAssetCore) returns (bytes memory dataValues) {
        // Make sure the token id exists, we don't want to call random contracts
        require(_exists(tokenId));

        // Retrieve the data from the requested token
        // todo: change this to fetch archive metadata
        return fractalClone.getData(key);
    }
}