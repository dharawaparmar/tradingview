let wallet = 100000;
let trades = [];
let candles = [];
let index = 0;

fetch('https://raw.githubusercontent.com/dharawaparmar/tradingview/main/sample_data.json')
  .then(res => res.json())
  .then(data => {
    candles = data;
    document.getElementById("ltp").innerText = candles[0]?.close ?? "-";
  });

function updateWallet() {
  document.getElementById("wallet").innerText = wallet.toFixed(2);
}

function buy() {
  const qty = parseInt(document.getElementById("qty").value);
  const price = candles[index]?.close;
  if (price && wallet >= price * qty) {
    trades.push({ type: "Buy", qty, price });
    wallet -= price * qty;
    updateWallet();
    renderTrades();
  }
}

function sell() {
  const qty = parseInt(document.getElementById("qty").value);
  const price = candles[index]?.close;
  if (price) {
    trades.push({ type: "Sell", qty, price });
    wallet += price * qty;
    updateWallet();
    renderTrades();
  }
}

function renderTrades() {
  const tbody = document.getElementById("trades");
  tbody.innerHTML = "";
  trades.forEach(t => {
    const row = document.createElement("tr");
    const pl = (t.type === "Sell" ? 1 : -1) * t.qty * t.price;
    row.innerHTML = `<td>${t.type}</td><td>${t.qty}</td><td>${t.price}</td><td>${pl.toFixed(2)}</td>`;
    tbody.appendChild(row);
  });
}

function preview() {
  if (!candles.length) return;
  const interval = setInterval(() => {
    if (index >= candles.length) {
      clearInterval(interval);
      return;
    }
    document.getElementById("ltp").innerText = candles[index].close;
    index++;
  }, 1000);
}
