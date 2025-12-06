const state = {
  page: 1,
  limit: 10,
  search: ''
};

const els = {
  status: document.getElementById('status'),
  tbody: document.getElementById('items-body'),
  pageIndicator: document.getElementById('page-indicator'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  searchForm: document.getElementById('search-form'),
  createForm: document.getElementById('create-form')
};

init();

function init() {
  els.searchForm.addEventListener('submit', onSearch);
  els.prev.addEventListener('click', () => { state.page = Math.max(1, state.page - 1); load(); });
  els.next.addEventListener('click', () => { state.page = state.page + 1; load(); });
  els.createForm.addEventListener('submit', onCreate);
  load();
}

async function load() {
  setStatus('Loading…');
  const params = new URLSearchParams({
    page: state.page,
    limit: state.limit,
    search: state.search,
    fields: 'id,name,sku,quantity,location,updatedAt'
  });

  try {
    const res = await fetch(`/api/inventory?${params.toString()}`, { headers: { 'Accept': 'application/json' } });
    if (res.status === 304) return; // ETag cache hit
    const payload = await res.json();
    if (payload.error) throw new Error(payload.error.message);
    renderTable(payload.data);
    els.pageIndicator.textContent = `Page ${payload.meta.page}`;
    setStatus(`Loaded ${payload.data.length} items (total ${payload.meta.total})`);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
  }
}

function renderTable(items) {
  els.tbody.innerHTML = '';
  if (!items || !items.length) {
    els.tbody.innerHTML = `<tr><td colspan="6">No items found.</td></tr>`;
    return;
  }

  for (const item of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.sku)}</td>
      <td>${item.quantity}</td>
      <td>${escapeHtml(item.location)}</td>
      <td><time datetime="${item.updatedAt}">${formatTime(item.updatedAt)}</time></td>
      <td>
        <button data-id="${item.id}" class="edit">+1</button>
        <button data-id="${item.id}" class="danger delete">Delete</button>
      </td>
    `;
    tr.querySelector('.edit').addEventListener('click', () => increment(item.id));
    tr.querySelector('.delete').addEventListener('click', () => remove(item.id));
    els.tbody.appendChild(tr);
  }
}

async function increment(id) {
  try {
    const res = await fetch(`/api/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ quantity: '+1' }) // Special instruction: server will treat '+1' as increment
    });
    const payload = await res.json();
    if (payload.error) throw new Error(payload.error.message);
    setStatus(`Updated quantity for item.`);
    load();
  } catch (err) {
    setStatus(`Error updating: ${err.message}`);
  }
}

async function remove(id) {
  if (!confirm('Delete this item?')) return;
  try {
    const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      setStatus(`Item deleted.`);
      load();
    } else {
      const payload = await res.json();
      throw new Error(payload.error?.message || 'Delete failed');
    }
  } catch (err) {
    setStatus(`Error deleting: ${err.message}`);
  }
}

async function onSearch(e) {
  e.preventDefault();
  const fd = new FormData(els.searchForm);
  state.search = String(fd.get('search') || '');
  state.limit = parseInt(fd.get('limit'), 10) || 10;
  state.page = 1;
  load();
}

async function onCreate(e) {
  e.preventDefault();
  const fd = new FormData(els.createForm);
  const body = {
    name: fd.get('name')?.trim(),
    sku: fd.get('sku')?.trim(),
    quantity: Number(fd.get('quantity')),
    location: fd.get('location')?.trim()
  };

  try {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    const payload = await res.json();
    if (payload.error) throw new Error(payload.error.message);
    els.createForm.reset();
    setStatus(`Created item: ${payload.data.name}`);
    load();
  } catch (err) {
    setStatus(`Error creating: ${err.message}`);
  }
}

// Helpers
function setStatus(text) {
  els.status.textContent = text;
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch { return iso; }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
