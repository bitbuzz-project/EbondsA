import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box,
  Typography,
  Chip
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TransactionHistory = ({ account, tokenContractAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenTransfers = async () => {
      if (!account || !tokenContractAddress) return;

      // Use the environment variable, or fallback to a placeholder string if missing
      const apiKey = process.env.REACT_APP_ARBISCAN_KEY; 

      if (!apiKey) {
        console.warn("Arbiscan API Key is missing. Check your .env file.");
        setError("API configuration missing");
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `https://api.arbiscan.io/api?module=account&action=tokentx&address=${account}&contractaddress=${tokenContractAddress}&apikey=${apiKey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "1" && data.result) {
          const formatted = data.result
            .filter(tx => tx.contractAddress.toLowerCase() === tokenContractAddress.toLowerCase())
            .map((tx, index) => ({
              id: `${tx.hash}-${index}`,
              value: ethers.utils.formatEther(tx.value),
              timestamp: new Date(tx.timeStamp * 1000),
              type: tx.from.toLowerCase() === account.toLowerCase() ? "Sent" : "Received",
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

          setTransactions(formatted);
        } else if (data.message === "NOTOK") {
            // Handle API errors gracefully
            console.error("Arbiscan API Error:", data.result);
            setError("Unable to fetch history");
        }
      } catch (error) {
        console.error("History Network Error:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenTransfers();
  }, [account, tokenContractAddress]);

  if (!account) return <Typography color="text.secondary" align="center">Connect wallet to view history</Typography>;
  if (error) return <Typography color="error" align="center" variant="caption">{error}</Typography>;
  if (loading && transactions.length === 0) return <Typography color="text.secondary" align="center">Loading history...</Typography>;
  if (transactions.length === 0) return <Typography color="text.secondary" align="center">No transactions found</Typography>;

  return (
    <TableContainer component={Box}>
      <Table size="small" aria-label="history table">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Chip 
                  icon={tx.type === "Sent" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={tx.type}
                  size="small"
                  color={tx.type === "Sent" ? "default" : "success"}
                  variant="outlined"
                  sx={{ border: 'none', bgcolor: tx.type === "Sent" ? 'transparent' : 'rgba(16, 185, 129, 0.1)' }}
                />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {parseFloat(tx.value).toFixed(2)} EBONDS
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                {tx.timestamp.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionHistory;