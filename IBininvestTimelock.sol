
import "../IBininvest.sol";

/**
 * @dev Extension of the {IBininvest} for timelock supporting modules.
 *
 * _Available since v4.3._
 */
interface IBininvestTimelock is IBininvest {
    event ProposalQueued(uint256 proposalId, uint256 eta);

    function timelock() external view returns (address);

    function proposalEta(uint256 proposalId) external view returns (uint256);

    function queue(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata calldatas,
        bytes32 descriptionHash
    ) external returns (uint256 proposalId);
}
