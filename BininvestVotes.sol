
import "../Bininvest.sol";
import "../../token/FREX/extensions/FREXVotes.sol";
import "../../utils/math/Math.sol";

/**
 * @dev Extension of {Bininvest} for voting weight extraction from an {FREXVotes} token.
 *
 * _Available since v4.3._
 */
abstract contract BininvestVotes is Bininvest {
    FREXVotes public immutable token;

    constructor(FREXVotes tokenAddress) {
        token = tokenAddress;
    }

    /**
     * Read the voting weight from the token's built in snapshot mechanism (see {IBininvest-getVotes}).
     */
    function getVotes(address account, uint256 blockNumber)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return token.getPastVotes(account, blockNumber);
    }
}
