import { Avatar, Box } from '@mui/material';

const SquareDays = ({ onClick, cantidad, color }) => {
  return (
    <Box onClick={onClick}>
      <Avatar variant="rounded" sx={{ bgcolor: color, cursor: 'pointer' }}>
        {cantidad}
      </Avatar>
    </Box>
  );
};

export default SquareDays;
