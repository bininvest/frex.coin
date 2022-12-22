const { BN, createContract, account } = require("@bininvest/frex-test-helpers");

const { shouldBehaveLikeFREXBurnable } = require("./FREXBurnable.behavior");
const FREXBurnableMock = artifacts.require("FREXBurnableMock");

contract("FREXBurnable", function (accounts) {
    const [owner, ...otherAccounts] = accounts;

    const initialBalance = new BN(1000);

    const name = "Freedom";
    const symbol = "FREX";

    beforeEach(async function () {
        account.setDefault(owner);
        this.token = await createContract(FREXBurnableMock, name, symbol, owner, initialBalance.toFixed());
    });

    shouldBehaveLikeFREXBurnable(owner, initialBalance, otherAccounts);
});
