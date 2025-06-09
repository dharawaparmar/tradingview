
let wallet = 100000;
let trades = [];
let widget;
let currentPrice = 0;

function loadChart() {
  const symbol = document.getElementById("symbol").value.toUpperCase();
  if (!symbol) return alert("Please enter a symbol.");

  document.getElementById("chart-container").innerHTML = "";

  widget = new TradingView.widget({
    "container_id": "chart-container",
    "autosize": true,
    "symbol": symbol,
    "interval": "5",
    "timezone": "Asia/Kolkata",
    "theme": "light",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "withdateranges": true,
    "hide_side_toolbar": false,
    "allow_symbol_change": true,
    "details": true,
    "studies": ["MACD@tv-basicstudies"],
    "support_host": "https://www.tradingview.com"
  });

  setTimeout(() => {
    const randomLTP = 1000 + Math.random() * 1000;
    currentPrice = randomLTP;
    document.getElementById("ltp").innerText = currentPrice.toFixed(2);
  }, 3000);
}

function buy() {
  placeOrder("Buy");
}

function sell() {
  placeOrder("Sell");
}

function placeOrder(type) {
  const qty = parseInt(document.getElementById("qty").value);
  const price = currentPrice;
  if (type === "Buy" && wallet < qty * price) {
    alert("Insufficient balance.");
    return;
  }
  wallet += (type === "Sell" ? qty * price : -qty * price);
  document.getElementById("wallet").innerText = wallet.toFixed(2);
  trades.push({ type, qty, price });
  renderTrades();
}

function renderTrades() {
  const tbody = document.getElementById("trades");
  tbody.innerHTML = "";
  trades.forEach((t, i) => {
    const pl = (t.type === "Sell" ? 1 : -1) * t.qty * t.price;
    tbody.innerHTML += `<tr><td>${i + 1}</td><td>${t.type}</td><td>${t.qty}</td><td>${t.price.toFixed(2)}</td><td>${pl.toFixed(2)}</td></tr>`;
  });
}

const sampleSymbols = ["RELIANCE", "TCS", "INFY", "NSE:NIFTY", "NSE:BANKNIFTY", "SBIN", "HDFCBANK", "ADANIENT"];
document.addEventListener("DOMContentLoaded", () => {
  const datalist = document.getElementById("symbols");
  sampleSymbols.forEach(sym => {
    const opt = document.createElement("option");
    opt.value = sym;
    datalist.appendChild(opt);
  });
});
