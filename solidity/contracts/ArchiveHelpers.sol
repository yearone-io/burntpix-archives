// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;
import "@openzeppelin/contracts/utils/Base64.sol";
import {FractalClone} from "./FractalClone.sol";

contract ArchiveHelpers {
    function createFractalClone(address codehub, uint256 seed) external returns (address) {
        FractalClone fractalClone = new FractalClone(codehub, seed);
        return address(fractalClone);
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

    function generateMetadataBytes(bytes memory _image) external pure returns (bytes memory, bytes memory) {
        bytes memory encodedImage = abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(_image)
        );
        bytes memory _rawMetadata = abi.encodePacked(
            '{"LSP4Metadata": {"name": "House of Burnt Pix", "description": "We burn together, we rise together. A community built archive of Burnt Pix #blahblahblah.",',
                '"images": [[{"height": 768, "width": 768, "url": "',encodedImage,'", "verification": {"method": "keccak256(bytes)", "data": "',toHexString(keccak256(_image)),'"}}]],',
                '"attributes": [{"key": "Iterations", "type": "number", "value": 1}, {"key": "Contributed Iterations", "type": "number", "value": 1}]}}'
        );
        return (_rawMetadata, abi.encodePacked(
            "data:application/json;charset=UTF-8,",
            _rawMetadata
        ));
    }
}
