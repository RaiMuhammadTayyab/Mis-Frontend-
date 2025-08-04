import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

const InputForm = () => {
  const { state, dispatch } = useContext(TransactionContext);
  const [form, setForm] = useState({
    brand: "",
    price: "",
    cost: "",
    quantity: "",
    customer: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    const { brand, price, cost, quantity, customer } = form;
    if (!brand || !price || !cost || !quantity || !customer) return;

    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        brand,
        price: +price,
        cost: +cost,
        quantity: +quantity,
        customer,
      },
    });

    setForm({
      brand: "",
      price: "",
      cost: "",
      quantity: "",
      customer: "",
    });
  };

  const handleFinalize = async () => {
    if (state.transactions.length === 0) {
      alert("🚫 No transactions to finalize.");
      return;
    }

    const customer = state.transactions[0].customer || "Unknown";
    const finalPayload = {
      customer,
      items: state.transactions.map(({ brand, price, cost, quantity }) => ({
        brand,
        price,
        cost,
        quantity,
      })),
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch("/.netlify/functions/postsale", {
        method: "POST",
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        alert("✅ Transactions saved to database!");
        dispatch({ type: "CLEAR_TRANSACTIONS" });
      } else {
        alert("❌ Failed to save transactions.");
      }
    } catch (error) {
      console.error("❌ Netlify Function Error:", error);
      alert("❌ Error connecting to database.");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        mt: 4,
        backgroundColor: "#f0f4ff",
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        💼 Add New Transaction
      </Typography>

      <Grid container spacing={2}>
        {["brand", "price", "cost", "quantity", "customer"].map((field) => (
          <Grid item xs={12} sm={6} md={2.4} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              type={["price", "cost", "quantity"].includes(field) ? "number" : "text"}
              size="small"
              variant="outlined"
              color="secondary"
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAdd}
            sx={{ height: "100%", backgroundColor: "#1976d2" }}
           
          >
            ➕ Add
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={handleFinalize}
            sx={{ height: "100%" }}
             size={isMobile ? "small" : "medium"}
          >
            ✅ Finalize All
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            component={Link}
            to="/report"
            variant="contained"
            color="secondary"
            sx={{ height: "100%" }}
          >
            📊 Monthly Summary
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InputForm;




/*import { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { TextField, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const InputForm = () => {
  const { state, dispatch } = useContext(TransactionContext);
  const [form, setForm] = useState({
    brand: "", price: "", cost: "", quantity: "", customer: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.brand || !form.price || !form.cost || !form.quantity || !form.customer) return;
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        ...form,
        price: +form.price,
        cost: +form.cost,
        quantity: +form.quantity,
      },
    });
    setForm({ brand: "", price: "", cost: "", quantity: "", customer: "" });
  };

  const handleFinalize = async () => {
    if (state.transactions.length === 0) {
      alert("No transactions to finalize.");
      return;
    }

    const customer = state.transactions[0].customer || "Unknown";
    const finalPayload = {
      customer,
      items: state.transactions.map(({ brand, price, cost, quantity }) => ({
        brand,
        price,
        cost,
        quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        alert("✅ Transactions saved successfully!");
        dispatch({ type: "CLEAR_TRANSACTIONS" });
      } else {
        const errorData = await response.json();
        alert("❌ Error saving transactions: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Network error while saving transactions.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Grid container spacing={2}>
        {["brand", "price", "cost", "quantity", "customer"].map((field) => (
          <Grid item xs={12} sm={6} md={2.4} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              type={["price", "cost", "quantity"].includes(field) ? "number" : "text"}
              size="small"
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="contained" onClick={handleAdd} sx={{ height: "100%" }}>
            ➕ Add Transaction
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={handleFinalize}
            sx={{ height: "100%" }}
          >
            ✅ Finalize All
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            component={Link}
            to="/report"
            variant="contained"
            color="secondary"
            sx={{ height: "100%" }}
          >
            📊 Monthly Summary
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InputForm;

*/