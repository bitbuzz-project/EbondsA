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
    Typography,
    Chip
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const tiers = [
    { tier: 1, alloc: 2000, bonus: 3, roi: 143, roiPct: 7.1 },
    { tier: 2, alloc: 5000, bonus: 6, roi: 514, roiPct: 10.3 },
    { tier: 3, alloc: 10000, bonus: 8, roi: 1237, roiPct: 12.4 },
    { tier: 4, alloc: 20000, bonus: 10, roi: 2890, roiPct: 14.5 },
    { tier: 5, alloc: 40000, bonus: 12, roi: 6612, roiPct: 16.5 },
    { tier: 6, alloc: 80000, bonus: 16, roi: 16554, roiPct: 20.7 },
    { tier: 7, alloc: 160000, bonus: 20, roi: 39768, roiPct: 24.9 },
    { tier: 8, alloc: 280000, bonus: 24, roi: 81248, roiPct: 29.0 },
    { tier: 9, alloc: 400000, bonus: 30, roi: 141040, roiPct: 35.3 },
];

const TierTable = ({ onSelect }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoGraphIcon sx={{ color: '#d29d5c', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#d29d5c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    ALLOCATION BONUS TIERS - ROI AT TARGET BUYBACK
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ 
                bgcolor: 'transparent', // Fully transparent
                backgroundImage: 'none',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0, // Sharp corners
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['Investment', 'Bonus', 'Net Profit', 'ROI'].map((head, i) => (
                                <TableCell key={head} align={i === 0 ? 'left' : 'right'} sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    color: 'text.secondary', 
                                    fontWeight: 600,
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    textTransform: 'uppercase',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.1em',
                                    py: 2
                                }}>
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
                                <TableCell sx={{ 
                                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                                    color: 'white', 
                                    fontWeight: 500, 
                                    fontFamily: '"Space Grotesk", sans-serif',
                                    fontSize: '0.95rem'
                                }}>
                                    ${row.alloc.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {row.bonus > 0 ? (
                                        <Typography variant="caption" sx={{ color: '#d29d5c', fontWeight: 700, bgcolor: 'rgba(210, 157, 92, 0.1)', px: 1, py: 0.5, borderRadius: 0.5 }}>
                                            +{row.bonus}%
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">-</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                                    color: '#d29d5c', 
                                    fontWeight: 400, 
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem' 
                                }}>
                                    ${row.roi.toLocaleString()}
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                                    color: 'text.secondary', 
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem' 
                                }}>
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