import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TransactionList = () => {
  const { state, dispatch } = useContext(TransactionContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true if screen < 600px

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        🧾 Transaction List
      </Typography>

      {state.transactions.length === 0 ? (
        <Typography variant="body1">No transactions added yet.</Typography>
      ) : (
        state.transactions.map((tx, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />}
              flexWrap="wrap"
            >
              <Typography><strong>Brand:</strong> {tx.brand}</Typography>
              <Typography><strong>Price:</strong> Rs. {tx.price}</Typography>
              <Typography><strong>Cost:</strong> Rs. {tx.cost}</Typography>
              <Typography><strong>Qty:</strong> {tx.quantity}</Typography>
              <Typography><strong>Customer:</strong> {tx.customer}</Typography>
              <IconButton
                edge="end"
                color="error"
                onClick={() => dispatch({ type: "REMOVE_TRANSACTION", payload: index })}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default TransactionList;


