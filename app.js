'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ── Constants ──
const CATEGORIES = [
  { id: 'dining', name: 'Dining', icon: '🍽️' },
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'gas', name: 'Gas', icon: '⛽' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'flights', name: 'Flights', icon: '🛫' },
  { id: 'hotels', name: 'Hotels', icon: '🏨' },
  { id: 'streaming', name: 'Streaming', icon: '📺' },
  { id: 'online', name: 'Online Shopping', icon: '🛍️' },
  { id: 'drugstores', name: 'Drugstores', icon: '💊' },
  { id: 'transit', name: 'Transit', icon: '🚌' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎟️' },
  { id: 'other', name: 'Everything Else', icon: '💳' },
];

const COLORS = [
  '#1E3A5F','#0D47A1','#1565C0','#00695C','#2E7D32',
  '#E65100','#BF360C','#4A148C','#880E4F','#37474F',
  '#C62828','#AD1457','#6A1B9A','#283593','#004D40',
];

// ── Data Layer ──
const Store = {
  _key: 'cardtracker_cards',
  getAll() { try { return JSON.parse(localStorage.getItem(this._key)) || []; } catch { return []; } },
  save(cards) { localStorage.setItem(this._key, JSON.stringify(cards)); },
  add(card) { const cards = this.getAll(); card.id = crypto.randomUUID(); cards.push(card); this.save(cards); return card; },
  update(card) { const cards = this.getAll(); const i = cards.findIndex(c => c.id === card.id); if (i >= 0) { cards[i] = card; this.save(cards); } },
  remove(id) { this.save(this.getAll().filter(c => c.id !== id)); },
  active() { return this.getAll().filter(c => c.isActive !== false); },
};

// ── Helpers ──
function daysBetween(a, b) { return Math.ceil((new Date(b) - new Date(a)) / 86400000); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''; }
function fmtDateFull(d) { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''; }
function getMult(card, cat) { const b = (card.benefits||[]).find(x => x.category === cat); return b ? b.multiplier : 1; }
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function bestCardFor(cat, owner) {
  let pool = Store.active();
  if (owner) pool = pool.filter(c => c.owner === owner);
  return pool.length ? pool.reduce((a, b) => getMult(b, cat) > getMult(a, cat) ? b : a) : null;
}

function rankedCards(cat, owner) {
  let pool = Store.active();
  if (owner) pool = pool.filter(c => c.owner === owner);
  return pool.map(c => ({ card: c, mult: getMult(c, cat) })).sort((a, b) => b.mult - a.mult);
}

function bonusInfo(card) {
  const b = card.signupBonus;
  if (!b || !b.spendRequired) return null;
  const progress = Math.min((b.currentSpend || 0) / b.spendRequired, 1);
  const isComplete = (b.currentSpend || 0) >= b.spendRequired;
  const daysLeft = daysBetween(new Date(), b.spendDeadline);
  const remaining = Math.max(b.spendRequired - (b.currentSpend || 0), 0);
  return { progress, isComplete, daysLeft, remaining, ...b };
}

// ── State ──
let tab = 'cards', cardFilter = 'all', search = '', selCat = 'dining', bestOwner = '', detailId = null;
const app = document.getElementById('app');

function render() {
  let h = detailId ? renderDetail() : (tab === 'cards' ? renderCards() : tab === 'best' ? renderBest() : renderBonus());
  h += renderTabs();
  app.innerHTML = h;
  bind();
}

function renderTabs() {
  return `<nav class="tab-bar">
    <button class="tab-btn ${tab==='cards'?'active':''}" data-tab="cards">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>Cards
    </button>
    <button class="tab-btn ${tab==='best'?'active':''}" data-tab="best">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Best Card
    </button>
    <button class="tab-btn ${tab==='bonus'?'active':''}" data-tab="bonus">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>Bonuses
    </button>
  </nav>`;
}

