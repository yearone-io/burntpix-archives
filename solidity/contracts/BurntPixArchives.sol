// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP8CappedSupply} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8CappedSupply.sol";
import {_LSP8_TOKENID_FORMAT_NUMBER} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY, _LSP4_CREATORS_ARRAY_KEY, _LSP4_CREATORS_MAP_KEY_PREFIX} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_INTERFACEID_LSP0} from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0Constants.sol";

interface IRegistry {
    function refine(bytes32 archiveId, uint256 iters) external;
    function seeds(address fractal) external view returns (uint32);
    function transfer(
        address from,
        address to,
        bytes32 tokenId,
        bool force,
        bytes memory data
    ) external;
    function getOperatorsOf(
        bytes32 tokenId
    ) external view returns (address[] memory);
    function tokenOwnerOf(bytes32 tokenId) external view returns (address);
}

interface IFractal {
    function registry() external view returns (address);
    function refine(uint256 iters) external;
    function getData(bytes32 dataKey) external view returns (bytes memory);
    function iterations() external view returns (uint256);
    function feesburnt() external view returns (uint256);
}

interface IArchiveHelpers {
    function createFractalClone(
        address registry,
        address codehub,
        uint256 seed
    ) external returns (address);
    function generateCollectionMetadata(
        address fractalClone,
        address burntPicFractal
    ) external pure returns (bytes memory);
    function generateArchiveMetadata(
        Archive memory archive,
        address burntPicFractal,
        uint256 highestLevel
    ) external pure returns (bytes memory);
    function fibonacciIterations(
        uint256 n,
        uint256 multiplier
    ) external pure returns (uint256);
    function getAlteredStringImage(
        bytes memory image
    ) external pure returns (string memory);
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
    address public immutable fractalClone;
    address public immutable archiveHelpers;
    bytes32 public immutable burntPicId;
    uint256 public immutable winnerIters;
    uint256 public immutable multiplier;
    address[] public contributors;
    uint256 public archiveCount;
    uint256 public currentHighestLevel = 1;
    mapping(bytes32 => Archive) public burntArchives;
    mapping(address => Contribution) public contributions;

    event RefineToArchive(address indexed contributor, uint256 iters);

    constructor(
        address _codehub,
        address _archiveHelpers,
        address _creator,
        address _royaltyRecipient,
        bytes32 _burntPicId,
        uint256 _maxSupply,
        uint256 _multiplier,
        uint256 _winnerIters
    )
        LSP8CappedSupply(_maxSupply)
        LSP8IdentifiableDigitalAsset(
            "Burnt Pix Archives: Season 1",
            "BURNT1",
            _creator,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_NUMBER
        )
    {
        address fractal = address(uint160(uint256(_burntPicId)));
        address registry = IFractal(fractal).registry();
        archiveHelpers = _archiveHelpers;
        burntPicId = _burntPicId;
        multiplier = _multiplier;
        winnerIters = _winnerIters;
        fractalClone = IArchiveHelpers(_archiveHelpers).createFractalClone(
            address(this),
            _codehub,
            uint256(IRegistry(registry).seeds(fractal))
        );
        _setData(
            _LSP4_CREATORS_ARRAY_KEY,
            hex"00000000000000000000000000000001"
        );
        bytes32 creatorIndex = bytes32(bytes16(_LSP4_CREATORS_ARRAY_KEY));
        _setData(creatorIndex, abi.encodePacked(_creator));
        _setData(
            bytes32(
                abi.encodePacked(
                    _LSP4_CREATORS_MAP_KEY_PREFIX,
                    hex"0000",
                    _creator
                )
            ),
            hex"24871b3d00000000000000000000000000000000"
        );
        // royalties
        _setData(
            0xc0569ca6c9180acc2c3590f36330a36ae19015a19f4e85c28a7631e3317e6b9d,
            abi.encodePacked(
                hex"001c", // length of data
                _INTERFACEID_LSP0,
                _royaltyRecipient,
                uint32(5_000)
            )
        );
        _setData(
            0x580d62ad353782eca17b89e5900e7df3b13b6f4ca9bbc2f8af8bceb0c3d1ecc6,
            hex"01"
        );
    }

    function refineToArchive(uint256 iters) public {
        return refineToArchive(iters, msg.sender);
    }

