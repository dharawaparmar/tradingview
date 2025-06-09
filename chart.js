let wallet = 100000;
let trades = [];
let ltp = 22500 + Math.random() * 100;
let index = 0;

document.getElementById("ltp").innerText = ltp.toFixed(2);

function updateWallet() {
  document.getElementById("wallet").innerText = wallet.toFixed(2);
}

function buy() {
  const qty = parseInt(document.getElementById("qty").value);
  if (wallet >= ltp * qty) {
    trades.push({ type: "Buy", qty, price: ltp });
    wallet -= ltp * qty;
    updateWallet();
    renderTrades();
  }
}

function sell() {
  const qty = parseInt(document.getElementById("qty").value);
  trades.push({ type: "Sell", qty, price: ltp });
  wallet += ltp * qty;
  updateWallet();
  renderTrades();
}

function renderTrades() {
  const tbody = document.getElementById("trades");
  tbody.innerHTML = "";
  trades.forEach(t => {
    const pl = (t.type === "Sell" ? 1 : -1) * t.qty * t.price;
    const row = `<tr><td>${t.type}</td><td>${t.qty}</td><td>${t.price.toFixed(2)}</td><td>${pl.toFixed(2)}</td></tr>`;
    tbody.innerHTML += row;
  });
}

function preview() {
  setInterval(() => {
    ltp += (Math.random() - 0.5) * 50;
    document.getElementById("ltp").innerText = ltp.toFixed(2);
  }, 1000);
}
