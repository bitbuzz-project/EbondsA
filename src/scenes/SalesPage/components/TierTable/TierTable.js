import React from 'react';
import { 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import StarsIcon from '@mui/icons-material/Stars';

const tiers = [
    { tier: 1, alloc: 2000, bonus: 4, roi: 164, roiPct: 8.2 },
    { tier: 2, alloc: 5000, bonus: 6, roi: 514, roiPct: 10.3 },
    { tier: 3, alloc: 10000, bonus: 8, roi: 1237, roiPct: 12.4 },
    { tier: 4, alloc: 20000, bonus: 10, roi: 2890, roiPct: 14.5 },
    { tier: 5, alloc: 40000, bonus: 12, roi: 6613, roiPct: 16.5 },
    { tier: 6, alloc: 60000, bonus: 14, roi: 11168, roiPct: 18.6 },
    { tier: 7, alloc: 80000, bonus: 16, roi: 16555, roiPct: 20.7 },
    { tier: 8, alloc: 100000, bonus: 20, roi: 24855, roiPct: 24.9 },
];

// Data for the static OTC table (Top Table)
const otcTiers = [
    { alloc: 200000, bonus: 22, profit: 53873, roiPct: 26.9 },
    { alloc: 300000, bonus: 24, profit: 86052, roiPct: 29.0 },
    { alloc: 400000, bonus: 26, profit: 124393, roiPct: 31.1 },
    { alloc: 500000, bonus: 28, profit: 165896, roiPct: 33.2 },
    { alloc: 600000, bonus: 30, profit: 211561, roiPct: 35.3 },
];

const TierTable = ({ onSelect }) => {
    // Shared table header style
    const headerStyle = {
        bgcolor: 'rgba(255,255,255,0.02)', 
        color: 'text.secondary', 
        fontWeight: 600,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        py: 2
    };

    // Shared cell style
    const cellStyle = {
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        color: 'white', 
        fontWeight: 500, 
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.95rem'
    };

    return (
        <Box sx={{ mb: 6 }}>
            {/* --- TOP TABLE: SPECIAL CUMULATIVE OTC BONUSES --- */}
            
            {/* --- BOTTOM TABLE: ALLOCATION BONUS TIERS (DYNAMIC) --- */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoGraphIcon sx={{ color: '#d29d5c', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#d29d5c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Allocation Bonus Tiers - ROI AT TARGET BUYBACK
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ 
                bgcolor: 'transparent', 
                backgroundImage: 'none',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0, 
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['Investment', 'Bonus', 'Net Profit', 'ROI'].map((head, i) => (
                                <TableCell key={head} align={i === 0 ? 'left' : 'right'} sx={headerStyle}>
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tiers.map((row) => (
                            <TableRow 
                                key={row.tier}
                                onClick={() => onSelect(row.alloc)}
                                sx={{ 
                                    cursor: 'pointer',
                                    transition: 'all 0.1s',
                                    '&:hover': { 
                                        bgcolor: 'rgba(210, 157, 92, 0.05)',
                                        '& td': { color: '#d29d5c' }
                                    }
                                }}
                            >
                                <TableCell sx={cellStyle}>${row.alloc.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Typography variant="caption" sx={{ color: '#d29d5c', fontWeight: 700, bgcolor: 'rgba(210, 157, 92, 0.1)', px: 1, py: 0.5, borderRadius: 0.5 }}>
                                        +{row.bonus}%
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ ...cellStyle, color: '#d29d5c', fontFamily: 'monospace' }}>
                                    ${row.roi.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ ...cellStyle, color: 'text.secondary', fontFamily: 'monospace' }}>
                                    {row.roiPct}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarsIcon sx={{ color: '#d29d5c', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#d29d5c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Extraordinary OTC  Bonus Tiers
                </Typography>
            </Box>
                                        <Typography variant="h7" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>If Cumulative Allocation are reached we send remaining Bonus after vesting completed.</Typography>

            <TableContainer component={Paper} sx={{ 
                bgcolor: 'transparent', 
                backgroundImage: 'none',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0,
                mb: 6 // Margin bottom to separate from the dynamic table
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['OTC Allocation', 'Bonus', 'Net Profit', 'ROI'].map((head, i) => (
                                <TableCell key={head} align={i === 0 ? 'left' : 'right'} sx={headerStyle}>
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {otcTiers.map((row, index) => (
                            <TableRow key={index} sx={{ transition: 'all 0.1s', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                <TableCell sx={cellStyle}>${row.alloc.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Typography variant="caption" sx={{ color: '#d29d5c', fontWeight: 700, bgcolor: 'rgba(210, 157, 92, 0.1)', px: 1, py: 0.5, borderRadius: 0.5 }}>
                                        +{row.bonus}%
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ ...cellStyle, color: '#d29d5c', fontFamily: 'monospace' }}>
                                    ${row.profit.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ ...cellStyle, color: 'text.secondary', fontFamily: 'monospace' }}>
                                    {row.roiPct}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
};

export default TierTable;