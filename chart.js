
let walletBalance = 100000;
let ltp = 0;
let playing = false;
let orders = [];
let currentIndex = 0;
let candles = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('/tradingview/data/sample_data.json')
    .then(response => response.json())
    .then(data => {
      candles = data;
      updateChart();
    });
});

function updateChart() {
  if (candles.length > currentIndex) {
    const bar = candles[currentIndex];
    ltp = bar.close;
    document.getElementById("ltp").textContent = ltp.toFixed(2);
    if (playing) {
      currentIndex++;
      setTimeout(updateChart, 1000);
    }
  }
}

function togglePlay() {
  playing = !playing;
  if (playing) updateChart();
}

function placeOrder(type) {
  const qty = parseInt(document.getElementById("quantity").value);
  const cost = qty * ltp;
  if (type === 'buy' && walletBalance >= cost) {
    walletBalance -= cost;
    orders.push({ type, qty, price: ltp });
  } else if (type === 'sell') {
    walletBalance += cost;
    orders.push({ type, qty, price: ltp });
  }
  document.getElementById("wallet-balance").textContent = walletBalance.toFixed(2);
  renderOrders();
}

function renderOrders() {
  const tbody = document.querySelector("#orders tbody");
  tbody.innerHTML = "";
  orders.forEach(order => {
    const row = `<tr><td>${order.type}</td><td>${order.qty}</td><td>${order.price.toFixed(2)}</td><td>0.00</td></tr>`;
    tbody.innerHTML += row;
  });
}
