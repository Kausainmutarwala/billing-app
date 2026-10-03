"use strict";
const History = {
  init() {
    $("hSearch").addEventListener("input", History.render);
    $("hList").addEventListener("click", History.onClick);
    History.render();
  },
  render() {
    const q = $("hSearch").value.trim().toLowerCase();
    const rows = Store.get("bills", []).slice().sort((a, b) => b.no - a.no)
      .filter(b => `${b.no} ${b.customer} ${b.site} ${b.phone} ${b.status}`.toLowerCase().includes(q));
    $("hList").innerHTML = rows.length ? rows.map(b => {
      const paid = b.status === "Paid";
      return `<li data-id="${b.id}">
        <div class="hrow"><div class="nm"><b>#${b.no} ${esc(b.customer)}</b>
        <small>${esc(b.site)}${b.site ? " | " : ""}${esc(b.date)} | Balance ${money(Bill.calc(b).bal)}</small></div>
        <span class="badge ${paid ? "paid" : "pend"}">${esc(b.status)}</span></div>
        <div class="hact"><button class="sm" data-act="open">Open</button>
        <button class="sm" data-act="toggle">Mark ${paid ? "Pending" : "Paid"}</button>
        <button class="sm" data-act="print">Print / PDF</button>
        <button class="sm danger" data-act="del">Delete</button></div></li>`;
    }).join("") : `<li class="note">Koi bill nahi mila.</li>`;
  },
  onClick(e) {
    const btn = e.target.closest("button[data-act]"); if (!btn) return;
    const id = +btn.closest("li").dataset.id;
    const all = Store.get("bills", []), i = all.findIndex(x => x.id === id);
    if (i < 0) return;
    const b = all[i], a = btn.dataset.act;
    if (a === "open") {
      if (Bill.dirty() && !confirm("Abhi ka unsaved bill hat jayega. Continue?")) return;
      Bill.load(JSON.parse(JSON.stringify(b))); location.hash = "#bill";
    } else if (a === "toggle") {
      b.status = b.status === "Paid" ? "Pending" : "Paid";
      Store.set("bills", all);
      if (Bill.cur && Bill.cur.id === id) { Bill.cur.status = b.status; $("bStatus").value = b.status; }
      History.render();
    } else if (a === "print") PDF.print(b);
    else if (a === "del") {
      if (!confirm("Bill #" + b.no + " delete karna hai?")) return;
      all.splice(i, 1); Store.set("bills", all);
      if (Bill.cur && Bill.cur.id === id) Bill.cur.id = null;
      History.render();
    }
  }
};
