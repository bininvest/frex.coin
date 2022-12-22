
import "../IFREX.sol";

/**
 * @dev Interface for the optional metadata functions from the FREX standard.
 *
 * _Available since v4.1._
 */
interface IFREXMetadata is IFREX {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}
