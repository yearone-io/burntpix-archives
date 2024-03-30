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
import {_INTERFACEID_LSP0} from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0Constants.sol";

interface IRegistry {
    function refine(bytes32 archiveId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
    function transfer(address from, address to, bytes32 tokenId, bool force, bytes memory data) external;
    function getOperatorsOf(bytes32 tokenId) external view returns (address[] memory);
    function tokenOwnerOf(bytes32 tokenId) external view returns (address);
}

interface IFractal {
    function refine(uint256 iters) external;
    function getData(bytes32 dataKey) external view returns (bytes memory);
    function iterations() external view returns (uint256);
}

interface IArchiveHelpers {
    function createFractalClone(address registry, address codehub, uint256 seed) external returns (address);
    function generateCollectionMetadata(address fractalClone, bytes32 burntPicId) external pure returns (bytes memory);
    function generateArchiveMetadata(Archive memory archive, bytes32 burntPicId, uint256 highestLevel) external pure returns (bytes memory);
    function fibonacciIterations(uint256 n) external pure returns (uint256);
    function getAlteredStringImage(bytes memory image) external pure returns (string memory);
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
    uint256 public immutable winnerIters;
    uint256 public archiveCount;
    uint256 public currentHighestLevel = 0;
    mapping(bytes32 => Archive) public burntArchives;
    mapping(address => Contribution) public contributions;

    // Construct a new NFT registry, keeping mostly everything standard and just
    // delegating it to Lukso's base contracts.
    constructor(address _codehub, address _registry, address _archiveHelpers, address _creator, bytes32 _burntPicId, uint256 _maxSupply, uint256 _winnerIters)
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
            winnerIters = _winnerIters;
            fractalClone = IArchiveHelpers(_archiveHelpers).createFractalClone(address(this), _codehub, uint256(IRegistry(registry).seeds(address(uint160(uint256(_burntPicId))))));
            _setData(_LSP4_CREATORS_ARRAY_KEY, hex"00000000000000000000000000000001");
            _setData(0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000, abi.encodePacked(_creator));
            _setData(bytes32(abi.encodePacked(_LSP4_CREATORS_MAP_KEY_PREFIX, hex"0000", _creator)) , hex"24871b3d00000000000000000000000000000000");
            // royalties
            _setData(0xc0569ca6c9180acc2c3590f36330a36ae19015a19f4e85c28a7631e3317e6b9d, abi.encodePacked(
                _INTERFACEID_LSP0,
                _creator,
                uint256(5_000)
            ));
            _setData(0x580d62ad353782eca17b89e5900e7df3b13b6f4ca9bbc2f8af8bceb0c3d1ecc6, hex"01");
    }

    function getArchives(address contributor) public view returns (bytes32[] memory) {
        return contributions[contributor].archiveIds;
    }

    function refineToArchive(uint256 iters) public {
        contributions[msg.sender].iterations += iters;
        uint256 diff = IFractal(address(uint160(uint256(burntPicId)))).iterations() - IFractal(fractalClone).iterations();
        IFractal(fractalClone).refine(iters);
        if (diff == 0) {
            IRegistry(registry).refine(burntPicId, iters);
        } else if (iters > diff) {
            IRegistry(registry).refine(burntPicId, iters - diff);
        }
        if (contributions[msg.sender].iterations >= winnerIters) {
            IRegistry(registry).transfer(address(this), msg.sender, burntPicId, true, "");
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
            if (archive.level > currentHighestLevel) {
                currentHighestLevel = archive.level;
            }
            burntArchives[archiveId] = archive;
        }
    }

    function isOriginalLocked() view public returns (bool) {
        return IRegistry(registry).getOperatorsOf(burntPicId).length == 0 && IRegistry(registry).tokenOwnerOf(burntPicId) == address(this) && owner() == address(0);
    }

    function mintArchive(bytes32 archiveId, address to) external {
        _exists(archiveId);
        Archive memory archive = burntArchives[archiveId];
        require(archive.creator == msg.sender, "BurntPixArchives: Only the creator can mint the archive");
        _mint(to, archiveId, true, "");
    }

    function _getData(bytes32 key) internal view override returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return IArchiveHelpers(archiveHelpers).generateCollectionMetadata(fractalClone, burntPicId);
        }
        return super._getData(key);
    }
    
    function _getDataForTokenId(bytes32 archiveId, bytes32 key) internal view override returns (bytes memory dataValues) {
        require(_exists(archiveId));
        if (key == _LSP4_METADATA_KEY) {
            return IArchiveHelpers(archiveHelpers).generateArchiveMetadata(burntArchives[archiveId], burntPicId, currentHighestLevel);
        }
        return super._getData(key);
    }
}