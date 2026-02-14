// src/consts/abi.js

export const SALE_ADDRESS = "0x8e7B98F0eAC02dB3977fC4c4A79D3E1850c299fA";

export const SALE_ABI = [
    // --- CORE FUNCTIONS ---
    "function buyTokens(uint256 _usdcAmount) external",
    "function claimTokens() external",
    
    // --- VIEW FUNCTIONS ---
    "function totalUsdcRaised() view returns (uint256)",
    "function totalEbondsSold() view returns (uint256)",
    "function totalUnclaimedObligations() view returns (uint256)",
    "function minimumPurchaseUSDC() view returns (uint256)",
    "function priceNumerator() view returns (uint256)",
    "function PRICE_DENOMINATOR() view returns (uint256)",
    "function HARDCAP_USDC() view returns (uint256)",
    "function VESTING_PERIOD() view returns (uint256)",
    "function getClaimableAmount(address user) view returns (uint256)",
    "function getBonusPercentage(uint256 amount) view returns (uint256)",
    "function getTotalUnclaimedTokens() view returns (uint256)",
    "function paused() view returns (bool)",
    "function owner() view returns (address)",
    
    // Updated getVestingInfo: Matches v4 Solidity (7 return values)
    "function getVestingInfo(address user) view returns (uint256 claimableAmount, uint256 vestingAmount, uint256 vestedFromSchedule, uint256 totalClaimable, uint256 totalClaimed, uint256 vestingStartTime, uint256 vestingEndTime)",
    
    "function getQuote(uint256 usdcAmount) view returns (uint256 baseTokens, uint256 bonusTokens, uint256 totalTokens, uint256 bonusPercent)",
    "function canPurchase(uint256 usdcAmount) view returns (bool success, string memory message)",
    
    // --- PARTICIPANT TRACKING ---
    "function getParticipantCount() view returns (uint256)",
    "function getParticipant(uint256 index) view returns (address)",
    "function getParticipants(uint256 startIndex, uint256 count) view returns (address[])",
    "function getBonusTiers() view returns (tuple(uint256 threshold, uint256 bonusPercent)[])",

    // --- ADMIN FUNCTIONS ---
    "function pause() external",
    "function unpause() external",
    "function setPrice(uint256 _newPriceNumerator) external",
    "function setMinimumPurchase(uint256 _newMinimum) external",
    "function addBonusTier(uint256 threshold, uint256 bonusPercent) external",
    "function resetBonusTiers() external",
    "function withdrawUSDC(uint256 amount) external",
    "function withdrawExcessEbonds(uint256 amount) external",
    "function emergencyWithdraw(address token, uint256 amount) external"
];

export const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];