// ── Cards Tab ──
function renderCards() {
  const all = Store.active(), fees = all.reduce((s, c) => s + (c.annualFee||0), 0);
  let list = all;
  if (cardFilter !== 'all') list = list.filter(c => c.owner === cardFilter);
  if (search) { const q = search.toLowerCase(); list = list.filter(c => (c.issuer+' '+c.cardName).toLowerCase().includes(q)); }
  list.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

  let h = `<div class="page active">
    <h1 class="page-title">My Cards</h1>
    <div class="summary-strip">
      <div class="summary-item"><div class="value">${all.length}</div><div class="label">Active Cards</div></div>
      <div class="summary-item"><div class="value" style="color:var(--orange)">$${Math.round(fees)}</div><div class="label">Annual Fees</div></div>
    </div>
    <div class="filter-bar">
      <button class="filter-chip ${cardFilter==='all'?'active':''}" data-filter="all">All</button>
      <button class="filter-chip ${cardFilter==='me'?'active':''}" data-filter="me">Me</button>
      <button class="filter-chip ${cardFilter==='spouse'?'active':''}" data-filter="spouse">Spouse</button>
    </div>
    <input class="search-box" type="text" placeholder="Search cards..." value="${esc(search)}" id="search-input">`;

  if (!list.length && !all.length) {
    h += `<div class="empty-state"><div class="icon">💳</div><h3>No Cards Yet</h3>
      <p>Add your first credit card to start tracking benefits.</p>
      <button onclick="openAddCard()">Add Card</button></div>`;
  } else if (!list.length) {
    h += `<div class="empty-state"><p>No cards match your filter.</p></div>`;
  } else {
    list.forEach(c => {
      const bp = bonusInfo(c);
      let ring = '';
      if (bp && !bp.isComplete && bp.daysLeft >= 0) {
        const circ = 2 * Math.PI * 13, off = circ * (1 - bp.progress);
        ring = `<svg class="progress-ring" viewBox="0 0 32 32"><circle class="bg"/><circle class="fg" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/><text x="16" y="16">${Math.round(bp.progress*100)}%</text></svg>`;
      }
      h += `<div class="card-row" data-detail="${c.id}">
        <div class="mini-card" style="background:${esc(c.colorHex)}">${esc((c.issuer||'').substring(0,2).toUpperCase())}</div>
        <div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div>
          <div class="meta"><span class="owner-tag">${c.owner==='me'?'Me':'Spouse'}</span>
            ${c.annualFee?`<span>$${Math.round(c.annualFee)}/yr</span>`:''}
            ${c.lastFourDigits?`<span>•••• ${esc(c.lastFourDigits)}</span>`:''}</div>
        </div>${ring}</div>`;
    });
  }
  h += `<div style="height:20px"></div><button class="btn-primary" onclick="openAddCard()">+ Add New Card</button></div>`;
  return h;
}

// ── Best Card Tab ──
function renderBest() {
  let h = `<div class="page active"><h1 class="page-title">Best Card</h1>
    <div class="filter-bar" style="margin-bottom:12px">
      <button class="filter-chip ${bestOwner===''?'active':''}" data-bestowner="">Both</button>
      <button class="filter-chip ${bestOwner==='me'?'active':''}" data-bestowner="me">Me</button>
      <button class="filter-chip ${bestOwner==='spouse'?'active':''}" data-bestowner="spouse">Spouse</button>
    </div><div class="category-grid">`;
  CATEGORIES.forEach(c => {
    h += `<div class="cat-chip ${selCat===c.id?'active':''}" data-cat="${c.id}"><div class="icon">${c.icon}</div><div class="cat-label">${c.name}</div></div>`;
  });
  h += `</div>`;

  const best = bestCardFor(selCat, bestOwner || undefined);
  if (best) {
    const m = getMult(best, selCat), ben = (best.benefits||[]).find(b => b.category === selCat), pt = ben ? ben.pointType : '', bp = bonusInfo(best);
    h += `<div class="best-card-result" style="background:linear-gradient(135deg,${esc(best.colorHex)},${esc(best.colorHex)}cc)">
      <div class="top-row"><div class="card-info"><div class="name">${esc(best.issuer)} ${esc(best.cardName)}</div>
        <span style="background:rgba(255,255,255,0.2);color:#fff;display:inline-block;margin-top:4px;font-size:11px;padding:2px 8px;border-radius:10px">${best.owner==='me'?'Me':'Spouse'}</span></div>
        <div style="text-align:right"><div class="multiplier">${m.toFixed(1)}x</div>${pt?`<div class="pt-type">${esc(pt)}</div>`:''}</div></div>`;
    if (bp && !bp.isComplete && bp.daysLeft >= 0) h += `<div class="bonus-nudge">⭐ Needs $${Math.round(bp.remaining)} more to hit signup bonus!</div>`;
    h += `</div>`;
  } else {
    h += `<div class="empty-state"><div class="icon">💳</div><h3>No Cards</h3><p>Add cards to get recommendations.</p></div>`;
  }

  const ranked = rankedCards(selCat, bestOwner || undefined);
  if (ranked.length) {
    h += `<div class="detail-section"><h3>All Cards Ranked</h3>`;
    ranked.forEach((r, i) => {
      h += `<div class="rank-row"><div class="rank-num">#${i+1}</div><div class="rank-mini" style="background:${esc(r.card.colorHex)}"></div>
        <div class="rank-info"><div class="name">${esc(r.card.issuer)} ${esc(r.card.cardName)}</div><div class="owner">${r.card.owner==='me'?'Me':'Spouse'}</div></div>
        <div class="rank-mult">${r.mult.toFixed(1)}x</div></div>`;
    });
    h += `</div>`;
  }
  h += `</div>`;
  return h;
}