    function refineToArchive(uint256 iters, address contributor) public {
        require(
            iters > 0,
            "BurntPixArchives: Iterations must be greater than 0"
        );
        require(
            totalSupply() < tokenSupplyCap() || isOriginalUnclaimed(),
            "gg: Burnt Pix Archives Season 1 has concluded"
        );
        // BALANCE FRACTAL ITERATIONS
        address registry = IFractal(address(uint160(uint256(burntPicId))))
            .registry();
        uint256 diff = IFractal(address(uint160(uint256(burntPicId))))
            .iterations() - IFractal(fractalClone).iterations();
        // no matter whether original & clone are in sync we refine the clone
        IFractal(fractalClone).refine(iters);
        // original and clone get synced if no difference or original needs to catch up to current clone iters
        if (diff == 0 || iters > diff) {
            IRegistry(registry).refine(burntPicId, iters - diff);
        }
        // UPDATE CONTRIBUTIONS
        if (contributions[contributor].iterations == 0) {
            contributors.push(contributor);
        }
        contributions[contributor].iterations += iters;
        // TRANSFER ORIGINAL IF WINNER DETECTED
        if (
            contributions[contributor].iterations >= winnerIters &&
            isOriginalUnclaimed()
        ) {
            IRegistry(registry).transfer(
                address(this),
                contributor,
                burntPicId,
                true,
                ""
            );
        }
        // STORE ARCHIVE IF NEXT LEVEL UNLOCKED
        if (
            contributions[contributor].iterations >=
            IArchiveHelpers(archiveHelpers).fibonacciIterations(
                contributions[contributor].archiveIds.length + 1,
                multiplier
            ) &&
            totalSupply() < tokenSupplyCap()
        ) {
            bytes32 archiveId = bytes32(++archiveCount);
            contributions[contributor].archiveIds.push(archiveId);
            Archive memory archive = Archive({
                image: IFractal(fractalClone).getData(keccak256("image")),
                iterations: IFractal(fractalClone).iterations(),
                level: contributions[contributor].archiveIds.length,
                blockNumber: block.number,
                creator: contributor
            });
            if (archive.level > currentHighestLevel) {
                currentHighestLevel = archive.level;
            }
            burntArchives[archiveId] = archive;
        }
        emit RefineToArchive(contributor, iters);
    }

    function mintArchive(bytes32 archiveId) public {
        mintArchive(archiveId, msg.sender);
    }

    function mintArchive(bytes32 archiveId, address to) public {
        Archive memory archive = burntArchives[archiveId];
        require(
            archive.creator == msg.sender,
            "BurntPixArchives: Only the archive creator can mint the archive"
        );
        _mint(to, archiveId, true, "");
    }

    function getArchives(
        address contributor
    ) public view returns (bytes32[] memory) {
        return contributions[contributor].archiveIds;
    }

    function getContributors() public view returns (address[] memory) {
        return contributors;
    }

    function getTopTenContributors()
        public
        view
        returns (address[10] memory, uint256[10] memory)
    {
        address[10] memory topContributors;
        uint256[10] memory topIterations;

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

    function getContributions(
        address[] memory targetContributors
    ) public view returns (uint256[] memory) {
        uint256[] memory values = new uint256[](targetContributors.length);
        for (uint256 i = 0; i < targetContributors.length; i++) {
            values[i] = contributions[targetContributors[i]].iterations;
        }
        return values;
    }

    function getTotalIterations() public view returns (uint256) {
        return IFractal(fractalClone).iterations();
    }

    function getTotalContributors() public view returns (uint256) {
        return contributors.length;
    }

    function getTotalFeesBurnt() public view returns (uint256) {
        return
            IFractal(fractalClone).feesburnt() +
            IFractal(address(uint160(uint256(burntPicId)))).feesburnt();
    }

    function isOriginalUnclaimed() public view returns (bool) {
        address registry = IFractal(address(uint160(uint256(burntPicId))))
            .registry();
        return
            IRegistry(registry).getOperatorsOf(burntPicId).length == 0 &&
            IRegistry(registry).tokenOwnerOf(burntPicId) == address(this);
    }

    function _getData(
        bytes32 key
    ) internal view override returns (bytes memory) {
        if (key == _LSP4_METADATA_KEY) {
            return
                IArchiveHelpers(archiveHelpers).generateCollectionMetadata(
                    fractalClone,
                    address(uint160(uint256(burntPicId)))
                );
        }
        return super._getData(key);
    }

    function _getDataForTokenId(
        bytes32 archiveId,
        bytes32 key
    ) internal view override returns (bytes memory dataValues) {
        require(_exists(archiveId), "BurntPixArchives: Token does not exist");
        if (key == _LSP4_METADATA_KEY) {
            return
                IArchiveHelpers(archiveHelpers).generateArchiveMetadata(
                    burntArchives[archiveId],
                    address(uint160(uint256(burntPicId))),
                    currentHighestLevel
                );
        }
        return super._getData(key);
    }
}
