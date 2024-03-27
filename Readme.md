# Burnt Pix Archives: Season 1

*"We burn together, we rise together."*

The core idea behind Burnt Pix Archives is to encourage the Lukso community to work together and refine the same Burnt Pix NFT (Fractal) from the existing [Burnt Pix](https://burntpix.com/) collection created by [Péter Szilágyi](https://x.com/peter_szilagyi/status/1721812235163521452). Conceptually we do this by rewarding the refiners of the particular burnt pic id with lower resolution LSP8 "archives" of the the original NFT at various stages in its evolution as the refiners unlock new levels through their refinement contributions. The amount of possible minted archives is limited to ten thousand. The most successful refiner unlocks the original NFT in the end. 

This functionality is achieved through three smart contracts:

1. BurntPixArchives.sol - an LSP8CappedSupply collection which is responsibles for minting the "archive" (lower res copies of the original burnt pix NFT at the point in time a user's earned them), tracking refiner contributions, as well as refining in parallel the FractalClone.sol, a lower resolution copy of the original burnt pic.
2. FractalClone.sol - a lower resolution copy of the original burnt pic. It's refined in parallel to the original with the same exact amount of iterations in order to keep track of a mirror image and serve "archive" copies of the original.
3. ArchiveHelpers.sol - helper functions that build metadata, track levels, and do other misc things necessary for system to work.
