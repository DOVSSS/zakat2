import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Container,
  Grid,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import EditIcon from "@mui/icons-material/Edit";

export default function App() {
  // Начальная цена золота (можно изменить)
  const [goldPriceGr, setGoldPriceGr] = useState(6000);
  const [nisab, setNisab] = useState(goldPriceGr * 85);
  const [money, setMoney] = useState("");
  const [sheep, setSheep] = useState("");
  const [cows, setCows] = useState("");
  const [result, setResult] = useState({ money: 0, sheep: 0, cows: 0 });
  const [showNisabAlert, setShowNisabAlert] = useState(false);
  const [editGoldPrice, setEditGoldPrice] = useState(false);
  const [tempGoldPrice, setTempGoldPrice] = useState(goldPriceGr);

  // Обновляем нисаб при изменении цены золота
  useEffect(() => {
    setNisab(goldPriceGr * 85);
  }, [goldPriceGr]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setResult({ money: 0, sheep: 0, cows: 0 });
    setShowNisabAlert(false);
  };

  const handleGoldPriceEdit = () => {
    setEditGoldPrice(true);
    setTempGoldPrice(goldPriceGr);
  };

  const handleGoldPriceSave = () => {
    if (tempGoldPrice > 0) {
      setGoldPriceGr(Number(tempGoldPrice));
    }
    setEditGoldPrice(false);
  };

  const handleGoldPriceCancel = () => {
    setEditGoldPrice(false);
    setTempGoldPrice(goldPriceGr);
  };

  const calculateZakat = () => {
    const m = parseFloat(money) || 0;
    const s = parseInt(sheep) || 0;
    const c = parseInt(cows) || 0;

    // Рассчет закята для денег
    const zakatMoney = m >= nisab ? m * 0.025 : 0;
    
    // Рассчет закята для овец
    let zakatSheep = 0;
    if (s >= 40 && s <= 120) zakatSheep = 1;
    else if (s > 120 && s <= 200) zakatSheep = 2;
    else if (s > 200 && s <= 399) zakatSheep = 3;
    else if (s >= 400) zakatSheep = Math.floor(s / 100);

    // Рассчет закята для коров
    let zakatCows = 0;
    if (c >= 30 && c < 40) zakatCows = "1 годовалая";
    else if (c >= 40 && c < 60) zakatCows = "1 двухлетняя";
    else if (c >= 60 && c < 70) zakatCows = "2 годовалых";
    else if (c >= 70 && c < 80) zakatCows = "1 годовалый и 1 двухлетняя";
    else if (c >= 80 && c < 90) zakatCows = "2 двухлетних";
    else if (c >= 90 && c < 100) zakatCows = "3 годовалых";
    else if (c >= 100) {
      const twoYear = Math.floor(c / 40);
      const remainder = c % 40;
      const oneYear = remainder >= 30 ? 1 : 0;
      
      if (twoYear > 0 && oneYear > 0) {
        zakatCows = `${twoYear} двухлетних и ${oneYear} годовалых`;
      } else if (twoYear > 0) {
        zakatCows = `${twoYear} двухлетних`;
      } else if (oneYear > 0) {
        zakatCows = `${oneYear} годовалых`;
      }
    }

    setResult({ 
      money: +zakatMoney.toFixed(2), 
      sheep: zakatSheep, 
      cows: zakatCows || 0 
    });
    setShowNisabAlert(m > 0 && m < nisab);
  };

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
            Калькулятор Заката
          </Typography>

          {/* Блок цены золота */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              bgcolor: "#fff9e6",
              textAlign: "center"
            }}
          >
            <Typography variant="h6" gutterBottom>
              💰 Цена золота для расчета
            </Typography>
            
            {editGoldPrice ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <TextField
                  label="Цена золота (₽/грамм)"
                  type="number"
                  value={tempGoldPrice}
                  onChange={(e) => setTempGoldPrice(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 200 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleGoldPriceSave}
                    size="small"
                  >
                    Сохранить
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleGoldPriceCancel}
                    size="small"
                  >
                    Отмена
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {goldPriceGr.toLocaleString()} ₽/г
                </Typography>
                <Button 
                  startIcon={<EditIcon />}
                  variant="outlined" 
                  size="small"
                  onClick={handleGoldPriceEdit}
                >
                  Изменить цену
                </Button>
              </Box>
            )}
            
            <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
              • Нисаб: <b>{nisab.toLocaleString()} ₽</b>
              <br />
              <small>Нисаб = 85 грамм золота × текущая цена</small>
            </Typography>
          </Paper>

          {showNisabAlert && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Закят не обязателен</AlertTitle>
              Сумма денег ниже нисаба ({nisab.toLocaleString()} ₽)
            </Alert>
          )}

          {/* Поля ввода */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AttachMoneyIcon fontSize="large" color="primary" />
                <TextField
                  label="Деньги (₽)"
                  type="number"
                  value={money}
                  onChange={handleInputChange(setMoney)}
                  fullWidth
                  sx={{ mt: 1 }}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <PetsIcon fontSize="large" color="success" />
                <TextField
                  label="Овцы 40"
                  type="number"
                  value={sheep}
                  onChange={handleInputChange(setSheep)}
                  fullWidth
                  sx={{ mt: 1 }}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AgricultureIcon fontSize="large" color="warning" />
                <TextField
                  label="Коровы 30"
                  type="number"
                  value={cows}
                  onChange={handleInputChange(setCows)}
                  fullWidth
                  sx={{ mt: 1 }}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Результат */}
          <Paper
            elevation={2}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "#f0f4ff",
              minHeight: 120
            }}
          >
            <Typography variant="h6" gutterBottom>💼 Ваш закат:</Typography>
            {result.money > 0 || result.sheep > 0 || result.cows !== 0 ? (
              <>
                {result.money > 0 && (
                  <Typography>💰 Деньги: {result.money.toLocaleString()} ₽</Typography>
                )}
                {result.sheep > 0 && (
                  <Typography>🐑 Овцы: {result.sheep}</Typography>
                )}
                {result.cows !== 0 && (
                  <Typography>🐄 Коровы: {result.cows}</Typography>
                )}
              </>
            ) : (
              <Typography sx={{ color: "#666", fontStyle: "italic" }}>
                Введите значения для расчета
              </Typography>
            )}
          </Paper>

          {/* Кнопка расчета */}
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              size="large"
              onClick={calculateZakat}
              sx={{
                background: "#1976d2",
                ":hover": { background: "#115293" },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1.1rem"
              }}
            >
              Рассчитать закат
            </Button>
          </Box>

          {/* Подсказка */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Как использовать</AlertTitle>
            1. Установите текущую цену золота за грамм<br />
            2. Введите ваши активы в соответствующие поля<br />
            3. Нажмите "Рассчитать закат"
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
}