
import "../FREX.sol";
import "../../../security/Pausable.sol";

/**
 * @dev FREX token with pausable token transfers, minting and burning.
 *
 * Useful for scenarios such as preventing trades until the end of an evaluation
 * period, or having an emergency switch for freezing all token transfers in the
 * event of a large bug.
 */
abstract contract FREXPausable is FREX, Pausable {
    /**
     * @dev See {FREX-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "TRC20Pausable: token transfer while paused");
    }
}
