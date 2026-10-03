"use strict";
// PDF: browser ka Print khulta hai. Wahan "Save as PDF" chun lo.
const PDF = {
  print(b) {
    const S = Settings.data, show = !!b.showAmount, c = Bill.calc(b);
    const secs = b.sections.map(s => ({ name: s.name, rows: s.rows.filter(r => r.name.trim()) })).filter(s => s.rows.length);
    if (!secs.length) { alert("Pehle kam se kam ek item daalo."); return; }
    const head = `<tr><th>#</th><th>Item</th><th>Qty</th><th>Unit</th>${show ? "<th>Rate</th><th>Amount</th>" : ""}</tr>`;
    const tbl = (title, rows) => `<h3>${esc(title)}</h3><table>${head}${rows.map((r, i) =>
      `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.qty)}</td><td>${esc(r.unit)}</td>${show ? `<td>${money(r.rate)}</td><td>${money(num(r.qty) * num(r.rate))}</td>` : ""}</tr>`).join("")}</table>`;
    let body = secs.map(s => tbl(s.name || "Work details", s.rows)).join("");
    if (secs.length > 1) {
      const agg = {};
      secs.forEach(s => s.rows.forEach(r => {
        const k = r.name.trim().toLowerCase() + "|" + r.unit;
        (agg[k] = agg[k] || { name: r.name, unit: r.unit, qty: 0, rate: r.rate }).qty += num(r.qty);
      }));
      body += tbl("Total (all rooms)", Object.values(agg));
    }
    const totals = show ? `<div class="pt"><div><span>Subtotal</span><b>${money(c.sub)}</b></div>
      ${num(b.discount) > 0 ? `<div><span>Discount</span><b>- ${money(b.discount)}</b></div>` : ""}
      ${num(b.advance) > 0 ? `<div><span>Advance</span><b>- ${money(b.advance)}</b></div>` : ""}
      <div><span>Balance</span><b>${money(c.bal)}</b></div></div>` : "";
    const sign = b.sign ? `<div class="sig"><div>Engineer Name &amp; Signature<br><br>Name: ____________________</div>
      <div>Project Manager Signature<br><br>Name: ____________________</div></div>` : "";
    $("printArea").innerHTML = `<div class="ph"><img src="assets/logo.png" alt="" onerror="this.style.display='none'">
      <div><h1>${esc(S.name)}</h1><p>${esc([S.phone, S.addr].filter(Boolean).join(" | "))}</p>${S.upi ? `<p>UPI: ${esc(S.upi)}</p>` : ""}</div></div>
      <div class="pm"><div><b>Bill #${esc(b.no)}</b><br>Date: ${esc(b.date)}<br>Payment: ${esc(b.status)}</div>
      <div><b>${esc(b.customer)}</b><br>${esc(b.phone)}<br>${esc(b.site)}</div></div>
      ${body}${totals}${sign}`;
    const old = document.title;
    document.title = ("Bill-" + b.no + "-" + (b.customer || "customer")).replace(/[^\w-]+/g, "_");
    const done = () => { document.title = old; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
  }
};
