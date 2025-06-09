let chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: window.innerWidth - 40,
  height: 500,
  layout: {
    backgroundColor: '#ffffff',
    textColor: '#000',
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
});

let candleSeries = chart.addCandlestickSeries();
let candles = [];
let currentIndex = 0;
let wallet = 100000;
let trades = [];

function loadData() {
  fetch('data/nifty.json')
    .then(r => r.json())
    .then(data => {
      candles = data;
    });
}

function startReplay() {
  const startTime = new Date(document.getElementById('startTime').value).getTime() / 1000;
  currentIndex = candles.findIndex(c => c.time >= startTime);
  if (currentIndex < 0) currentIndex = 0;
  replay();
}

function replay() {
  if (currentIndex >= candles.length) return;
  let slice = candles.slice(0, currentIndex + 1);
  candleSeries.setData(slice);
  let current = candles[currentIndex];
  document.getElementById('ltp').textContent = current.close.toFixed(2);
  currentIndex++;
  setTimeout(replay, 1000);
}

function buy() {
  let qty = parseInt(document.getElementById('qty').value);
  let price = candles[currentIndex - 1]?.close || 0;
  if (wallet >= qty * price) {
    wallet -= qty * price;
    trades.push({ type: "Buy", qty, price });
    updateTrades();
  } else {
    alert("Insufficient balance.");
  }
}

function sell() {
  let qty = parseInt(document.getElementById('qty').value);
  let price = candles[currentIndex - 1]?.close || 0;
  wallet += qty * price;
  trades.push({ type: "Sell", qty, price });
  updateTrades();
}

function updateTrades() {
  document.getElementById('wallet').textContent = wallet.toFixed(2);
  const tbody = document.getElementById('trades');
  tbody.innerHTML = "";
  trades.forEach(t => {
    const pl = (t.type === "Sell" ? 1 : -1) * t.qty * t.price;
    tbody.innerHTML += `<tr><td>${t.type}</td><td>${t.qty}</td><td>${t.price.toFixed(2)}</td><td>${pl.toFixed(2)}</td></tr>`;
  });
}

loadData();
