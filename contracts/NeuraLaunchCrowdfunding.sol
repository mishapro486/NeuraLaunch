// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title NeuraLaunchCrowdfunding
 * @dev Decentralized crowdfunding platform for AI projects on Neura Network
 */
contract NeuraLaunchCrowdfunding {
    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        string imageUrl;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool claimed;
        CampaignStatus status;
    }

    enum CampaignStatus {
        Active,
        Funded,
        Expired,
        Claimed
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    uint256 public campaignCount;
    uint256 public platformFee = 250; // 2.5% in basis points
    address public owner;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 totalRaised
    );

    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    event RefundIssued(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Campaign does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _imageUrl Campaign image URL
     * @param _goal Funding goal in wei
     * @param _durationDays Campaign duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _goal,
        uint256 _durationDays
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationDays > 0 && _durationDays <= 365, "Invalid duration");

        campaignCount++;
        
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            goal: _goal,
            raised: 0,
            deadline: block.timestamp + (_durationDays * 1 days),
            claimed: false,
            status: CampaignStatus.Active
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _goal,
            block.timestamp + (_durationDays * 1 days)
        );

        return campaignCount;
    }

    /**
     * @dev Donate to a campaign
     * @param _campaignId Campaign ID to donate to
     */
    function donate(uint256 _campaignId) external payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(campaign.status == CampaignStatus.Active, "Campaign is not active");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.raised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        if (campaign.raised >= campaign.goal) {
            campaign.status = CampaignStatus.Funded;
        }

        emit DonationReceived(_campaignId, msg.sender, msg.value, campaign.raised);
    }

    /**
     * @dev Claim funds from a successful campaign
     * @param _campaignId Campaign ID to claim funds from
     */
    function claimFunds(uint256 _campaignId) external campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(msg.sender == campaign.creator, "Only creator can claim funds");
        require(campaign.raised >= campaign.goal, "Funding goal not reached");
        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        campaign.status = CampaignStatus.Claimed;

        uint256 fee = (campaign.raised * platformFee) / 10000;
        uint256 creatorAmount = campaign.raised - fee;

        payable(owner).transfer(fee);
        payable(campaign.creator).transfer(creatorAmount);

        emit FundsClaimed(_campaignId, campaign.creator, creatorAmount);
    }

    /**
     * @dev Request refund from a failed campaign
     * @param _campaignId Campaign ID to request refund from
     */
    function requestRefund(uint256 _campaignId) external campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(block.timestamp >= campaign.deadline, "Campaign is still active");
        require(campaign.raised < campaign.goal, "Campaign was successful");
        require(contributions[_campaignId][msg.sender] > 0, "No contribution found");

        uint256 refundAmount = contributions[_campaignId][msg.sender];
        contributions[_campaignId][msg.sender] = 0;

        if (campaign.status == CampaignStatus.Active) {
            campaign.status = CampaignStatus.Expired;
        }

        payable(msg.sender).transfer(refundAmount);

        emit RefundIssued(_campaignId, msg.sender, refundAmount);
    }

    /**
     * @dev Get campaign details
     * @param _campaignId Campaign ID
     */
    function getCampaign(uint256 _campaignId) external view campaignExists(_campaignId) returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    /**
     * @dev Get all campaigns
     */
    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        return allCampaigns;
    }

    /**
     * @dev Get user's contribution to a campaign
     * @param _campaignId Campaign ID
     * @param _contributor Contributor address
     */
    function getContribution(uint256 _campaignId, address _contributor) external view returns (uint256) {
        return contributions[_campaignId][_contributor];
    }

    /**
     * @dev Update platform fee (only owner)
     * @param _newFee New fee in basis points
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
    }
}
