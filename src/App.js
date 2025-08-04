import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Typography } from "@mui/material";

import { TransactionProvider } from "./context/TransactionContext";
import Summary from "./components/Summary";
import TransactionList from "./components/TransactionList";
import InputForm from "./components/InputForm";
import MonthlyReport from "./components/MonthlyReport";

const Home = () => (
  <>
    <Typography variant="h4" gutterBottom align="center">
      🧾 MIS Transaction Tracker
    </Typography>
    <Summary />
    <TransactionList />
    <InputForm />
  </>
);

const App = () => {
  return (
    <TransactionProvider>
      <Router>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<MonthlyReport />} />
          </Routes>
        </Container>
      </Router>
    </TransactionProvider>
  );
};

export default App;

