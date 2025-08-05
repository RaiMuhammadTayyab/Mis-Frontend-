import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyReport = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/.netlify/functions/getsale");
        const data = await res.json();
        processData(data);
      } catch (err) {
        alert("❌ Failed to fetch report.");
      }
    };

    fetchReport();
  }, []);
const processData = (data) => {
  const grouped = {};

  data.forEach((sale) => {
    const dateOnly = new Date(sale.date).toISOString().split("T")[0];

    // Initialize the date group if it doesn't exist
    if (!grouped[dateOnly]) {
      grouped[dateOnly] = { profit: 0, items: 0 };
    }

    // Make sure `items` exists and is an array
    if (Array.isArray(sale.items)) {
      const totalProfit = sale.items.reduce((sum, item) => {
        const price = Number(item.price ?? 0);
        const cost = Number(item.cost ?? 0);
        const qty = Number(item.quantity ?? 0);
        return sum + (price - cost) * qty;
      }, 0);

      const totalItems = sale.items.reduce((sum, item) => {
        return sum + Number(item.quantity ?? 0);
      }, 0);

      grouped[dateOnly].profit += totalProfit;
      grouped[dateOnly].items += totalItems;
    }
  });

  // Convert grouped object into array
  const result = Object.entries(grouped).map(([date, values]) => ({
    date,
    ...values,
  }));
console.log("Processed summary data:", result);
  setSummaryData(result); // For chart and list
};

  
  
  
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleBack = () => navigate("/");

  const filteredData = selectedDate
    ? summaryData.filter((entry) => entry.date === selectedDate)
    : summaryData;

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
      <Paper elevation={4} sx={{ p: 3, backgroundColor: "#f3f4f6", mb: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          📊 Daily Sales Summary
        </Typography>

        <FormControl fullWidth sx={{ maxWidth: 300, mt: 2 }}>
          <InputLabel>Select a Date</InputLabel>
          <Select
            value={selectedDate}
            label="Select a Date"
            onChange={handleDateChange}
            size={isMobile ? "small" : "medium"}
          >
            <MenuItem value="">All Dates</MenuItem>
            {summaryData.map((entry) => (
              <MenuItem key={entry.date} value={entry.date}>
                {entry.date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, backgroundColor: "#ffffff" }}>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, mb: 2 }}
        >
          {selectedDate
            ? `📅 Summary for ${selectedDate}`
            : "📅 All Dates – Summary View"}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#4caf50" name="Profit" />
            <Bar dataKey="items" fill="#1976d2" name="Items Sold" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Box textAlign="center" mt={4}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          ⬅️ Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default MonthlyReport;






/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyReport = () => {
  const [report, setReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
console.log(report)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Fetch the monthly report from Netlify Function
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/.netlify/functions/getsale");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        alert("❌ Failed to fetch report.");
      }
    };

    fetchReport();
  }, []);

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleBack = () => navigate("/");

  const dateOptions = report.map((entry) => entry.date);
  const selectedEntry = report.find((entry) => entry.date === selectedDate);
  const summaryData = report.map((entry) => {
    const times = Array.isArray(entry.times) ? entry.times : [];
    const totalProfit = times.reduce((sum, t) => sum + t.profit, 0);
    const totalItems = times.reduce((sum, t) => sum + t.items, 0);
    return { date: entry.date, profit: totalProfit, items: totalItems };
  });

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
      <Paper elevation={4} sx={{ p: 3, backgroundColor: "#f3f4f6", mb: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          📊 Monthly Sales Report
        </Typography>

        <FormControl fullWidth sx={{ maxWidth: 300, mt: 2 }}>
          <InputLabel>Select a Date</InputLabel>
          <Select
            value={selectedDate}
            label="Select a Date"
            onChange={handleDateChange}
            size={isMobile ? "small" : "medium"}
          >
            <MenuItem value="">All Dates</MenuItem>
            {dateOptions.map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, backgroundColor: "#ffffff" }}>
        {selectedDate && selectedEntry ? (
          <>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, mb: 2 }}
            >
              📅 {selectedEntry.date} – Time-wise Report
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedEntry.times}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#4caf50" name="Profit" />
                <Bar dataKey="items" fill="#1976d2" name="Items Sold" />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, mb: 2 }}
            >
              📅 All Dates – Summary View
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#4caf50" name="Profit" />
                <Bar dataKey="items" fill="#1976d2" name="Items Sold" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </Paper>

      <Box textAlign="center" mt={4}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          ⬅️ Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default MonthlyReport;
*/











/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyReport = () => {
  const [report, setReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sales/monthly-report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        alert("❌ Failed to fetch report.");
      }
    };

    fetchReport();
  }, []);
const navigate = useNavigate();
const handleBack = () => {
  navigate("/"); // or "/Home" or `/Home/${collectionName}` if dynamic
};
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  // Prepare dropdown options
  const dateOptions = report.map((entry) => entry.date);

  // Find selected entry for time-wise view
  const selectedEntry = report.find((entry) => entry.date === selectedDate);

  // Aggregate daily summary
  const summaryData = report.map((entry) => {
    const totalProfit = entry.times.reduce((sum, t) => sum + t.profit, 0);
    const totalItems = entry.times.reduce((sum, t) => sum + t.items, 0);
    return { date: entry.date, profit: totalProfit, items: totalItems };
  });

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: "1.3rem", sm: "1.8rem" }, textAlign: "center" }}
      >
        📊 Monthly Report
      </Typography>

      <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
        <InputLabel>Select a Date</InputLabel>
        <Select
          value={selectedDate}
          label="Select a Date"
          onChange={handleDateChange}
          size={isMobile ? "small" : "medium"}
        >
          <MenuItem value="">All Dates</MenuItem>
          {dateOptions.map((date) => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedDate && selectedEntry ? (
        <>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" }, mb: 1 }}
          >
            📅 {selectedEntry.date} – Time-wise
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedEntry.times}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
              <Bar dataKey="items" fill="#8884d8" name="Items Sold" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" }, mb: 1 }}
          >
            📅 All Dates – Summary
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
              <Bar dataKey="items" fill="#8884d8" name="Items Sold" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
  ⬅️ Back to Home
</Button>
    </Box>
  );
};

export default MonthlyReport;


*/