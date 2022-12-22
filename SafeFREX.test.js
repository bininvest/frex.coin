const { expectRevert, createContract } = require("@bininvest/frex-test-helpers");

const FREXReturnFalseMock = artifacts.require("FREXReturnFalseMock");
const FREXReturnTrueMock = artifacts.require("FREXReturnTrueMock");
const FREXNoReturnMock = artifacts.require("FREXNoReturnMock");
const SafeFREXWrapper = artifacts.require("SafeFREXWrapper");

contract("SafeFREX", function (accounts) {
    const [hasNoCode] = accounts;

    describe("with address that has no contract code", function () {
        beforeEach(async function () {
            this.wrapper = await createContract(SafeFREXWrapper, hasNoCode);
        });

        shouldRevertOnAllCalls("Address: call to non-contract");
    });

    describe("with token that returns false on all calls", function () {
        beforeEach(async function () {
            this.wrapper = await createContract(SafeFREXWrapper, (await createContract(FREXReturnFalseMock)).address);
        });

        shouldRevertOnAllCalls("SafeFREX: FREX operation did not succeed");
    });

    describe("with token that returns true on all calls", function () {
        beforeEach(async function () {
            this.wrapper = await createContract(SafeFREXWrapper, (await createContract(FREXReturnTrueMock)).address);
        });

        shouldOnlyRevertOnErrors();
    });

    describe("with token that returns no boolean values", function () {
        beforeEach(async function () {
            this.wrapper = await createContract(SafeFREXWrapper, (await createContract(FREXNoReturnMock)).address);
        });

        shouldOnlyRevertOnErrors();
    });
});

function shouldRevertOnAllCalls(reason) {
    it("reverts on transfer", async function () {
        await expectRevert(this.wrapper.transfer().send(), reason);
    });

    it("reverts on transferFrom", async function () {
        await expectRevert(this.wrapper.transferFrom().send(), reason);
    });

    it("reverts on approve", async function () {
        await expectRevert(this.wrapper.approve(0).send(), reason);
    });

    it("reverts on increaseAllowance", async function () {
        // [TODO] make sure it's reverting for the right reason
        await expectRevert.unspecified(this.wrapper.increaseAllowance(0).send());
    });

    it("reverts on decreaseAllowance", async function () {
        // [TODO] make sure it's reverting for the right reason
        await expectRevert.unspecified(this.wrapper.decreaseAllowance(0).send());
    });
}

function shouldOnlyRevertOnErrors() {
    it("doesn't revert on transfer", async function () {
        await this.wrapper.transfer().send({ shouldPollResponse: true });
    });

    it("doesn't revert on transferFrom", async function () {
        await this.wrapper.transferFrom().send({ shouldPollResponse: true });
    });

    describe("approvals", function () {
        context("with zero allowance", function () {
            beforeEach(async function () {
                await this.wrapper.setAllowance(0).send({ shouldPollResponse: true });
            });

            it("doesn't revert when approving a non-zero allowance", async function () {
                await this.wrapper.approve(100).send({ shouldPollResponse: true });
            });

            it("doesn't revert when approving a zero allowance", async function () {
                await this.wrapper.approve(0).send({ shouldPollResponse: true });
            });

            it("doesn't revert when increasing the allowance", async function () {
                await this.wrapper.increaseAllowance(10).send({ shouldPollResponse: true });
            });

            it("reverts when decreasing the allowance", async function () {
                await expectRevert(
                    this.wrapper.decreaseAllowance(10).send(),
                    "SafeFREX: decreased allowance below zero",
                );
            });
        });

        context("with non-zero allowance", function () {
            beforeEach(async function () {
                await this.wrapper.setAllowance(100).send({ shouldPollResponse: true });
            });

            it("reverts when approving a non-zero allowance", async function () {
                await expectRevert(
                    this.wrapper.approve(20).send(),
                    "SafeFREX: approve from non-zero to non-zero allowance",
                );
            });

            it("doesn't revert when approving a zero allowance", async function () {
                await this.wrapper.approve(0).send({ shouldPollResponse: true });
            });

            it("doesn't revert when increasing the allowance", async function () {
                await this.wrapper.increaseAllowance(10).send({ shouldPollResponse: true });
            });

            it("doesn't revert when decreasing the allowance to a positive value", async function () {
                await this.wrapper.decreaseAllowance(50).send({ shouldPollResponse: true });
            });

            it("reverts when decreasing the allowance to a negative value", async function () {
                await expectRevert(
                    this.wrapper.decreaseAllowance(200).send(),
                    "SafeFREX: decreased allowance below zero",
                );
            });
        });
    });
}
