// src/consts/abi.js

export const SALE_ADDRESS = "0x20f91eadf33cd3b9f60d35e6880445cca2ccb33d"; // ADD THIS


export const SALE_ABI = [
   "function buyTokens(uint256 _usdcAmount) external",
    "function claimTokens() external",
    "function totalUsdcRaised() view returns (uint256)",
    "function totalEbondsSold() view returns (uint256)", // Added [cite: 14, 62]
    "function minimumPurchaseUSDC() view returns (uint256)",
    "function priceNumerator() view returns (uint256)",
    "function PRICE_DENOMINATOR() view returns (uint256)", // Added [cite: 11]
    "function getCurrentPrice() view returns (uint256 price, uint256 denominator)", // Added [cite: 70]
    "function getClaimableAmount(address user) view returns (uint256)",
    "function getVestingInfo(address user) view returns (uint256 purchased, uint256 claimed, uint256 vested, uint256 claimable, uint256 locked, uint256 vestingStart, uint256 vestingEnd, uint256 progress)",
    "function getBonusPercentage(uint256 usdcAmount) view returns (uint256)",
    "function getBonusTiers() view returns (tuple(uint256 threshold, uint256 bonusPercent)[])", // Added [cite: 99]
    "function getParticipantCount() view returns (uint256)", // Added [cite: 97]
    "function getParticipant(uint256 index) view returns (address)", // Added 
    "function getTotalUnclaimedTokens() view returns (uint256)", // Added [cite: 93-96]
    "function paused() view returns (bool)",
    "function owner() view returns (address)",
    // --- ADMIN / WRITE FUNCTIONS ---
    "function pause() external", // Added [cite: 120]
    "function unpause() external", // Added [cite: 121]
    "function setPrice(uint256 _newPriceNumerator) external", // Added [cite: 107-110]
    "function setMinimumPurchase(uint256 _newMinimum) external", // Added [cite: 106]
    "function addBonusTier(uint256 threshold, uint256 bonusPercent) external", // Added [cite: 111-112]
    "function resetBonusTiers() external", // Added [cite: 113]
    "function withdrawUSDC(uint256 amount) external", // Added [cite: 114-115]
    "function withdrawExcessEbonds(uint256 amount) external", // Added [cite: 116-118]
    "function emergencyWithdraw(address token, uint256 amount) external" // Added [cite: 119]
    
];

export const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];