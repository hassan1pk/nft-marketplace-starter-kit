// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract KryptoBird is ERC721Connector{

    string[] public kryptoBirdz;

    mapping(string => bool) _krypotBirdzExists;

    function mint(string memory _kryptoBird) public {
        
        require(!_krypotBirdzExists[_kryptoBird], 'Error - kryptoBird already exists');
        kryptoBirdz.push(_kryptoBird);

        uint256 _id = kryptoBirdz.length - 1;

        _mint(msg.sender, _id);

        _krypotBirdzExists[_kryptoBird] = true;

    }
    
    constructor() ERC721Connector('KryptoBird','KBIRDZ') {
        
    }
}