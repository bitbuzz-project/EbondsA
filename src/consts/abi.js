// src/consts/abi.js

export const SALE_ABI = [
    "function buyTokens(uint256 _usdcAmount) external",
    "function claimTokens() external",
    "function totalUsdcRaised() view returns (uint256)",
    "function minimumPurchaseUSDC() view returns (uint256)",
    "function priceNumerator() view returns (uint256)",
    "function getClaimableAmount(address user) view returns (uint256)",
    "function vestingSchedules(address) view returns (uint256 totalPurchased, uint256 totalClaimed, uint256 vestingStartTime, uint256 vestingEndTime, uint256 lastPurchaseTime)",
    "function getVestingInfo(address user) view returns (uint256 purchased, uint256 claimed, uint256 vested, uint256 claimable, uint256 locked, uint256 vestingStart, uint256 vestingEnd, uint256 progress)",
    "function getBonusPercentage(uint256 usdcAmount) view returns (uint256)"
];

export const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];