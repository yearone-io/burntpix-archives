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

interface IFractal {
    function getData(bytes32 dataKey) external view returns (bytes memory);
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

    function toHexString(bytes32 data, uint256 dataLength) internal pure returns (string memory) {
        // Initialize a buffer for the output string
        // 2 characters for each of the dataLength bytes + 2 for the '0x' prefix
        bytes memory buffer = new bytes(2 * dataLength + 2);
        // Add the '0x' prefix
        buffer[0] = '0';
        buffer[1] = 'x';
        // Characters for conversion
        bytes16 hexChars = "0123456789abcdef";

        for (uint256 i = 0; i < dataLength; i++) {
            // Convert each byte to its hexadecimal character equivalent
            buffer[2 + i * 2] = hexChars[uint8(data[i] >> 4)];
            buffer[3 + i * 2] = hexChars[uint8(data[i] & 0x0f)];
        }

        return string(buffer);
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

    function alterImageBasedOnLevel(bytes memory originalBytes, uint256 imageLevel, uint256 highestLevel) internal pure returns (bytes memory) {
        bytes memory oldStartBytes = hex'3c73766720786d6c6e733d22687474703a2f2f7777772e77332e6f72672f323030302f737667222076657273696f6e3d22312e31222076696577426f783d223020302033383520333835223e3c7265637420783d22302220793d2230222077696474683d2233383522206865696768743d22333835222072783d2233222066696c6c3d2223323032303230222f3e';
        bytes memory newStartBytes = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 385 385"><defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:red; stop-opacity:calc(',uintToString(imageLevel),'/',uintToString(highestLevel),')"/><stop offset="100%" style="stop-color:blue; stop-opacity:calc(',uintToString(imageLevel),'/',uintToString(highestLevel),')"/></linearGradient></defs>',
            '<rect x="0" y="0" width="385" height="385" rx="3" fill="#000" stroke="url(#gradient1)" stroke-width="2"/>'
        );
        bytes memory result = new bytes(newStartBytes.length + originalBytes.length - oldStartBytes.length);

        // Copy the new start bytes.
        for(uint i = 0; i < newStartBytes.length; i++) {
            result[i] = newStartBytes[i];
        }

        // Copy the remainder of the original string.
        for(uint i = oldStartBytes.length; i < originalBytes.length; i++) {
            result[newStartBytes.length + i - oldStartBytes.length] = originalBytes[i];
        }

        return result;
    }

    function getVerifiableURI(bytes memory rawMetadata) internal pure returns (bytes memory) {
        return bytes.concat(
            hex'00006f357c6a0020', // 0000 (verifiable URI Identifier) + 6f357c6a ("keccak256(utf8)") + 0020 (length of the hash)
            keccak256(rawMetadata), //  + verification data (hash)
            abi.encodePacked( //  + encoded URI
                "data:application/json;charset=UTF-8,",
                rawMetadata
            )
        );
    }

    function getCoreMetadata(bytes memory image, address burntPicFractal, string memory children) internal pure returns (bytes memory) {
        bytes memory encodedImage = abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(image)
        );
        return abi.encodePacked(
            '{"LSP4Metadata": {',
                '"name": "Burnt Pix Archives: Season 1",',
                '"description": "We burn together, we rise together. A community built archive of BurntPix Fractal ',addressToString(burntPicFractal),'",',
                '"images": [[{"height": 768, "width": 768, "url": "',encodedImage,'", "verification": {"method": "keccak256(bytes)", "data": "',toHexString(keccak256(image), 32),'"}}]],',
                '"links": [{"title": "Burnt Pix Archives", "url": "https://burntpix.cc" }]',
                children,
            '}}'
        );
    } 

    function generateCollectionMetadata(address fractalClone, address burntPicFractal) external view returns (bytes memory) {
        bytes memory image = alterImageBasedOnLevel(IFractal(fractalClone).getData(keccak256("image")), 1, 1);
        bytes memory _rawMetadata = getCoreMetadata(image, burntPicFractal, "");
        return getVerifiableURI(_rawMetadata);
    }

    function generateArchiveMetadata(Archive memory archive, address burntPicFractal, uint256 highestLevel) external pure returns (bytes memory) {
        bytes memory image = alterImageBasedOnLevel(archive.image, archive.level, highestLevel);
        string memory children = string(abi.encodePacked(
            ',"attributes": [{"key": "Level", "type": "number", "value": ',uintToString(archive.level),'}, {"key": "Block Number", "type": "number", "value": ',uintToString(archive.blockNumber),'}, {"key": "Iterations", "type": "number", "value": ',uintToString(archive.iterations),'}, {"key": "Creator", "type": "string", "value": "',addressToString(archive.creator),'"}]'
        ));
        bytes memory _rawMetadata = getCoreMetadata(
            image,
            burntPicFractal,
            children
        );
        return getVerifiableURI(_rawMetadata);
    }
}
