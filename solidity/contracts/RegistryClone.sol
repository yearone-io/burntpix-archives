// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23;

import {_LSP8_TOKENID_FORMAT_ADDRESS}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY, _LSP4_CREATORS_ARRAY_KEY, _LSP4_CREATORS_MAP_KEY_PREFIX} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";
import "./common.sol";

interface IRegistry {
    function refine(bytes32 tokenId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
}

interface IFractal {
    function refine(uint256 iters) external;
    function getArchiveStats() external view returns (ArchiveData memory);
    function setArchiveStats(ArchiveData memory _archive) external;
    function iterations() external view returns (uint256);
    function image() external view returns (string memory);
    function getData(bytes32 key) external view returns (bytes memory);
}

interface IFactory {
    function create(address _codehub, uint256 _seed) external returns (IFractal);
}

// Registry implements the NFT existence and ownership tracking.
contract RegistryClone is LSP8Mintable {
    address internal codehub;
    address public registry;
    IFractal public fractalClone;
    bytes32 public burntPicId;
    mapping(uint256 => ArchiveData) internal archives;
    address public factory;

    // Construct a new NFT registry, keeping mostly everything standard and just
    // delegating it to Lukso's base contracts.
    constructor(address _factory, address _codehub, address _registry, bytes32 _burntPicId)
        LSP8Mintable('House Of Burnt Pix', 'HOPIX', msg.sender, _LSP4_TOKEN_TYPE_COLLECTION, _LSP8_TOKENID_FORMAT_ADDRESS) {
            factory = _factory;
            codehub = _codehub;
            burntPicId = _burntPicId;
            registry = _registry;
            address fractal = address(uint160(uint256(_burntPicId)));
            uint32 seed = IRegistry(registry).seeds(fractal);
            fractalClone = IFactory(_factory).create(codehub, uint256(seed));
            // Set creator address as deployer
            _setData(_LSP4_CREATORS_ARRAY_KEY, hex"00000000000000000000000000000001");
            _setData(0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000, abi.encodePacked(msg.sender));
            _setData(bytes32(abi.encodePacked(_LSP4_CREATORS_MAP_KEY_PREFIX, hex"0000", msg.sender)) , hex"24871b3d00000000000000000000000000000000");  
    }

    function mint(address to, uint256 archiveId) public {
        address fractal = address(uint160(uint256(burntPicId)));
        uint32 seed = IRegistry(registry).seeds(fractal);
        IFractal archive = IFactory(factory).create(codehub, seed);
        //archive.setArchiveStats(archives[archiveId]);
        //_mint(to, bytes32(uint256(uint160(address(archive)))), true, "");
    }


    // refine runs a number of refinement iterations on a requested fractal
    // todo: implement refinements balancer that ensures that clone is always in sync with original
    function refineToMint(uint256 iters) public {
        fractalClone.refine(iters);
        IRegistry(registry).refine(burntPicId, iters);
        archives[fractalClone.iterations()] = fractalClone.getArchiveStats();
    }

    function getArchive(uint256 iterations) public view returns (ArchiveData memory) {
        return archives[iterations];
    }

    function getLatestImage() public view returns (string memory) {
        return fractalClone.image();
    }

    // _getData implements IERC725Y.
    function _getData(bytes32 key) internal view override returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return fractalClone.getData(keccak256("LSP4MetadataStripped"));
        }
        return super._getData(key);
    }

    // _getDataForTokenId overrides LSP8IdentifiableDigitalAssetCore.
    // gets archive NFT data
    function _getDataForTokenId(bytes32 tokenId, bytes32 key) internal view override returns (bytes memory dataValues) {
        require(_exists(tokenId));
        IFractal archive = IFractal(address(uint160(uint256(tokenId))));
        return archive.getData(key);
    }
}