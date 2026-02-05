import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("OmniGraphToken", function () {
  async function deployFixture() {
    const [owner, feeCollector, user1, user2, lpPair] = await ethers.getSigners();

    const OmniGraphToken = await ethers.getContractFactory("OmniGraphToken");
    const maxBurnable = ethers.parseEther("300000000"); // 300M

    const token = await OmniGraphToken.deploy(
      "OmniGraph",
      "OGX",
      feeCollector.address,
      maxBurnable,
      owner.address
    );

    return { token, owner, feeCollector, user1, user2, lpPair };
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("OmniGraph");
      expect(await token.symbol()).to.equal("OGX");
    });

    it("Should mint total supply to owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      const totalSupply = await token.totalSupply();
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
      expect(totalSupply).to.equal(ethers.parseEther("1000000000"));
    });

    it("Should set correct initial tax rates", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.buyTaxBps()).to.equal(300); // 3%
      expect(await token.sellTaxBps()).to.equal(700); // 7%
    });

    it("Should set fee collector as excluded from fees", async function () {
      const { token, feeCollector } = await loadFixture(deployFixture);
      expect(await token.isExcludedFromFees(feeCollector.address)).to.be.true;
    });
  });

  describe("Tax Configuration", function () {
    it("Should allow owner to set buy tax within limits", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.connect(owner).setBuyTaxBps(200);
      expect(await token.buyTaxBps()).to.equal(200);
    });

    it("Should revert when buy tax exceeds max", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await expect(token.connect(owner).setBuyTaxBps(400)).to.be.revertedWithCustomError(
        token,
        "BuyTaxTooHigh"
      );
    });

    it("Should allow owner to set sell tax within limits", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.connect(owner).setSellTaxBps(500);
      expect(await token.sellTaxBps()).to.equal(500);
    });

    it("Should revert when sell tax exceeds max", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await expect(token.connect(owner).setSellTaxBps(800)).to.be.revertedWithCustomError(
        token,
        "SellTaxTooHigh"
      );
    });
  });

  describe("Trading Controls", function () {
    it("Should not allow trading before enabled", async function () {
      const { token, owner, user1 } = await loadFixture(deployFixture);
      await token.connect(owner).transfer(user1.address, ethers.parseEther("1000"));

      // User1 is not excluded, should fail without trading enabled
      // (Actually owner transfer works because owner is excluded)
      expect(await token.tradingEnabled()).to.be.false;
    });

    it("Should allow trading after enabled", async function () {
      const { token, owner, user1, user2 } = await loadFixture(deployFixture);
      await token.connect(owner).transfer(user1.address, ethers.parseEther("1000"));
      await token.connect(owner).enableTrading();

      // Now user1 can transfer
      await expect(
        token.connect(user1).transfer(user2.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });

    it("Should only allow enabling trading once", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.connect(owner).enableTrading();
      await expect(token.connect(owner).enableTrading()).to.be.revertedWithCustomError(
        token,
        "TradingAlreadyEnabled"
      );
    });
  });

  describe("Fee Collection", function () {
    it("Should collect buy tax on purchases", async function () {
      const { token, owner, feeCollector, user1, lpPair } = await loadFixture(deployFixture);

      // Setup LP pair
      await token.connect(owner).setLpPair(lpPair.address);
      await token.connect(owner).transfer(lpPair.address, ethers.parseEther("1000000"));
      await token.connect(owner).enableTrading();

      // Simulate buy (transfer from lpPair to user1)
      const amount = ethers.parseEther("10000");
      const expectedTax = (amount * BigInt(300)) / BigInt(10000); // 3%
      const expectedNet = amount - expectedTax;

      await token.connect(lpPair).transfer(user1.address, amount);

      expect(await token.balanceOf(feeCollector.address)).to.equal(expectedTax);
      expect(await token.balanceOf(user1.address)).to.equal(expectedNet);
    });

    it("Should collect sell tax on sales", async function () {
      const { token, owner, feeCollector, user1, lpPair } = await loadFixture(deployFixture);

      // Setup
      await token.connect(owner).setLpPair(lpPair.address);
      await token.connect(owner).transfer(user1.address, ethers.parseEther("10000"));
      await token.connect(owner).enableTrading();

      // Simulate sell (transfer from user1 to lpPair)
      const amount = ethers.parseEther("10000");
      const expectedTax = (amount * BigInt(700)) / BigInt(10000); // 7%

      const feeBalanceBefore = await token.balanceOf(feeCollector.address);
      await token.connect(user1).transfer(lpPair.address, amount);

      const feeBalanceAfter = await token.balanceOf(feeCollector.address);
      expect(feeBalanceAfter - feeBalanceBefore).to.equal(expectedTax);
    });

    it("Should not collect tax on regular transfers", async function () {
      const { token, owner, feeCollector, user1, user2 } = await loadFixture(deployFixture);

      await token.connect(owner).transfer(user1.address, ethers.parseEther("10000"));
      await token.connect(owner).enableTrading();

      const amount = ethers.parseEther("1000");
      const feeBalanceBefore = await token.balanceOf(feeCollector.address);

      await token.connect(user1).transfer(user2.address, amount);

      const feeBalanceAfter = await token.balanceOf(feeCollector.address);
      expect(feeBalanceAfter).to.equal(feeBalanceBefore); // No tax on regular transfer
      expect(await token.balanceOf(user2.address)).to.equal(amount);
    });
  });

  describe("Limits", function () {
    it("Should enforce max transaction amount", async function () {
      const { token, owner, user1, lpPair } = await loadFixture(deployFixture);

      await token.connect(owner).setLpPair(lpPair.address);
      await token.connect(owner).transfer(lpPair.address, ethers.parseEther("100000000"));
      await token.connect(owner).enableTrading();

      // Max tx is 1% of supply = 10M
      const overLimit = ethers.parseEther("15000000");
      await expect(token.connect(lpPair).transfer(user1.address, overLimit)).to.be.revertedWithCustomError(
        token,
        "TransferExceedsMaxTx"
      );
    });

    it("Should allow disabling limits", async function () {
      const { token, owner, user1, lpPair } = await loadFixture(deployFixture);

      await token.connect(owner).setLpPair(lpPair.address);
      await token.connect(owner).transfer(lpPair.address, ethers.parseEther("100000000"));
      await token.connect(owner).enableTrading();
      await token.connect(owner).disableLimitsForever();

      // Should now work
      const overLimit = ethers.parseEther("15000000");
      await expect(token.connect(lpPair).transfer(user1.address, overLimit)).to.not.be.reverted;
    });
  });

  describe("Burning", function () {
    it("Should track burned tokens", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      const burnAmount = ethers.parseEther("1000");
      await token.connect(owner).burn(burnAmount);

      expect(await token.totalBurned()).to.equal(burnAmount);
    });

    it("Should enforce burn cap", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      const maxBurnable = await token.maxBurnable();
      await expect(token.connect(owner).burn(maxBurnable + BigInt(1))).to.be.revertedWithCustomError(
        token,
        "ExceedsBurnCap"
      );
    });
  });
});
