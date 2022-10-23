// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
building out the minting function:
    a. nft to point to an address
    b. keep track of the token ids
    c. keep track of token owner addresses to token ids
    d. keep track of how many tokens an owner address has
    e. create an event that emits a transfer log- contract address 
    where it is being minted to, and the id.
*/

contract ERC721 {

    event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 indexed tokenId
    );

    mapping(uint256 => address) private _tokenOwner;

    mapping(address => uint256) private _OwnedTokensCount;

    mapping(uint256 => address) private _tokenApprovals;

    function balanceOf(address _owner) public view returns(uint256) {
        require(_owner != address(0), 'Owner query for non-existent token');
        return _OwnedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns(address) {
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
        _OwnedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
        require(_to != address(0), 'ERC271: token cannot be transferred to the zero address');
        require(ownerOf(_tokenId) == _from, 'ERC271: the from address does not own the token being transferred');
        _tokenOwner[_tokenId] = _to;
        _OwnedTokensCount[_from] -= 1;
        _OwnedTokensCount[_to] += 1;

        emit Transfer(_from, _to, _tokenId);

    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        _transferFrom(_from, _to, _tokenId);
    }
}
