import React from 'react';
import { Box, Typography, Stack, Step, Stepper, StepLabel, StepConnector, stepConnectorClasses, styled } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import TimerIcon from '@mui/icons-material/Timer';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundImage: 'linear-gradient( 95deg, #d29d5c 0%, #e3b578 50%, #ffffff 100%)' },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { backgroundImage: 'linear-gradient( 95deg, #d29d5c 0%, #d29d5c 100%)' },
  },
  [`& .${stepConnectorClasses.line}`]: { height: 3, border: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 },
}));

const ColorlibStepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundColor: 'rgba(255,255,255,0.05)',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid rgba(255,255,255,0.1)',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, #d29d5c 0%, #e3b578 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    borderColor: '#d29d5c',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = {
    1: <TimelineIcon />,
    2: <TimerIcon />,
    3: <ShutterSpeedIcon />,
  };
  return (
    <ColorlibStepIconRoot ownerState={{ active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

const VestingTimeline = () => {
  const steps = [
    { label: 'Allocation', desc: 'Instant Confirmation' },
    { label: 'Linear Unlock', desc: 'Per-Second Streaming' },
    { label: 'Full Liquidity', desc: 'Day 90 Completion' }
  ];

  return (
    <Box sx={{ width: '100%', p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, mb: 3, display: 'block', letterSpacing: '0.1em' }}>
        SYSTEMATIC VESTING SCHEDULE
      </Typography>
      
      <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Typography variant="body2" fontWeight={700} sx={{ color: 'white', mt: 1 }}>{step.label}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{step.desc}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(210, 157, 92, 0.05)', borderRadius: 1, borderLeft: '3px solid #d29d5c' }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
          <strong>Streaming Protocol:</strong> Your EBONDS are not "cliffed." They unlock continuously every second for 90 days, allowing you to claim accumulated tokens at any moment.
        </Typography>
      </Box>
    </Box>
  );
};

export default VestingTimeline;