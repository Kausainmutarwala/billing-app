"use strict";
const Bill = {
  cur: null, snap: "",
  FIELDS: { bDate: "date", bCust: "customer", bPhone: "phone", bSite: "site", bDisc: "discount", bAdv: "advance", bStatus: "status" },
  nextNo() { return Store.get("bills", []).reduce((m, x) => Math.max(m, x.no), 0) + 1; },
  blankRow() { return { name: "", qty: "", unit: "nos", rate: "" }; },
  blankSec() { return { name: "", rows: [Bill.blankRow()] }; },
  blank() {
    return { id: null, no: Bill.nextNo(), date: new Date().toISOString().slice(0, 10), customer: "", phone: "", site: "",
      sections: [Bill.blankSec()], showAmount: true, sign: true, discount: "", advance: "", status: "Pending" };
  },
  dirty() { return JSON.stringify(Bill.cur) !== Bill.snap; },
  init() {
    Bill.load(Bill.blank());
    const f = $("bill");
    f.addEventListener("input", Bill.onInput);
    f.addEventListener("change", Bill.onInput);
    f.addEventListener("click", Bill.onClick);
    $("addSec").onclick = () => { Bill.cur.sections.push(Bill.blankSec()); Bill.renderSections(); };
    $("bSave").onclick = Bill.save;
    $("bPrint").onclick = () => PDF.print(Bill.cur);
    $("bNew").onclick = () => { if (!Bill.dirty() || confirm("Naya bill? Abhi ka unsaved data hat jayega.")) Bill.load(Bill.blank()); };
  },
  load(b) {
    Bill.cur = b;
    $("bNo").textContent = "#" + b.no;
    Object.keys(Bill.FIELDS).forEach(id => { $(id).value = b[Bill.FIELDS[id]]; });
    $("bShowAmt").checked = !!b.showAmount;
    $("bSign").checked = !!b.sign;
    Bill.renderSections();
    Bill.snap = JSON.stringify(b);
  },
  onInput(e) {
    const t = e.target, B = Bill.cur;
    if (Bill.FIELDS[t.id]) { B[Bill.FIELDS[t.id]] = t.value; Bill.totals(); return; }
    if (t.id === "bShowAmt") { B.showAmount = t.checked; return; }
    if (t.id === "bSign") { B.sign = t.checked; return; }
    if (t.classList.contains("sn")) { B.sections[+t.closest(".sec").dataset.s].name = t.value; return; }
    const row = t.closest(".row"); if (!row) return;
    const d = B.sections[+row.dataset.s].rows[+row.dataset.r];
    if (t.classList.contains("rn")) {
      d.name = t.value;
      const it = Items.find(t.value);
      if (it) { d.unit = it.unit; d.rate = it.rate; row.querySelector(".ru").innerHTML = unitOptions(it.unit); row.querySelector(".rr").value = it.rate; }
    } else if (t.classList.contains("rq")) d.qty = t.value;
    else if (t.classList.contains("ru")) d.unit = t.value;
    else if (t.classList.contains("rr")) d.rate = t.value;
    row.querySelector(".ra").textContent = money(num(d.qty) * num(d.rate));
    Bill.totals();
  },
  onClick(e) {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const S = Bill.cur.sections, s = +b.closest(".sec").dataset.s, a = b.dataset.act;
    if (a === "addrow") S[s].rows.push(Bill.blankRow());
    else if (a === "delrow") { S[s].rows.splice(+b.closest(".row").dataset.r, 1); if (!S[s].rows.length) S[s].rows.push(Bill.blankRow()); }
    else if (a === "delsec") { S.splice(s, 1); if (!S.length) S.push(Bill.blankSec()); }
    Bill.renderSections();
  },
  renderSections() {
    $("secBox").innerHTML = Bill.cur.sections.map((S, s) => `<div class="sec" data-s="${s}">
      <div class="sech"><input class="sn" placeholder="Room / section name (jaise Server Room)" value="${esc(S.name)}">
      <button class="sm danger" data-act="delsec">Remove room</button></div>
      ${S.rows.map((r, i) => `<div class="row" data-s="${s}" data-r="${i}">
        <input class="rn" list="itemSuggest" autocomplete="off" placeholder="Item" value="${esc(r.name)}">
        <input class="rq" type="number" step="any" min="0" inputmode="decimal" placeholder="Qty" value="${esc(r.qty)}">
        <select class="ru">${unitOptions(r.unit)}</select>
        <input class="rr" type="number" step="any" min="0" inputmode="decimal" placeholder="Rate" value="${esc(r.rate)}">
        <span class="ra">${money(num(r.qty) * num(r.rate))}</span>
        <button class="sm danger" data-act="delrow" aria-label="Remove item">x</button></div>`).join("")}
      <button class="sm" data-act="addrow" style="margin-top:8px">+ Add item</button></div>`).join("");
    Bill.totals();
  },
  sum(b) { return b.sections.reduce((a, S) => a + S.rows.reduce((x, r) => x + num(r.qty) * num(r.rate), 0), 0); },
  calc(b) { const sub = Bill.sum(b), net = Math.max(sub - num(b.discount), 0); return { sub, net, bal: net - num(b.advance) }; },
  totals() {
    const c = Bill.calc(Bill.cur);
    $("tot").innerHTML = `<div><span>Subtotal</span><b>${money(c.sub)}</b></div>
      <div><span>After discount</span><b>${money(c.net)}</b></div>
      <div class="bal"><span>Balance to pay</span><b>${money(c.bal)}</b></div>`;
  },
  save() {
    const b = Bill.cur;
    if (!b.customer.trim()) { Store.flash($("bMsg"), "Customer ka naam daalo"); $("bCust").focus(); return; }
    b.sections.forEach(S => S.rows.forEach(r => { if (r.name.trim() && num(r.rate) > 0) Items.remember(r.name, r.unit, r.rate); }));
    const all = Store.get("bills", []);
    const i = b.id ? all.findIndex(x => x.id === b.id) : -1;
    if (i >= 0) all[i] = b; else { b.id = Date.now(); all.push(b); }
    const ok = Store.set("bills", all);
    Bill.snap = JSON.stringify(b);
    Store.flash($("bMsg"), ok ? "Bill saved" : "Save nahi hua (browser storage blocked)");
    History.render();
  }
};
