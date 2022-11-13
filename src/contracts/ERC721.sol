// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC165.sol';
import './interfaces/IERC721.sol';
import './libraries/Counters.sol';

/*
building out the minting function:
    a. nft to point to an address
    b. keep track of the token ids
    c. keep track of token owner addresses to token ids
    d. keep track of how many tokens an owner address has
    e. create an event that emits a transfer log- contract address 
    where it is being minted to, and the id.
*/

contract ERC721 is ERC165, IERC721 {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    /*event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 indexed tokenId
    );

    event Approval (
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );*/

    mapping(uint256 => address) private _tokenOwner;

    mapping(address => Counters.Counter) private _OwnedTokensCount;

    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        _registerInterface(bytes4(keccak256('balanceOf(address)') ^ keccak256('ownerOf(uint256)') ^
        keccak256('transferFrom(address,address,uint256)')));
    }
  

    function balanceOf(address _owner) public override view returns(uint256) {
        require(_owner != address(0), 'Owner query for non-existent token');
        return _OwnedTokensCount[_owner].current();
    }

    function ownerOf(uint256 _tokenId) public override view returns(address) {
        require(_tokenOwner[_tokenId] != address(0), 'Owner query for non-existent token');
        return _tokenOwner[_tokenId];
    }

    function _exists(uint256 tokenId) internal view returns(bool) {
        address owner = _tokenOwner[tokenId];

        return owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual{
        require(to != address(0),'ERC721: minting to the zero address');
        //require(_tokenOwner[tokenId] == address(0));
        require(!_exists(tokenId),'ER721: token already minted');
        _tokenOwner[tokenId] = to;
        //_OwnedTokensCount[to] += 1;
        _OwnedTokensCount[to].increment();

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0), 'ERC271: token cannot be transferred to the zero address');
        require(ownerOf(_tokenId) == _from, 'ERC271: the from address does not own the token being transferred');
        _tokenOwner[_tokenId] = _to;
        /*_OwnedTokensCount[_from] -= 1;
        _OwnedTokensCount[_to] += 1;*/
        _OwnedTokensCount[_from].decrement();
        _OwnedTokensCount[_to].increment();

        emit Transfer(_from, _to, _tokenId);

    }

    function transferFrom(address _from, address _to, uint256 _tokenId) override public {
        require(isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) override public {
        address owner = ownerOf(_tokenId);
        require(_to != owner, 'Error - approval current owner');
        require(msg.sender == owner, 'Current caller is not the owner of the token');
        _tokenApprovals[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }

    function getApproved(uint256 tokenId) public view returns(address)
    {
        require(_exists(tokenId), 'token does not exist');
        return _tokenApprovals[tokenId];
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) internal view returns(bool){
        require(_exists(tokenId), 'token does not exist');
        address owner = ownerOf(tokenId);
        return (spender==owner) || (getApproved(tokenId) == spender);
    }
}
