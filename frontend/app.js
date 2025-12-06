const API_URL = "http://localhost:5000/api/inventory";

async function loadInventory() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const inventoryDiv = document.getElementById("inventory");
  inventoryDiv.innerHTML = data.data.map(item =>
    `<p>${item.name} (Qty: ${item.quantity})</p>`
  ).join("");
}

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const quantity = document.getElementById("quantity").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity })
  });

  loadInventory();
});

loadInventory();
