// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import {
    LSP8IdentifiableDigitalAsset
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_NUMBER}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY, _LSP4_CREATORS_ARRAY_KEY, _LSP4_CREATORS_MAP_KEY_PREFIX} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

interface IRegistry {
    function refine(bytes32 tokenId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
}

interface IFractal {
    function refine(uint256 iters) external;
    function getData(bytes32 dataKey) external view returns (bytes memory);
    function iterations() external view returns (uint256);
}

interface IArchiveHelpers {
    function createFractalClone(address registry, address codehub, uint256 seed) external returns (address);
    function generateMetadataBytes(bytes memory _image) external pure returns (bytes memory, bytes memory);
}

// Registry implements the NFT existence and ownership tracking.
contract BurntPixArchives is LSP8IdentifiableDigitalAsset {
    address public registry;
    address public fractalClone;
    address public archiveHelpers;
    bytes32 public burntPicId;
    mapping(uint256 => bytes) public burntArchives;
    mapping(uint256 => address) public archiveCreator;

    // Construct a new NFT registry, keeping mostly everything standard and just
    // delegating it to Lukso's base contracts.
    constructor(address _creator, address _codehub, address _registry, bytes32 _burntPicId, address _archiveHelpers)
        LSP8IdentifiableDigitalAsset(
            'House Of Burnt Pix',
            'HOPIX',
            msg.sender,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_NUMBER
        ) {
            archiveHelpers = _archiveHelpers;
            burntPicId = _burntPicId;
            address fractal = address(uint160(uint256(_burntPicId)));
            registry = _registry;
            uint32 seed = IRegistry(registry).seeds(fractal);
            fractalClone = IArchiveHelpers(_archiveHelpers).createFractalClone(address(this), address(_codehub), uint256(seed));
            _setData(_LSP4_CREATORS_ARRAY_KEY, hex"00000000000000000000000000000001");
            _setData(0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000, abi.encodePacked(_creator));
            _setData(bytes32(abi.encodePacked(_LSP4_CREATORS_MAP_KEY_PREFIX, hex"0000", _creator)) , hex"24871b3d00000000000000000000000000000000");
    }

    function refineToMint(uint256 iters) public {
        IFractal(fractalClone).refine(iters);
        IRegistry(registry).refine(burntPicId, iters);
        burntArchives[IFractal(fractalClone).iterations()] = IFractal(fractalClone).getData(keccak256("image"));
        archiveCreator[IFractal(fractalClone).iterations()] = msg.sender;
    }

    function mintArchive(uint256 archiveId, address to) external {
        require(archiveCreator[archiveId] == msg.sender, "Only the creator of the archive can mint it");
        bytes32 tokenId = bytes32(archiveId);
        _mint(to, tokenId, true, "");
    }

    function _getData(bytes32 key) internal view override returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return IFractal(fractalClone).getData(keccak256("LSP4MetadataStripped"));
        }
        return super._getData(key);
    }
    
    function _getDataForTokenId(bytes32 tokenId, bytes32 key) internal view override returns (bytes memory) {
        require(_exists(tokenId));
        if (key == _LSP4_METADATA_KEY) {
            bytes memory _image = burntArchives[uint256(tokenId)];
            (bytes memory _metadata, bytes memory _encoded) = IArchiveHelpers(archiveHelpers).generateMetadataBytes(_image);
            bytes memory verfiableURI = bytes.concat(
                hex'00006f357c6a0020', // todo: what is this? bytes("keccak256(_metadata)")?
                keccak256(_metadata),
                _encoded
            );
            return verfiableURI;
        }
        return super._getData(key);
    }
}