// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import {
    LSP8IdentifiableDigitalAsset
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {
    LSP8CappedSupply
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8CappedSupply.sol";
import {_LSP8_TOKENID_FORMAT_NUMBER}  from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY, _LSP4_CREATORS_ARRAY_KEY, _LSP4_CREATORS_MAP_KEY_PREFIX} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

interface IRegistry {
    function refine(bytes32 archiveId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
}

interface IFractal {
    function refine(uint256 iters) external;
    function getData(bytes32 dataKey) external view returns (bytes memory);
    function iterations() external view returns (uint256);
}

interface IArchiveHelpers {
    function createFractalClone(address registry, address codehub, uint256 seed) external returns (address);
    function generateMetadataBytes(Archive memory archive) external pure returns (bytes memory, bytes memory);
    function fibonacciIterations(uint256 n) external pure returns (uint256);
}

struct Archive {
    bytes image;
    uint256 iterations;
    uint256 level;
    uint256 blockNumber;
    address creator;
}

struct Contribution {
    bytes32[] archiveIds;
    uint256 iterations;
}

// Registry implements the NFT existence and ownership tracking.
contract BurntPixArchives is LSP8CappedSupply {
    address public immutable registry;
    address public immutable fractalClone;
    address public immutable archiveHelpers;
    bytes32 public immutable burntPicId;
    uint256 public archiveCount;
    mapping(bytes32 => Archive) public burntArchives;
    mapping(address => Contribution) public contributions;

    // Construct a new NFT registry, keeping mostly everything standard and just
    // delegating it to Lukso's base contracts.
    constructor(uint256 _maxSupply, address _creator, address _codehub, address _registry, bytes32 _burntPicId, address _archiveHelpers)
        LSP8CappedSupply(_maxSupply)
        LSP8IdentifiableDigitalAsset(
            'Burnt Pix Archives: Season 1',
            'BURNT1',
            msg.sender,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_NUMBER
        ) {
            archiveHelpers = _archiveHelpers;
            burntPicId = _burntPicId;
            registry = _registry;
            fractalClone = IArchiveHelpers(_archiveHelpers).createFractalClone(address(this), _codehub, uint256(IRegistry(registry).seeds(address(uint160(uint256(_burntPicId))))));
            _setData(_LSP4_CREATORS_ARRAY_KEY, hex"00000000000000000000000000000001");
            _setData(0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000, abi.encodePacked(_creator));
            _setData(bytes32(abi.encodePacked(_LSP4_CREATORS_MAP_KEY_PREFIX, hex"0000", _creator)) , hex"24871b3d00000000000000000000000000000000");
    }

    function getContribution(address contributor) public view returns (Contribution memory) {
        return contributions[contributor];
    }

    function refineToMint(uint256 iters) public {
        contributions[msg.sender].iterations += iters;
        uint256 diff = IFractal(address(uint160(uint256(burntPicId)))).iterations() - IFractal(fractalClone).iterations();
        IFractal(fractalClone).refine(iters);
        if (diff > 0 && iters > diff) {
            IRegistry(registry).refine(burntPicId, iters - diff);
        } else if (diff == 0) {
            IRegistry(registry).refine(burntPicId, iters);
        }
        if (contributions[msg.sender].iterations >= IArchiveHelpers(archiveHelpers).fibonacciIterations(contributions[msg.sender].archiveIds.length + 1)) {
            bytes32 archiveId = bytes32(++archiveCount);
            contributions[msg.sender].archiveIds.push(archiveId);
            Archive memory archive = Archive({
                image: IFractal(fractalClone).getData(keccak256("image")),
                iterations: IFractal(fractalClone).iterations(),
                level: contributions[msg.sender].archiveIds.length,
                blockNumber: block.number,
                creator: msg.sender
            });
            burntArchives[archiveId] = archive;
        }
    }

    function mintArchive(bytes32 archiveId, address to) external {
        _exists(archiveId);
        Archive memory archive = burntArchives[archiveId];
        require(archive.creator == msg.sender, "BurntPixArchives: Only the creator can mint the archive");
        _mint(to, archiveId, true, "");
    }

    function _getData(bytes32 key) internal view override returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return IFractal(fractalClone).getData(keccak256("LSP4MetadataStripped"));
        }
        return super._getData(key);
    }
    
    function _getDataForTokenId(bytes32 archiveId, bytes32 key) internal view override returns (bytes memory) {
        require(_exists(archiveId));
        if (key == _LSP4_METADATA_KEY) {
            (bytes memory _metadata, bytes memory _encoded) = IArchiveHelpers(archiveHelpers).generateMetadataBytes(burntArchives[archiveId]);
            // 0x0000 (is VerifiableURI identifier) +
            // 6f357c6a ("keccak256(utf8)": Means the data SHOULD be bytes32 hash of the content of the linked UTF-8 based file of the "Encoded URI") + 
            // 0020 (32 bytes length of the hash) todo: this is wrong
            bytes memory verfiableURI = bytes.concat(
                hex'00006f357c6a0020', 
                keccak256(_metadata),
                _encoded
            );
            return verfiableURI;
        }
        return super._getData(key);
    }
}