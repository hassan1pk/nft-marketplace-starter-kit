// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IERC721Metadata.sol';
import './ERC165.sol';

contract ERC721Metadata is IERC721Metadata, ERC165{
    string private _name;
    string private _symbol;

    constructor(string memory named, string memory _symbolified)
    {
        _registerInterface(bytes4(keccak256('name()') ^ keccak256('symbol()')));

        _name = named;
        _symbol = _symbolified;
    }

    function name() external view override returns(string memory)
    {
        return _name;
    }

    function symbol() external view override returns(string memory)
    {
        return _symbol;
    }
}