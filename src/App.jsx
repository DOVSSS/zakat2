import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";

export default function App() {
  const [goldPriceGr, setGoldPriceGr] = useState(0);
  const [nisab, setNisab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [money, setMoney] = useState("");
  const [sheep, setSheep] = useState("");
  const [cows, setCows] = useState("");
  const [result, setResult] = useState({ money: 0, sheep: 0, cows: 0 });

  useEffect(() => {
    axios
      .get("https://www.goldapi.io/api/XAU/RUB", {
        headers: {
          "x-access-token": "goldapi-4m6f19mbv2jji0-io",
          "Content-Type": "application/json",
        },
      })
  .then((res) => {
        const pricePerOz = res.data.price;
        const grPrice = pricePerOz / 31.1035;
        setGoldPriceGr(grPrice);
        setNisab(grPrice * 85);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка API:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  const calculateZakat = () => {
    const m = parseFloat(money) || 0;
    const s = parseInt(sheep) || 0;
    const c = parseInt(cows) || 0;

    const zakatMoney = m >= nisab ? +(m * 0.025).toFixed(2) : 0;

    let zakatSheep = 0;
    if (s >= 40 && s <= 120) zakatSheep = 1;
    else if (s <= 200) zakatSheep = 2;
    else if (s <= 399) zakatSheep = 3;
    else if (s >= 400) zakatSheep = Math.floor(s / 100);

    let zakatCows = 0;
    if (c >= 30 && c < 40) zakatCows = "1 годовалая";
    else if (c >= 40 && c < 60) zakatCows = "1 двухлетняя";
    else if (c >= 60)
      zakatCows = `${Math.floor(c / 30)} год. и ${Math.floor((c % 30) / 40)} дв.` ;

    setResult({ money: zakatMoney, sheep: zakatSheep, cows: zakatCows });
  };
const isBelowNisab = parseFloat(money || "0") < nisab;

  return (
    <Container maxWidth="sm">
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f5f7fa"
        py={4}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 4,
            background: "#ffffffcc",
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
           
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              <AlertTitle>Ошибка загрузки</AlertTitle>
              Не удалось получить цену золота: {error.message}
            </Alert>
) : (
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: "#333", fontWeight: 500 }}
              gutterBottom
            >
              🟡 Дешийн мах: <b>{goldPriceGr.toFixed(2)} ₽/г</b> • Нисаб:{" "}
              <b>{nisab.toFixed(2)} ₽</b>
            </Typography>
          )}

          {!loading && isBelowNisab && money && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Таьрго е</AlertTitle>
              Закат т1аь дац
            </Alert>
          )}

          <Grid container spacing={3} mt={1} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AttachMoneyIcon fontSize="large" color="primary" />
                <TextField
                  label="Ахч (₽)"
                  type="number"
                  value={money}
                  onChange={(e) => setMoney(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
</Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <PetsIcon fontSize="large" color="success" />
                <TextField
                  label="Устаг1"
                  type="number"
                  value={sheep}
                  onChange={(e) => setSheep(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AgricultureIcon fontSize="large" color="warning" />
                <TextField
                  label="Бежан"
                  type="number"
                  value={cows}
                  onChange={(e) => setCows(e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Paper
            elevation={2}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "#f0f4ff",
            }}
          >
 <Typography variant="h6">💼 Хьан закат:</Typography>
            <Typography>💰 Ахч: {result.money} ₽</Typography>
            <Typography>🐑 Уьстаг1: {result.sheep}</Typography>
            <Typography>🐄 Бежан: {result.cows}</Typography>
          </Paper>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={calculateZakat}
              disabled={loading || error}
              sx={{
                background: "#1976d2",
                ":hover": { background: "#115293" },
                borderRadius: 3,
                px: 4,
              }}
            >
              Лара
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}