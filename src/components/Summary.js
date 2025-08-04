import { Paper, Typography, Grid } from '@mui/material';
import { useTransaction } from '../context/TransactionContext';

const Summary = () => {
  const { state } = useTransaction();
  const { transactions } = state;

  const totalPrice = transactions.reduce((sum, t) => sum + t.price * t.quantity, 0);
  const totalCost = transactions.reduce((sum, t) => sum + t.cost * t.quantity, 0);
  const profit = totalPrice - totalCost;
  const totalItems = transactions.reduce((sum, t) => sum + t.quantity, 0);

  const summaryData = [
    { label: 'Total Price', value: totalPrice, bgColor: '#e3f2fd' },   // Light Blue
    { label: 'Total Cost', value: totalCost, bgColor: '#fff3e0' },     // Light Orange
    { label: 'Profit', value: profit, bgColor: '#e8f5e9' },            // Light Green
    { label: 'Items Sold', value: totalItems, bgColor: '#f3e5f5' }     // Light Purple
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 4,
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      {summaryData.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: item.bgColor,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontWeight: 'bold',
                color: 'text.primary',
                fontSize: { xs: '1.1rem', sm: '1.4rem' },
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Summary;


