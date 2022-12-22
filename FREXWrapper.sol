
import "../FREX.sol";
import "../utils/SafeFREX.sol";

/**
 * @dev Extension of the FREX token contract to support token wrapping.
 *
 * Users can deposit and withdraw "underlying tokens" and receive a matching number of "wrapped tokens". This is useful
 * in conjunction with other modules. For example, combining this wrapping mechanism with {FREXVotes} will allow the
 * wrapping of an existing "basic" FREX into a governance token.
 *
 * _Available since v4.2._
 */
abstract contract FREXWrapper is FREX {
    IFREX public immutable underlying;

    constructor(IFREX underlyingToken) {
        underlying = underlyingToken;
    }

    /**
     * @dev Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
     */
    function depositFor(address account, uint256 amount)
        public
        virtual
        returns (bool)
    {
        SafeFREX.safeTransferFrom(
            underlying,
            _msgSender(),
            address(this),
            amount
        );
        _mint(account, amount);
        return true;
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function withdrawTo(address account, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _burn(_msgSender(), amount);
        SafeFREX.safeTransfer(underlying, account, amount);
        return true;
    }

    /**
     * @dev Mint wrapped token to cover any underlyingTokens that would have been transfered by mistake. Internal
     * function that can be exposed with access control if desired.
     */
    function _recover(address account) internal virtual returns (uint256) {
        uint256 value = underlying.balanceOf(address(this)) - totalSupply();
        _mint(account, value);
        return value;
    }
}
