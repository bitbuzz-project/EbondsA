import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import InfoPanel from './components/InfoPanel/InfoPanel';
import PresaleCard from './components/Presale/PresaleCard';
import SalesTable from './components/Table/Table';

const SalesPage = () => {
    const [info] = useState([
        {
            title: 'Bonus & Vesting',
            text: 'Participants in this special round receive a % bonus in tokens, vested linearly to ensure long-term stability.'
        },
        {
            title: 'Community First',
            text: 'This round is exclusively for the EBONDS community, offering a lower entry price before public listing.'
        },
        {
            title: 'Instant Allocation',
            text: 'No lottery or whitelisting required. Allocations are guaranteed on a first-come, first-served basis.'
        }
    ]);
    
    return (
        <Box sx={{ pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                        EBONDS Token Sale
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Participate in the exclusive community round.
                    </Typography>
                </Box>

                {/* ACTIVE SALE SECTION */}
                <Box sx={{ mb: 8 }}>
                    <PresaleCard />
                </Box>

                {/* Info Cards */}
                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {info.map((el) => (
                        <Grid item xs={12} md={4} key={el.title}>
                            <InfoPanel content={el} />
                        </Grid>
                    ))}
                </Grid>
                
                <Divider sx={{ my: 6 }}>
                    <Typography variant="caption" color="text.secondary">HISTORY</Typography>
                </Divider>

                {/* Past Rounds */}
                <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                        Previous Rounds
                    </Typography>
                    <SalesTable /> 
                </Box>
                
            </Container>
        </Box>
    );
}

export default SalesPage;