// ── Bonus Tab ──
function renderBonus() {
  const all = Store.active(), urgent = [], prog = [], done = [];
  all.forEach(c => { const b = bonusInfo(c); if (!b) return; if (b.isComplete) done.push(c); else if (b.daysLeft >= 0 && b.daysLeft <= 30) urgent.push(c); else if (b.daysLeft > 30) prog.push(c); });
  urgent.sort((a, b) => bonusInfo(a).daysLeft - bonusInfo(b).daysLeft);
  prog.sort((a, b) => bonusInfo(a).daysLeft - bonusInfo(b).daysLeft);

  let h = `<div class="page active"><h1 class="page-title">Bonus Tracker</h1>`;
  if (!urgent.length && !prog.length && !done.length) h += `<div class="empty-state"><div class="icon">🎯</div><h3>No Signup Bonuses</h3><p>Cards with signup bonuses will appear here.</p></div>`;

  if (urgent.length) { h += `<div class="bonus-section-title urgent">⚠️ Urgent — Under 30 Days</div>`; urgent.forEach(c => { h += bonusCard(c, true); }); }
  if (prog.length) { h += `<div class="bonus-section-title progress">🕐 In Progress</div>`; prog.forEach(c => { h += bonusCard(c, false); }); }
  if (done.length) {
    h += `<div class="bonus-section-title done">✅ Completed</div>`;
    done.forEach(c => { const b = bonusInfo(c); h += `<div class="completed-row"><div>✅</div><div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div><div class="desc">${esc(b.bonusDescription)}</div></div><span style="font-size:11px;color:var(--text3)">${c.owner==='me'?'Me':'Spouse'}</span></div>`; });
  }
  h += `</div>`; return h;
}

function bonusCard(c, urg) {
  const b = bonusInfo(c); if (!b) return '';
  const daily = b.daysLeft > 0 ? Math.round(b.remaining / b.daysLeft) : 0, pct = Math.round(b.progress * 100);
  return `<div class="bonus-card">
    <div class="bonus-card-header"><div class="mini-card" style="background:${esc(c.colorHex)}">${esc((c.issuer||'').substring(0,2).toUpperCase())}</div>
      <div class="info"><div class="name">${esc(c.issuer)} ${esc(c.cardName)}</div><div class="owner">${c.owner==='me'?'Me':'Spouse'}</div></div>
      <div class="days"><div class="num" style="color:${urg?'var(--red)':'var(--text)'}">${b.daysLeft}</div><div class="lbl">days left</div></div></div>
    <div class="bonus-desc">${esc(b.bonusDescription)}</div>
    <div class="progress-bar"><div class="fill" style="width:${pct}%;background:${urg?'var(--red)':'var(--blue)'}"></div></div>
    <div class="bonus-stats"><span>$${Math.round(b.currentSpend||0)} / $${Math.round(b.spendRequired)}</span><span style="font-weight:600;color:${urg?'var(--red)':'var(--text2)'}">$${Math.round(b.remaining)} to go</span></div>
    ${b.daysLeft > 0 ? `<div class="bonus-daily">ℹ️ Spend ~$${daily}/day to hit the target</div>` : ''}
    <button class="bonus-update-btn ${urg?'urgent':''}" data-updatespend="${c.id}">Update Spend</button></div>`;
}

