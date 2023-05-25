const ProtoCoin = artifacts.require("ProtoCoin");
const { BN, time } = require('@openzeppelin/test-helpers');

contract('ProtoCoin', function (accounts) {
  const DECIMALS = new BN(18)

  beforeEach(async () => {
    contract = await ProtoCoin.new();
  })

  it("should return correct name", async () => {
    const name = await contract.name()
    assert(name === 'ProtoCoin', 'Incorrect name')
  });

  it("should return correct symbol", async () => {
    const symbol = await contract.symbol()
    assert(symbol === 'PRC', 'Incorrect symbol')
  });

  it("should return correct decimals", async () => {
    const decimals = await contract.decimals()
    assert(decimals.eq(DECIMALS), 'Incorrect decimals')
  });

  it("should return correct total supply", async () => {
    const TOTAL_SUPPLY = new BN(10000000).mul(new BN(10).pow(DECIMALS))
    const totalSupply = await contract.totalSupply()
    assert(totalSupply.eq(TOTAL_SUPPLY), 'Incorrect total supply')
  });

  it("owner should have total supply", async () => {
    const TOTAL_SUPPLY = new BN(10000000).mul(new BN(10).pow(DECIMALS))
    const ownerBalance = await contract.balanceOf(accounts[0])
    assert(ownerBalance.eq(TOTAL_SUPPLY), 'Incorrect owner balance')
  });

  it("should transfer", async () => {
    const transferAmount = new BN(1).mul(new BN(10).pow(DECIMALS))

    const balanceSenderBefore = await contract.balanceOf(accounts[0])
    const balanceToBefore = await contract.balanceOf(accounts[1])

    await contract.transfer(accounts[1], transferAmount)

    const balanceSenderAfter = await contract.balanceOf(accounts[0])
    const balanceToAfter = await contract.balanceOf(accounts[1])

    assert(balanceSenderAfter.eq(balanceSenderBefore.sub(transferAmount)), 'Incorrect sender balance')
    assert(balanceToAfter.eq(balanceToBefore.add(transferAmount)), 'Incorrect receiver balance')
  });

  it("should NOT transfer", async () => {
    const transferAmount = new BN(10000001).mul(new BN(10).pow(DECIMALS))

    try {
      await contract.transfer(accounts[1], transferAmount)
      assert.fail('the transfer should have thrown an error')
    } catch (err) {
      assert.include(err.message, 'revert', 'the transfer should have been reverted')
    }
  });

  it("should approve", async () => {
    const amountApproved = new BN(1).mul(new BN(10).pow(DECIMALS))
    await contract.approve(accounts[1], amountApproved)

    const allowance = await contract.allowance(accounts[0], accounts[1])

    assert(allowance.eq(amountApproved), 'Incorrect allowance balance')
  });

  it("should transfer from", async () => {
    const transferAmount = new BN(1).mul(new BN(10).pow(DECIMALS))

    const allowanceBefore = await contract.allowance(accounts[0], accounts[1])
    const balanceSenderBefore = await contract.balanceOf(accounts[0])
    const balanceToBefore = await contract.balanceOf(accounts[1])

    await contract.approve(accounts[1], transferAmount, { from: accounts[0] })
    await contract.transferFrom(accounts[0], accounts[1], transferAmount, { from: accounts[1] })

    const allowanceAfter = await contract.allowance(accounts[0], accounts[1])
    const balanceSenderAfter = await contract.balanceOf(accounts[0])
    const balanceToAfter = await contract.balanceOf(accounts[1])

    assert(allowanceAfter.eq(allowanceBefore), 'Incorrect allowance')
    assert(balanceSenderAfter.eq(balanceSenderBefore.sub(transferAmount)), 'Incorrect sender balance')
    assert(balanceToAfter.eq(balanceToBefore.add(transferAmount)), 'Incorrect receiver balance')
  });

  it("should NOT transfer from", async () => {
    const transferAmount = new BN(1).mul(new BN(10).pow(DECIMALS))

    try {
      await contract.transferFrom(accounts[0], accounts[1], transferAmount, { from: accounts[1] })
      assert.fail('the transferFrom should have thrown an error (no allowance)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the transferFrom should have been reverted (no allowance)')
    }
  });

  it("should mint once", async () => {
    const mintAmount = new BN(1000)
    await contract.setMintAmount(mintAmount)

    const balanceBefore = await contract.balanceOf(accounts[1])
    await contract.mint(accounts[1], { from: accounts[0] })
    const balanceAfter = await contract.balanceOf(accounts[1])

    assert(balanceAfter.eq(balanceBefore.add(mintAmount)), 'Incorrect balance')
  });

  // it("should mint twice (owner)", async () => {
  //   const mintAmount = new BN(1000)
  //   await contract.setMintAmount(mintAmount)

  //   const balanceBefore = await contract.balanceOf(accounts[0])

  //   await contract.mint({ from: accounts[0] })
  //   await contract.mint({ from: accounts[0] })

  //   const balanceAfter = await contract.balanceOf(accounts[0])

  //   assert(balanceAfter.eq(balanceBefore.add(mintAmount.mul(new BN(2)))), 'Incorrect balance for owner')
  // });

  it("should mint twice (different accounts)", async () => {
    const mintAmount = new BN(1000)
    await contract.setMintAmount(mintAmount)

    const balanceOneBefore = await contract.balanceOf(accounts[1])
    const balanceTwoBefore = await contract.balanceOf(accounts[2])
    await contract.mint(accounts[1], { from: accounts[0] })
    await contract.mint(accounts[2], { from: accounts[0] })
    const balanceOneAfter = await contract.balanceOf(accounts[1])
    const balanceTwoAfter = await contract.balanceOf(accounts[2])

    assert(balanceOneAfter.eq(balanceOneBefore.add(mintAmount)), 'Incorrect balance for account 1')
    assert(balanceTwoAfter.eq(balanceTwoBefore.add(mintAmount)), 'Incorrect balance for account 2')
  });

  it("should mint twice (same account, different moments)", async () => {
    const mintAmount = new BN(1000)
    await contract.setMintAmount(mintAmount)

    const delayInSeconds = 1
    await contract.setMintDelay(delayInSeconds)

    const balanceBefore = await contract.balanceOf(accounts[1])
    await contract.mint(accounts[1], { from: accounts[0] })

    await time.increase(delayInSeconds * 2)

    await contract.mint(accounts[1], { from: accounts[0] })
    const balanceAfter = await contract.balanceOf(accounts[1])

    assert(balanceAfter.eq(balanceBefore.add(new BN(mintAmount * 2))), 'Incorrect balance')
  });

  it("should NOT mint (unauthorized)", async () => {
    await contract.setMintAmount(new BN(1000))

    try {
      await contract.mint(accounts[1], { from: accounts[1] })
      assert.fail('the mint should have thrown an error (unauthorized)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the mint should have been reverted')
    }
  });

  it("should NOT mint (disabled)", async () => {
    try {
      await contract.mint(accounts[1], { from: accounts[0] })
      assert.fail('the mint should have thrown an error (disabled)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the mint should have been reverted')
    }
  });

  it("should NOT mint twice", async () => {
    await contract.setMintAmount(1000)
    await contract.mint(accounts[1], { from: accounts[0] })

    try {
      await contract.mint(accounts[1], { from: accounts[0] })
      assert.fail('the mint should have thrown an error (disabled)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the mint should have been reverted')
    }
  });

  it("should NOT setMintAmount (unauthorized)", async () => {
    try {
      await contract.setMintAmount(1000, { from: accounts[1] })
      assert.fail('the setMintAmount should have thrown an error (unauthorized)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the setMintAmount should have been reverted')
    }
  });

  it("should NOT setMintDelay (unauthorized)", async () => {
    try {
      await contract.setMintDelay(1000, { from: accounts[1] })
      assert.fail('the setMintDelay should have thrown an error (unauthorized)')
    } catch (err) {
      assert.include(err.message, 'revert', 'the setMintDelay should have been reverted')
    }
  });
});
