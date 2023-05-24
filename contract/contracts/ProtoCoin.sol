// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProtoCoin is ERC20 {
    address private _owner;
    uint256 private _mintAmount = 0;
    uint64 private _mintDelay = 60 * 60 * 24; // 1 day in seconds

    mapping(address => uint256) private nextMind;

    constructor() ERC20("ProtoCoin", "PRC") {
        _owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function mint() public {
        require(_mintAmount > 0, "Minting is not enabled");
        require(
            block.timestamp > nextMind[msg.sender],
            "Minting is not available yet"
        );
        _mint(msg.sender, _mintAmount);
        nextMind[msg.sender] = block.timestamp + _mintDelay;
    }

    function setMintAmount(uint256 newAmount) public restricted {
        _mintAmount = newAmount;
    }

    function setMintDelay(uint64 delayInSeconds) public restricted {
        _mintDelay = delayInSeconds;
    }

    modifier restricted() {
        require(_owner == msg.sender, "Unauthorized");
        _;
    }
}
