// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

// Canvas represents the work-in-progress rendering of the fractal image,
// tracking the dimensions and the unflattened pixel data.
struct Canvas {
    uint256   width;  // Width in pixels of the fractal being generated
    uint256   height; // Height in pixels of the fractal being generated
    uint256[] pixels; // Pixel information {r, g, b, a}, 64 bits per channel

    int256 minx; // Coordinate bounding box to center the image
    int256 maxx; // Coordinate bounding box to center the image
    int256 miny; // Coordinate bounding box to center the image
    int256 maxy; // Coordinate bounding box to center the image
}

// Function represents a 2D affine transformation, annotated with a variation
// and a color component.
//
// F(x, y) = V(ax + by + c, dx + ey + f)
struct Function {
    int256 pa; int256 pb; int256 pc; // Affine transform parameters for the X coordinate
    int256 pd; int256 pe; int256 pf; // Affine transform parameters for the Y coordinate

    uint256 cr; uint256 cg; uint256 cb; // Color component for tracing parts of the attractor

    uint256 v; // Post affine transform variation for non-linear transform
}

// State represents a 2D coordinate and an RGB color to track the current
// state of the fractal system iterator.
struct State {
    int256 x; // X coordinate of the iterator in the [-1, 1) space
    int256 y; // Y coordinate of the iterator in the [-1, 1) space

    uint256 r; // Red color component in the [0, 1) space
    uint256 g; // Green color component in the [0, 1) space
    uint256 b; // Blue color component in the [0, 1) space
}