// ── Detail Page ──
function renderDetail() {
  const c = Store.getAll().find(x => x.id === detailId);
  if (!c) { detailId = null; return renderCards(); }
  const bp = bonusInfo(c);

  let h = `<div class="page active">
    <button class="detail-back" onclick="closeDetail()">← Back</button>
    <div class="card-visual" style="background:linear-gradient(135deg,${esc(c.colorHex)},${esc(c.colorHex)}cc)">
      <div class="card-visual-header"><span class="issuer">${esc(c.issuer)}</span><span class="owner-badge">${c.owner==='me'?'Me':'Spouse'}</span></div>
      <div class="card-name">${esc(c.cardName)}</div>
      <div class="card-visual-footer"><span class="digits">•••• •••• •••• ${esc(c.lastFourDigits||'····')}</span>${c.annualFee?`<span class="fee">$${Math.round(c.annualFee)}/yr</span>`:''}</div>
    </div>
    <div style="display:flex;background:var(--surface);border-radius:var(--radius);padding:12px;margin-bottom:12px;text-align:center">
      <div style="flex:1"><div style="font-weight:700">${fmtDate(c.openDate)}</div><div style="font-size:11px;color:var(--text3)">Opened</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="flex:1"><div style="font-weight:700">${(c.benefits||[]).length}</div><div style="font-size:11px;color:var(--text3)">Benefits</div></div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="flex:1"><div style="font-weight:700">${(c.perks||[]).length}</div><div style="font-size:11px;color:var(--text3)">Perks</div></div>
    </div>`;

  if (bp) {
    const pct = Math.round(bp.progress * 100);
    h += `<div class="detail-section"><h3>Signup Bonus</h3>
      <div style="font-weight:700;font-size:16px;margin-bottom:8px">${esc(bp.bonusDescription)}</div>
      <div class="progress-bar"><div class="fill" style="width:${pct}%;background:${bp.isComplete?'var(--green)':'var(--blue)'}"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:4px"><span>$${Math.round(bp.currentSpend||0)} / $${Math.round(bp.spendRequired)}</span><span style="font-weight:600">${pct}%</span></div>`;
    h += bp.isComplete ? `<div style="margin-top:8px;color:var(--green);font-weight:600">✅ Bonus earned!</div>` :
      `<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-top:8px"><span style="color:${bp.daysLeft<=30?'var(--red)':'var(--text3)'}">${bp.daysLeft} days left</span><span style="font-weight:600">$${Math.round(bp.remaining)} to go</span></div>`;
    h += `</div>`;
  }

  h += `<div class="detail-section"><h3>Earning Rates</h3>`;
  if (!(c.benefits||[]).length) h += `<div style="color:var(--text3);font-size:14px">No earning rates added</div>`;
  else (c.benefits||[]).forEach(b => { const cat = CATEGORIES.find(x => x.id === b.category); h += `<div class="benefit-row"><div class="cat">${cat?cat.icon:'💳'} <span>${cat?cat.name:b.category}</span></div><div><span class="mult">${b.multiplier.toFixed(1)}x</span>${b.pointType?`<span class="pt">${esc(b.pointType)}</span>`:''}</div></div>`; });
  h += `</div>`;

  h += `<div class="detail-section"><h3>Perks & Credits</h3>`;
  if (!(c.perks||[]).length) h += `<div style="color:var(--text3);font-size:14px">No perks added</div>`;
  else (c.perks||[]).forEach(p => { h += `<div class="perk-row"><div><div class="perk-name">${esc(p.name)}</div>${p.details?`<div class="perk-detail">${esc(p.details)}</div>`:''}</div>${p.isAnnual?'<span class="annual-tag">Annual</span>':''}</div>`; });
  h += `</div>`;

  h += `<div class="detail-section"><h3>Details</h3>
    <div class="detail-row"><span>Issuer</span><span>${esc(c.issuer)}</span></div>
    <div class="detail-row"><span>Opened</span><span>${fmtDateFull(c.openDate)}</span></div>
    <div class="detail-row"><span>Annual Fee</span><span>$${Math.round(c.annualFee||0)}</span></div>
    ${c.notes?`<div style="margin-top:8px"><div style="font-size:12px;color:var(--text3);margin-bottom:4px">Notes</div><div style="font-size:14px">${esc(c.notes)}</div></div>`:''}</div>`;

  h += `<button class="btn-primary" onclick="openEditCard('${c.id}')">Edit Card</button>
    <button class="btn-danger" onclick="closeCard('${c.id}')">Close Card</button></div>`;
  return h;
}

function closeDetail() { detailId = null; render(); }

