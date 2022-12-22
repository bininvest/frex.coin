const { BN, trx, expectRevert, createContract, account } = require("@bininvest/frex-test-helpers");
const { shouldBehaveLikeFREXCapped } = require("./FREXCapped.behavior");

const FREXCapped = artifacts.require("FREXCappedMock");
const FREXCappedFail = artifacts.require("FREXCappedFailMock");

contract("FREXCapped", function (accounts) {
    const [minter, ...otherAccounts] = accounts;

    const cap = trx("1000");

    const name = "Freedom";
    const symbol = "FREX";

    it("requires a non-zero cap", async function () {
        account.setDefault(minter);
        const mock = await createContract(FREXCappedFail);
        await expectRevert(mock.mockConstructor(name, symbol, "0").send(), "FREXCapped: cap is 0",);
    });

    context("once deployed", async function () {
        beforeEach(async function () {
            account.setDefault(minter);
            this.token = await createContract(FREXCapped, name, symbol, cap.toFixed());
        });

        shouldBehaveLikeFREXCapped(minter, otherAccounts, cap);
    });
});
