
import "../Bininvest.sol";
import "../../token/FREX/extensions/FREXVotesComp.sol";

/**
 * @dev Extension of {Bininvest} for voting weight extraction from a Comp token.
 *
 * _Available since v4.3._
 */
abstract contract BininvestVotesComp is Bininvest {
    FREXVotesComp public immutable token;

    constructor(FREXVotesComp token_) {
        token = token_;
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
        return token.getPriorVotes(account, blockNumber);
    }
}