// ── Add/Edit Card Modal ──
function openAddCard() { showCardModal(null); }
function openEditCard(id) { const c = Store.getAll().find(x => x.id === id); if (c) showCardModal(c); }

function showCardModal(card) {
  const isEdit = !!card;
  const c = card || { owner:'me', issuer:'', cardName:'', lastFourDigits:'', annualFee:0, openDate:new Date().toISOString().split('T')[0], colorHex:'#1E3A5F', notes:'', benefits:[], perks:[], signupBonus:null, isActive:true };
  window._tb = [...(c.benefits||[])];
  window._tp = [...(c.perks||[])];
  const hasBonus = !!c.signupBonus, bonus = c.signupBonus || {};

  const ov = document.createElement('div');
  ov.className = 'modal-overlay'; ov.id = 'card-modal';

  const colorsH = COLORS.map(hex => `<div class="color-swatch ${c.colorHex===hex?'active':''}" data-color="${hex}" style="background:${hex}"></div>`).join('');
  const catsH = CATEGORIES.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');

  ov.innerHTML = `<div class="modal">
    <div class="modal-header"><button onclick="closeModal()">Cancel</button><h2>${isEdit?'Edit Card':'Add Card'}</h2><button id="save-btn" style="font-weight:700">${isEdit?'Save':'Add'}</button></div>
    <div class="form-group"><label>Owner</label><select id="f-owner"><option value="me" ${c.owner==='me'?'selected':''}>Me</option><option value="spouse" ${c.owner==='spouse'?'selected':''}>Spouse</option></select></div>
    <div class="form-row"><div class="form-group"><label>Issuer</label><input id="f-issuer" placeholder="Chase, Amex..." value="${esc(c.issuer)}"></div><div class="form-group"><label>Card Name</label><input id="f-name" placeholder="Sapphire Preferred..." value="${esc(c.cardName)}"></div></div>
    <div class="form-row"><div class="form-group"><label>Last 4 Digits</label><input id="f-last4" maxlength="4" inputmode="numeric" placeholder="1234" value="${esc(c.lastFourDigits||'')}"></div><div class="form-group"><label>Annual Fee ($)</label><input id="f-fee" inputmode="decimal" placeholder="0" value="${c.annualFee||''}"></div></div>
    <div class="form-group"><label>Date Opened</label><input id="f-date" type="date" value="${(c.openDate||'').substring(0,10)}"></div>
    <div class="form-group"><label>Card Color</label><div class="color-grid" id="color-grid">${colorsH}</div></div>
    <div class="form-group"><label>Earning Rates</label><div id="ben-list"></div><button class="add-inline-btn" id="add-ben-btn">+ Add Earning Rate</button></div>
    <div id="ben-form" style="display:none;background:var(--surface);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px">
      <div class="form-row"><div class="form-group"><label>Category</label><select id="bf-cat">${catsH}</select></div><div class="form-group"><label>Multiplier</label><input id="bf-mult" inputmode="decimal" placeholder="3" value="3"></div></div>
      <div class="form-group"><label>Point Type</label><input id="bf-pt" placeholder="Chase UR, Amex MR..."></div>
      <div style="display:flex;gap:8px"><button class="btn-primary" style="flex:1;padding:8px;font-size:13px" id="bf-save">Add</button><button class="btn-danger" style="flex:1;padding:8px;font-size:13px;margin-top:8px" id="bf-cancel">Cancel</button></div>
    </div>
    <div class="form-group"><label>Perks & Credits</label><div id="perk-list"></div><button class="add-inline-btn" id="add-perk-btn">+ Add Perk</button></div>
    <div id="perk-form" style="display:none;background:var(--surface);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px">
      <div class="form-group"><label>Perk Name</label><input id="pf-name" placeholder="Lounge Access, $300 Travel Credit..."></div>
      <div class="form-group"><label>Details</label><input id="pf-detail" placeholder="Optional details"></div>
      <div class="toggle-row"><label>Resets Annually</label><button class="toggle on" id="pf-annual"></button></div>
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn-primary" style="flex:1;padding:8px;font-size:13px" id="pf-save">Add</button><button class="btn-danger" style="flex:1;padding:8px;font-size:13px;margin-top:8px" id="pf-cancel">Cancel</button></div>
    </div>
    <div class="form-group"><div class="toggle-row"><label>Signup Bonus</label><button class="toggle ${hasBonus?'on':''}" id="bonus-toggle"></button></div></div>
    <div id="bonus-fields" style="display:${hasBonus?'block':'none'}">
      <div class="form-group"><label>Bonus Description</label><input id="f-bdesc" placeholder="80,000 UR points" value="${esc(bonus.bonusDescription||'')}"></div>
      <div class="form-row"><div class="form-group"><label>Spend Required ($)</label><input id="f-bspend" inputmode="decimal" placeholder="4000" value="${bonus.spendRequired||''}"></div><div class="form-group"><label>Deadline (months)</label><select id="f-bmonths"><option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option><option value="15">15 months</option></select></div></div>
      <div class="form-group"><label>Current Spend ($)</label><input id="f-bcurr" inputmode="decimal" placeholder="0" value="${bonus.currentSpend||''}"></div>
    </div>
    <div class="form-group"><label>Notes</label><textarea id="f-notes" placeholder="Any additional notes...">${esc(c.notes||'')}</textarea></div>
    <button class="btn-primary" id="save-btn2">${isEdit?'Save Card':'Add Card'}</button>
    ${isEdit?`<button class="btn-danger" onclick="closeCard('${c.id}')">Close Card</button>`:''}
  </div>`;

  document.body.appendChild(ov);
  renderBenList(); renderPerkList();

  document.getElementById('color-grid').addEventListener('click', e => { const s = e.target.closest('.color-swatch'); if (!s) return; document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active')); s.classList.add('active'); });
  document.getElementById('add-ben-btn').addEventListener('click', () => { document.getElementById('ben-form').style.display = 'block'; });
  document.getElementById('bf-cancel').addEventListener('click', () => { document.getElementById('ben-form').style.display = 'none'; });
  document.getElementById('bf-save').addEventListener('click', () => {
    window._tb.push({ category: document.getElementById('bf-cat').value, multiplier: parseFloat(document.getElementById('bf-mult').value)||1, pointType: document.getElementById('bf-pt').value });
    document.getElementById('ben-form').style.display = 'none'; document.getElementById('bf-mult').value = '3'; document.getElementById('bf-pt').value = ''; renderBenList();
  });
  document.getElementById('add-perk-btn').addEventListener('click', () => { document.getElementById('perk-form').style.display = 'block'; });
  document.getElementById('pf-cancel').addEventListener('click', () => { document.getElementById('perk-form').style.display = 'none'; });
  document.getElementById('pf-save').addEventListener('click', () => {
    const n = document.getElementById('pf-name').value; if (!n) return;
    window._tp.push({ name: n, details: document.getElementById('pf-detail').value, isAnnual: document.getElementById('pf-annual').classList.contains('on') });
    document.getElementById('perk-form').style.display = 'none'; document.getElementById('pf-name').value = ''; document.getElementById('pf-detail').value = ''; renderPerkList();
  });
  document.getElementById('pf-annual').addEventListener('click', function() { this.classList.toggle('on'); });
  document.getElementById('bonus-toggle').addEventListener('click', function() { this.classList.toggle('on'); document.getElementById('bonus-fields').style.display = this.classList.contains('on') ? 'block' : 'none'; });

  const save = () => {
    const issuer = document.getElementById('f-issuer').value.trim(), cardName = document.getElementById('f-name').value.trim();
    if (!issuer || !cardName) return;
    const ac = document.querySelector('.color-swatch.active'), od = document.getElementById('f-date').value, hb = document.getElementById('bonus-toggle').classList.contains('on');
    let sb = null;
    if (hb) { const mo = parseInt(document.getElementById('f-bmonths').value)||3, d = new Date(od||Date.now()); d.setMonth(d.getMonth()+mo); sb = { bonusDescription: document.getElementById('f-bdesc').value, spendRequired: parseFloat(document.getElementById('f-bspend').value)||0, spendDeadline: d.toISOString(), currentSpend: parseFloat(document.getElementById('f-bcurr').value)||0 }; }
    const nc = { id: isEdit?c.id:undefined, owner: document.getElementById('f-owner').value, issuer, cardName, lastFourDigits: document.getElementById('f-last4').value.replace(/\D/g,'').substring(0,4), annualFee: parseFloat(document.getElementById('f-fee').value)||0, openDate: od||new Date().toISOString().split('T')[0], colorHex: ac?ac.dataset.color:'#1E3A5F', notes: document.getElementById('f-notes').value, benefits: window._tb, perks: window._tp, signupBonus: sb, isActive: true };
    if (isEdit) Store.update(nc); else Store.add(nc);
    closeModal(); render();
  };
  document.getElementById('save-btn').addEventListener('click', save);
  document.getElementById('save-btn2').addEventListener('click', save);
}

function renderBenList() {
  const el = document.getElementById('ben-list'); if (!el) return;
  el.innerHTML = window._tb.map((b, i) => { const cat = CATEGORIES.find(c => c.id === b.category); return `<div class="inline-list-item"><span>${cat?cat.icon:'💳'} ${cat?cat.name:b.category} — ${b.multiplier}x ${b.pointType?'('+esc(b.pointType)+')':''}</span><button class="remove-btn" data-rmb="${i}">×</button></div>`; }).join('');
  el.querySelectorAll('[data-rmb]').forEach(btn => { btn.addEventListener('click', () => { window._tb.splice(parseInt(btn.dataset.rmb), 1); renderBenList(); }); });
}

function renderPerkList() {
  const el = document.getElementById('perk-list'); if (!el) return;
  el.innerHTML = window._tp.map((p, i) => `<div class="inline-list-item"><span>${esc(p.name)}${p.isAnnual?' (Annual)':''}</span><button class="remove-btn" data-rmp="${i}">×</button></div>`).join('');
  el.querySelectorAll('[data-rmp]').forEach(btn => { btn.addEventListener('click', () => { window._tp.splice(parseInt(btn.dataset.rmp), 1); renderPerkList(); }); });
}

function closeModal() { const m = document.getElementById('card-modal'); if (m) m.remove(); }

// ── Update Spend Modal ──
function openUpdateSpend(id) {
  const card = Store.getAll().find(c => c.id === id);
  if (!card || !card.signupBonus) return;
  const b = card.signupBonus;
  const ov = document.createElement('div');
  ov.className = 'modal-overlay'; ov.id = 'spend-modal';
  ov.innerHTML = `<div class="modal" style="max-height:50dvh">
    <div class="modal-header"><button onclick="document.getElementById('spend-modal').remove()">Cancel</button><h2>Update Spend</h2><button id="save-spend" style="font-weight:700">Save</button></div>
    <div style="font-weight:600;font-size:16px;margin-bottom:12px">${esc(card.issuer)} ${esc(card.cardName)}</div>
    <div class="detail-row"><span>Target</span><span>$${Math.round(b.spendRequired)}</span></div>
    <div class="detail-row"><span>Current</span><span>$${Math.round(b.currentSpend||0)}</span></div>
    <div class="form-group" style="margin-top:16px"><label>New Total Spend ($)</label><input id="new-spend" inputmode="decimal" value="${Math.round(b.currentSpend||0)}"></div>
    <button class="btn-primary" id="save-spend2">Save</button>
  </div>`;
  document.body.appendChild(ov);
  const doSave = () => { card.signupBonus.currentSpend = parseFloat(document.getElementById('new-spend').value)||0; Store.update(card); document.getElementById('spend-modal').remove(); render(); };
  document.getElementById('save-spend').addEventListener('click', doSave);
  document.getElementById('save-spend2').addEventListener('click', doSave);
}

// ── Close Card ──
function closeCard(id) {
  if (!confirm('Close this card? It will be marked as inactive.')) return;
  const c = Store.getAll().find(x => x.id === id);
  if (c) { c.isActive = false; Store.update(c); }
  closeModal(); detailId = null; render();
}

// ── Event Binding ──
function bind() {
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; detailId = null; render(); }));
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { cardFilter = b.dataset.filter; render(); }));
  const si = document.getElementById('search-input');
  if (si) si.addEventListener('input', e => { search = e.target.value; render(); const ni = document.getElementById('search-input'); if (ni) { ni.focus(); ni.selectionStart = ni.selectionEnd = ni.value.length; } });
  document.querySelectorAll('[data-detail]').forEach(el => el.addEventListener('click', () => { detailId = el.dataset.detail; render(); }));
  document.querySelectorAll('[data-cat]').forEach(el => el.addEventListener('click', () => { selCat = el.dataset.cat; render(); }));
  document.querySelectorAll('[data-bestowner]').forEach(el => el.addEventListener('click', () => { bestOwner = el.dataset.bestowner; render(); }));
  document.querySelectorAll('[data-updatespend]').forEach(b => b.addEventListener('click', () => { openUpdateSpend(b.dataset.updatespend); }));
}

// ── Go ──
render();
