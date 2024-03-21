// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import "@openzeppelin/contracts/utils/Base64.sol";
import {FractalClone} from "./FractalClone.sol";

struct Archive {
    bytes image;
    uint256 iterations;
    uint256 level;
    uint256 blockNumber;
    address creator;
}

contract ArchiveHelpers {
    function createFractalClone(address registry, address codehub, uint256 seed) external returns (address) {
        FractalClone fractalClone = new FractalClone(registry, codehub, seed);
        return address(fractalClone);
    }

    function fibonacciIterations(uint256 n) external pure returns (uint256) {
        uint256 multiplier = 1000;
        if (n <= 1) return multiplier;
        uint256 a = 1;
        uint256 b = 1;
        for (uint256 i = 2; i < n; i++) {
            uint256 c = a + b;
            a = b;
            b = c;
        }
        return (a + b) * multiplier;
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i*2] = alphabet[uint8(data[i] >> 4)];
            str[1+i*2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    function addressToString(address _address) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(_address)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        // Base case: 0 is a special case
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function generateMetadataBytes(Archive memory archive) external pure returns (bytes memory, bytes memory) {
        bytes memory encodedImage = abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(archive.image)
        );
        bytes memory _rawMetadata = abi.encodePacked(
            '{"LSP4Metadata": {"name": "House of Burnt Pix", "description": "We burn together, we rise together. A community built archive of Burnt Pix #blahblahblah.",',
                '"images": [[{"height": 768, "width": 768, "url": "',encodedImage,'", "verification": {"method": "keccak256(bytes)", "data": "',toHexString(keccak256(archive.image)),'"}}]],',
                '"attributes": [{"key": "Level", "type": "number", "value": ',uintToString(archive.level),'}, {"key": "Block Number", "type": "number", "value": ',uintToString(archive.blockNumber),'}, {"key": "Iterations", "type": "number", "value": ',uintToString(archive.iterations),'}, {"key": "Creator", "type": "string", "value": "',addressToString(archive.creator),'"}]}}'
        );
        return (_rawMetadata, abi.encodePacked(
            "data:application/json;charset=UTF-8,",
            _rawMetadata
        ));
    }
}
