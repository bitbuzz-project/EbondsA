import React, { useState } from 'react';
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
    Tabs,
    Tab
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

const otcTiers = [
    { alloc: 200000, bonus: 22, profit: 53873, roiPct: 26.9 },
    { alloc: 300000, bonus: 24, profit: 86052, roiPct: 29.0 },
    { alloc: 400000, bonus: 26, profit: 124393, roiPct: 31.1 },
    { alloc: 500000, bonus: 28, profit: 165896, roiPct: 33.2 },
    { alloc: 600000, bonus: 30, profit: 211561, roiPct: 35.3 },
];

const TierTable = ({ onSelect }) => {
    const [activeTab, setActiveTab] = useState(0);

    const headerStyle = {
        bgcolor: 'rgba(255,255,255,0.02)', 
        color: 'text.secondary', 
        fontWeight: 600,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        py: 1.5
    };

    const cellStyle = {
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        color: 'white', 
        fontWeight: 500, 
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.9rem'
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* TERMINAL TAB SYSTEM */}
            <Tabs 
                value={activeTab} 
                onChange={(e, v) => setActiveTab(v)}
                sx={{ 
                    mb: 2,
                    minHeight: '40px',
                    '& .MuiTab-root': { 
                        color: 'text.secondary', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        minHeight: '40px',
                        letterSpacing: '0.05em'
                    },
                    '& .Mui-selected': { color: '#d29d5c !important' },
                    '& .MuiTabs-indicator': { bgcolor: '#d29d5c' }
                }}
            >
                <Tab icon={<AutoGraphIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Standard Tiers" />
                <Tab icon={<StarsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="OTC Institutional" />
            </Tabs>

            <TableContainer component={Paper} sx={{ 
                bgcolor: 'rgba(10, 16, 25, 0.4)', 
                backgroundImage: 'none',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                maxHeight: '480px',
                overflowY: 'auto'
            }}>
                {activeTab === 0 && (
                    <Box>
                        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AutoGraphIcon sx={{ color: '#d29d5c', fontSize: 18 }} />
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#d29d5c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Allocation Bonus Tiers - ROI AT TARGET BUYBACK
                            </Typography>
                        </Box>
                        <Table size="small" stickyHeader>
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
                                                bgcolor: 'rgba(210, 157, 92, 0.08)',
                                                '& td': { color: '#d29d5c' }
                                            }
                                        }}
                                    >
                                        <TableCell sx={cellStyle}>${row.alloc.toLocaleString()}</TableCell>
                                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Typography variant="caption" sx={{ color: '#d29d5c', fontWeight: 800, bgcolor: 'rgba(210, 157, 92, 0.15)', px: 1, py: 0.5, borderRadius: 0.5 }}>
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
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box>
                         <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarsIcon sx={{ color: '#d29d5c', fontSize: 18 }} />
                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#d29d5c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Extraordinary OTC Bonus Tiers - ROI AT TARGET BUYBACK
                            </Typography>
                        </Box>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="caption" color="text.secondary">
                                If Cumulative Allocation are reached we send remaining Bonus after vesting completed.
                            </Typography>
                        </Box>
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
                                    <TableRow key={index} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell sx={cellStyle}>${row.alloc.toLocaleString()}</TableCell>
                                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Typography variant="caption" sx={{ color: '#d29d5c', fontWeight: 800, bgcolor: 'rgba(210, 157, 92, 0.1)', px: 1, py: 0.5, borderRadius: 0.5 }}>
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
                    </Box>
                )}
            </TableContainer>
        </Box>
    );
};

export default TierTable;