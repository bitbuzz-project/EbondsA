import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Typography
} from '@mui/material';

const SalesTable = () => {
    // Mock Data for past EBONDS rounds
    const history = [
        { id: 1, round: 'Seed Round', date: 'Jan 2024', price: 0.02, raised: 250000, status: 'Completed' },
        { id: 2, round: 'Private A', date: 'Mar 2024', price: 0.035, raised: 500000, status: 'Completed' },
        { id: 3, round: 'Community Early', date: 'May 2024', price: 0.045, raised: 1000000, status: 'Sold Out' },
    ];

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                    <TableRow>
                        <TableCell>Round Name</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Sale Price</TableCell>
                        <TableCell align="right">Total Raised</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={700}>{row.round}</Typography>
                            </TableCell>
                            <TableCell align="right" color="text.secondary">{row.date}</TableCell>
                            <TableCell align="right">${row.price}</TableCell>
                            <TableCell align="right">${row.raised.toLocaleString()}</TableCell>
                            <TableCell align="right">
                                <Chip label={row.status} size="small" color={row.status === 'Completed' ? 'default' : 'success'} variant="outlined" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SalesTable;