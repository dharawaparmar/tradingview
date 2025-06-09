let chart = LightweightCharts.createChart(document.getElementById("chart"), {
  width: document.getElementById("chart").clientWidth,
  height: 400,
  layout: { backgroundColor: '#ffffff', textColor: '#000' },
  timeScale: { timeVisible: true, secondsVisible: false },
});
let candleSeries = chart.addCandlestickSeries();

let candles = [];
let currentIndex = 0;
let replayTimer = null;
let trades = [];
let wallet = 100000;

function fetchData(symbol, callback) {
  // For demo use mock JSON; replace this with Yahoo API if desired.
  fetch(`data/${symbol}.json`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(() => alert("Failed to load symbol data."));
}

function startReplay() {
  const symbol = document.getElementById("symbol").value;
  const tf = document.getElementById("timeframe").value;
  const dt = new Date(document.getElementById("startTime").value).getTime() / 1000;

  fetchData(symbol, (data) => {
    candles = data;
    currentIndex = candles.findIndex(c => c.time >= dt);
    if (currentIndex < 0) currentIndex = 0;
    play();
  });
}

function play() {
  if (replayTimer) clearInterval(replayTimer);
  replayTimer = setInterval(() => {
    if (currentIndex >= candles.length) {
      clearInterval(replayTimer);
      return;
    }
    candleSeries.setData(candles.slice(0, currentIndex + 1));
    document.getElementById("ltp").innerText = candles[currentIndex].close.toFixed(2);
    currentIndex++;
  }, 1000);
}

function pauseReplay() {
  clearInterval(replayTimer);
}

function buy() {
  placeOrder("Buy");
}

function sell() {
  placeOrder("Sell");
}

function placeOrder(type) {
  const qty = parseInt(document.getElementById("qty").value);
  const price = candles[currentIndex - 1]?.close || 0;
  if (type === "Buy" && wallet < qty * price) {
    alert("Insufficient funds.");
    return;
  }
  wallet += (type === "Sell" ? qty * price : -qty * price);
  updateWallet();

  trades.push({ type, qty, price, time: candles[currentIndex - 1]?.time });
  renderTrades();
}

function updateWallet() {
  document.getElementById("wallet").innerText = wallet.toFixed(2);
}

function renderTrades() {
  const tbody = document.getElementById("trades");
  tbody.innerHTML = "";
  trades.forEach((t, i) => {
    const pl = (t.type === "Sell" ? 1 : -1) * t.qty * t.price;
    const time = new Date(t.time * 1000).toLocaleString();
    tbody.innerHTML += `<tr>
      <td>${i + 1}</td><td>${t.type}</td><td>${t.qty}</td>
      <td>${t.price.toFixed(2)}</td><td>${time}</td><td>${pl.toFixed(2)}</td>
    </tr>`;
  });
}

updateWallet();
