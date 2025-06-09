let wallet = 100000;
let trades = [];
let ltp = 22500 + Math.random() * 100;
let previewing = false;
let previewInterval = null;

function updateLTP() {
  document.getElementById("ltp").innerText = ltp.toFixed(2);
}

function updateWallet() {
  document.getElementById("wallet").innerText = wallet.toFixed(2);
}

function buy() {
  const qty = parseInt(document.getElementById("qty").value);
  if (wallet >= ltp * qty) {
    wallet -= ltp * qty;
    trades.push({ type: "Buy", qty, price: ltp });
    updateWallet();
    renderTrades();
  } else {
    alert("Insufficient Balance!");
  }
}

function sell() {
  const qty = parseInt(document.getElementById("qty").value);
  wallet += ltp * qty;
  trades.push({ type: "Sell", qty, price: ltp });
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
  if (previewing) {
    clearInterval(previewInterval);
    previewing = false;
  } else {
    previewInterval = setInterval(() => {
      ltp += (Math.random() - 0.5) * 50;
      updateLTP();
    }, 1000);
    previewing = true;
  }
}

updateLTP();
updateWallet();
