
import React, { useEffect,useState, useContext, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Autocomplete
} from "@mui/material";
import { Link } from "react-router-dom";
import "../App.css"; // 
const fields = ["brand", "price", "cost", "quantity", "customer"]; 
const InputForm = () => {
  const { state, dispatch } = useContext(TransactionContext);
  const[data,setData]=useState([])
  const[brands,setBrands]=useState([])
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [form, setForm] = useState({
    brand: "",
    price: "",
    cost: "",
    quantity: "",
    customer: "",
    newcustomer:""
  });
  const inputRefs = useRef([]);
useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("/.netlify/functions/customer");
       const { customers, brands } = await res.json(); 
        setData(customers)
        console.log(brands)
        setBrands(brands)
  
      } catch (err) {
        alert("❌ Failed to fetch report.");
      }
    };

    fetchdata();
  }, [setData]);
console.log(data)
/*const allnames = data.map(name => name?.customer || "Unknown");
  const uniquenames = [...new Set(allnames.map(item => item.trim().toLowerCase()))].map(item => 
  item.charAt(0).toUpperCase() + item.slice(1))
console.log(uniquenames)
 const newBrands = data.flatMap((entry)=> entry.items.map(item => item.brand));
 // const uniqueBrands = [...new Set(newBrands)];
  const uniqueBrands= [...new Set(newBrands.map(item => item.trim().toLowerCase()))].map(item => 
  item.charAt(0).toUpperCase() + item.slice(1)
);
console.log(uniqueBrands)*/
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const { brand, price, cost, quantity, customer} = form;
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

    // Move focus back to first input after add
  };
  const handleFinalize = async () => {
    if (state.transactions.length === 0) {
      alert("🚫 No transactions to finalize.");
      return;
    }
const grouped = state.transactions.reduce((acc, tx) => {
    if (!acc[tx.customer]) acc[tx.customer] = [];
    acc[tx.customer].push(tx);
    return acc;
  }, {});
    //const customer = state.transactions[0].customer || "Unknown";
  try { 
    for (const customer in grouped) {
      const items = grouped[customer].map(({ brand, price, cost, quantity }) => ({
        brand,
        price,
        cost,
        quantity,
      }));
    
    const finalPayload = {
      customer,
      items,
      date: new Date().toISOString().split("T")[0]
    };

      const response = await fetch("/.netlify/functions/postsale", {
        method: "POST",
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        alert(`❌ Failed to save transactions for ${customer}.`);
        dispatch({ type: "CLEAR_TRANSACTIONS" });
      } }
    alert("✅ All customer transactions saved!");
    dispatch({ type: "CLEAR_TRANSACTIONS" });
    } catch (error) {
      console.error("❌ Netlify Function Error:", error);
      alert("❌ Error connecting to database.");
    }
  }
return (
  <Paper
    elevation={6}
    sx={{
      p: 3,
      mt: 4,
      backgroundColor: "#ebedf5ff",
      borderRadius: 3,
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
      💼 Add New Transaction
    </Typography>

    <Grid container spacing={2}>
      {fields.map((field, index) => {
        const isAutoCompleteField = field === "customer" || field === "brand";
        const options =
          field === "customer"
            ? data
            : field === "brand"
            ? brands
            : [];

        return (
          <Grid item xs={12} sm={6} md={6} key={field}sx={{ alignItems: "flex-start", display: "flex" }}   >
            
            {isAutoCompleteField ? (
              <Autocomplete
               variant="outlined"
                 fullWidth
                size="small"
                freeSolo
                options={options}
                value={form[field] || ""}
                onChange={(e, newValue) => {
                  setForm((prev) => ({ ...prev, [field]: newValue }));
                }}
           onInputChange={(e, newValue) => {
            setForm((prev) => ({ ...prev, [field]: newValue }));
  }}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={(el) => {
      inputRefs.current[index] = el;
    }}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    size="small"
          
     
                        sx={{
            "& .MuiInputBase-root": {
              height: 40, // match price/cost/quantity
            },
          }}

                  />
 
                  

                )}
       
             
                
              />
           
           
            )
          : (
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={form[field]}
                onFocus={() => setFocusedIndex(index)}
                inputRef={(el) => (inputRefs.current[index] = el)}
                onChange={handleChange}
                type={
                  ["price", "cost", "quantity"].includes(field)
                    ? "number"
                    : "text"
                }
                size="small"
                variant="outlined"
                color="secondary"
              />
            )}
          </Grid>
        );
      })}

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => {
            const nextIndex =
              focusedIndex < fields.length - 1 ? focusedIndex + 1 : 0;
            inputRefs.current[nextIndex]?.focus();
            setFocusedIndex(nextIndex);
          }}
          sx={{ height: "100%" }}
        >
          ➡️ Next
        </Button>
      </Grid>

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
}
export default InputForm

/*import React, { useState, useContext } from "react";
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

const fields = ["brand", "price", "cost", "quantity", "customer"];

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

  // Create refs for each field
  
  
 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        {fields.map((field) => (
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