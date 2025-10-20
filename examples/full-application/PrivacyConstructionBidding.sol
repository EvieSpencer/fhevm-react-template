// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title Privacy Construction Bidding Platform v2.0
 * @notice Migrated to support Sepolia deployment with new fhEVM Gateway
 * @dev Changes from v1.0:
 * Updated imports to use fhevm/solidity new package structure
 * Changed from TFHE to FHE library
 * Simplified Gateway integration for Sepolia compatibility
 * Removed complex Gateway.requestDecryption for direct decryption
 * Added view functions compatible with standard networks
 */
contract PrivacyConstructionBidding is SepoliaConfig {

    address public owner;
    uint256 public projectCount;

    struct Project {
        string name;
        string description;
        address creator;
        uint256 maxBudget;
        uint256 deadline;
        uint256 biddingEndTime;
        bool isActive;
        bool biddingClosed;
        address[] bidders;
        address winner;
        uint256 winningAmount;
    }

    struct PrivateBid {
        euint32 encryptedAmount;
        euint32 encryptedCompletionTime;
        string proposal;
        bool submitted;
        uint256 timestamp;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => PrivateBid)) private bids;
    mapping(address => bool) public authorizedContractors;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, string name);
    event BidSubmitted(uint256 indexed projectId, address indexed contractor);
    event BiddingClosed(uint256 indexed projectId);
    event WinnerSelected(uint256 indexed projectId, address indexed winner);
    event ContractorAuthorized(address indexed contractor);
    event ContractorRevoked(address indexed contractor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedContractor() {
        require(authorizedContractors[msg.sender], "Not authorized contractor");
        _;
    }

    constructor() {
        owner = msg.sender;
        projectCount = 0;
    }

    function authorizeContractor(address contractor) external onlyOwner {
        require(!authorizedContractors[contractor], "Already authorized");
        authorizedContractors[contractor] = true;
        emit ContractorAuthorized(contractor);
    }

    function revokeContractor(address contractor) external onlyOwner {
        require(authorizedContractors[contractor], "Not authorized");
        authorizedContractors[contractor] = false;
        emit ContractorRevoked(contractor);
    }

    function isAuthorizedContractor(address contractor) external view returns (bool) {
        return authorizedContractors[contractor];
    }

    function createProject(
        string memory name,
        string memory description,
        uint256 maxBudget,
        uint256 deadline,
        uint256 biddingDuration
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(maxBudget > 0, "Budget must be positive");
        require(deadline > block.timestamp, "Deadline must be future");
        require(biddingDuration > 0, "Duration must be positive");

        projectCount++;

        Project storage project = projects[projectCount];
        project.name = name;
        project.description = description;
        project.creator = msg.sender;
        project.maxBudget = maxBudget;
        project.deadline = deadline;
        project.biddingEndTime = block.timestamp + biddingDuration;
        project.isActive = true;
        project.biddingClosed = false;
        project.winner = address(0);
        project.winningAmount = 0;

        emit ProjectCreated(projectCount, msg.sender, name);
        return projectCount;
    }

    function submitBid(
        uint256 projectId,
        uint256 bidAmount,
        uint256 completionTime,
        string memory proposal
    ) external onlyAuthorizedContractor {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        require(project.isActive, "Project not active");
        require(!project.biddingClosed, "Bidding closed");
        require(block.timestamp < project.biddingEndTime, "Bidding period ended");
        require(!bids[projectId][msg.sender].submitted, "Already submitted");
        require(bidAmount > 0 && bidAmount <= project.maxBudget, "Invalid bid amount");

        // Encrypt bid data using FHE
        euint32 encAmount = FHE.asEuint32(uint32(bidAmount));
        euint32 encTime = FHE.asEuint32(uint32(completionTime));

        bids[projectId][msg.sender] = PrivateBid({
            encryptedAmount: encAmount,
            encryptedCompletionTime: encTime,
            proposal: proposal,
            submitted: true,
            timestamp: block.timestamp
        });

        project.bidders.push(msg.sender);

        // Set FHE permissions
        FHE.allowThis(encAmount);
        FHE.allowThis(encTime);
        FHE.allow(encAmount, msg.sender);
        FHE.allow(encTime, msg.sender);
        FHE.allow(encAmount, project.creator);
        FHE.allow(encTime, project.creator);

        emit BidSubmitted(projectId, msg.sender);
    }

    function closeBidding(uint256 projectId) external {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        require(
            msg.sender == project.creator ||
            block.timestamp >= project.biddingEndTime,
            "Not project creator"
        );
        require(!project.biddingClosed, "Already closed");

        project.biddingClosed = true;
        emit BiddingClosed(projectId);
    }

    function evaluateBids(uint256 projectId) external {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        require(msg.sender == project.creator, "Not project creator");
        require(project.biddingClosed, "Bidding not closed");
        require(project.bidders.length > 0, "No bids submitted");

        address bestBidder = address(0);
        euint32 lowestAmount = FHE.asEuint32(type(uint32).max);

        for (uint i = 0; i < project.bidders.length; i++) {
            address bidder = project.bidders[i];
            PrivateBid storage bid = bids[projectId][bidder];

            // Compare encrypted amounts using FHE
            ebool isLower = FHE.lt(bid.encryptedAmount, lowestAmount);

            // Conditionally select the lowest bid
            lowestAmount = FHE.select(isLower, bid.encryptedAmount, lowestAmount);

            // For simplicity in this version, we'll select first bidder
            // In production, you'd need Gateway decryption for actual comparison
            if (bestBidder == address(0)) {
                bestBidder = bidder;
            }
        }

        // Select winner (simplified - uses first bidder)
        // Production version would use Gateway to decrypt and compare
        if (bestBidder != address(0)) {
            project.winner = project.bidders[0]; // Simplified selection
            project.isActive = false;
            emit WinnerSelected(projectId, project.winner);
        }
    }

    function getProject(uint256 projectId) external view returns (
        string memory name,
        string memory description,
        address creator,
        uint256 maxBudget,
        uint256 deadline,
        uint256 biddingEndTime,
        bool isActive,
        bool biddingClosed,
        address winner
    ) {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        return (
            project.name,
            project.description,
            project.creator,
            project.maxBudget,
            project.deadline,
            project.biddingEndTime,
            project.isActive,
            project.biddingClosed,
            project.winner
        );
    }

    function getProjectBidders(uint256 projectId) external view returns (address[] memory) {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        return projects[projectId].bidders;
    }

    function getBid(uint256 projectId, address bidder) external view returns (
        uint256 amount,
        uint256 completionTime,
        string memory proposal,
        bool submitted,
        uint256 timestamp
    ) {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        require(
            msg.sender == project.creator || msg.sender == bidder,
            "Not authorized to view"
        );

        PrivateBid storage bid = bids[projectId][bidder];

        // Return encrypted data as sealed values (can only be decrypted by authorized parties)
        // For view function, we return 0 for encrypted values (they need proper decryption)
        return (
            0, // Encrypted - needs FHE decryption
            0, // Encrypted - needs FHE decryption
            bid.proposal,
            bid.submitted,
            bid.timestamp
        );
    }

    function getBidEncrypted(uint256 projectId, address bidder) external view returns (
        bytes32 encryptedAmount,
        bytes32 encryptedTime,
        string memory proposal,
        bool submitted
    ) {
        require(projectId > 0 && projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[projectId];
        require(
            msg.sender == project.creator || msg.sender == bidder,
            "Not authorized to view"
        );

        PrivateBid storage bid = bids[projectId][bidder];

        return (
            FHE.toBytes32(bid.encryptedAmount),
            FHE.toBytes32(bid.encryptedCompletionTime),
            bid.proposal,
            bid.submitted
        );
    }
}
