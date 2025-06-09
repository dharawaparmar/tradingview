const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  width: document.getElementById('chart').offsetWidth,
  height: 500,
  layout: { backgroundColor: '#fff', textColor: '#000' },
  timeScale: { timeVisible: true, secondsVisible: false }
});
const candlesSeries = chart.addCandlestickSeries();

let candles = [];
let currentIndex = 0;
let wallet = 100000, trades = [];
let replayTimer = null;

function loadData() {
  fetch('data/nifty.csv')
    .then(r => r.text())
    .then(csv => {
      const lines = csv.trim().split('\n');
      candles = lines.map((l,i) => {
        if (i===0) return;
        const [ts,o,h,lw,c] = l.split(',');
        return { time: +ts, open: +o, high: +h, low: +lw, close: +c };
      }).slice(1); // remove header
    });
}
loadData();

function startReplay() {
  const dt = new Date(document.getElementById('startTime').value).getTime() / 1000;
  currentIndex = candles.findIndex(c => c.time >= dt);
  if (currentIndex < 0) currentIndex = 0;
  if (replayTimer) clearInterval(replayTimer);
  replayTimer = setInterval(() => {
    if (currentIndex >= candles.length) { clearInterval(replayTimer); return; }
    const slice = candles.slice(0, currentIndex+1);
    candlesSeries.setData(slice);
    document.getElementById('ltp').innerText = candles[currentIndex].close.toFixed(2);
    currentIndex++;
  }, 500);
}

function pauseReplay() {
  if (replayTimer) clearInterval(replayTimer);
}

function buy() { placeOrder('Buy'); }
function sell() { placeOrder('Sell'); }

function placeOrder(type) {
  const qty = parseInt(document.getElementById('qty').value);
  const price = candles[currentIndex-1]?.close;
  if (!price) return alert('No price yet');
  if (type==='Buy' && wallet < qty*price) return alert('Insufficient funds');
  wallet += (type==='Sell'? qty*price : -qty*price);
  trades.push({ type, qty, price, time: candles[currentIndex-1].time });
  updateUI();
}

function updateUI() {
  document.getElementById('wallet').innerText = wallet.toFixed(2);
  const tbody = document.getElementById('trades');
  tbody.innerHTML = '';
  trades.forEach((t,i) => {
    const pl = (t.type === 'Sell' ? 1 : -1) * t.qty * t.price;
    const date = new Date(t.time * 1000).toLocaleString();
    const row = `<tr><td>${i+1}</td><td>${t.type}</td><td>${t.qty}</td><td>${t.price.toFixed(2)}</td><td>${date}</td><td>${pl.toFixed(2)}</td></tr>`;
    tbody.innerHTML += row;
  });
}
