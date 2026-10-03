"use strict";
const Items = {
  list: [], editIdx: -1,
  seed: [
    ["Tubelight","nos",250],["LED Light (2x2)","nos",250],["Wall Niche Light","nos",200],
    ["Exhaust Fan","nos",400],["Wall Fan","nos",400],["Power Switch with Socket","nos",250],
    ["Normal Switch with Socket","nos",250],["Switch Board","nos",200],["AC Socket","nos",200],
    ["Exhaust Fan Socket Point","nos",200],["UPS Switch with Socket","nos",250],["UPS Switch Board","nos",200],
    ["DB Dressing MCB","nos",3000],
    ["Wire running 1.0 sq mm","rm",10],["Wire running 1.5 sq mm","rm",15],["Wire running 2.5 sq mm","rm",18],
    ["Wire running 4.0 sq mm","rm",25],["Wire running 6.0 sq mm","rm",30]
  ],
  init() {
    let l = Store.get("items", null);
    if (!l) { l = Items.seed.map(([name, unit, rate]) => ({ name, unit, rate })); Store.set("items", l); }
    Items.list = l;
    $("iUnit").innerHTML = unitOptions("nos");
    $("itemList").onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.edit !== undefined) Items.startEdit(+b.dataset.edit, true);
      if (b.dataset.del !== undefined) {
        const i = +b.dataset.del;
        if (confirm('Delete "' + Items.list[i].name + '"?')) {
          Items.list.splice(i, 1); Items.persist();
          if (Items.editIdx === i) Items.reset(); else if (Items.editIdx > i) Items.editIdx--;
          Items.render();
        }
      }
    };
    $("iName").addEventListener("input", () => {
      const it = Items.find($("iName").value);
      const i = it ? Items.list.indexOf(it) : -1;
      if (i >= 0 && i !== Items.editIdx) Items.startEdit(i, false);
    });
    $("iSave").onclick = () => {
      const name = $("iName").value.trim(), rate = parseFloat($("iRate").value), unit = $("iUnit").value;
      if (!name || isNaN(rate) || rate < 0) { $("iMsg").textContent = "Item ka naam aur rate dono daalo."; return; }
      const obj = { name, unit, rate };
      if (Items.editIdx >= 0) Items.list[Items.editIdx] = obj; else Items.list.push(obj);
      Items.persist(); Items.reset(); Items.render();
      Store.flash($("iMsg"), "Saved", 2000);
    };
    $("iCancel").onclick = Items.reset;
    $("iSearch").addEventListener("input", Items.render);
    Items.render();
  },
  persist() { Store.set("items", Items.list); },
  find(name) { const v = String(name).trim().toLowerCase(); return Items.list.find(i => i.name.toLowerCase() === v) || null; },
  // Bill save hote hi naya item list mein add (purana item ho toh uska rate nahi badalta)
  remember(name, unit, rate) {
    name = String(name).trim();
    if (!name || Items.find(name)) return;
    Items.list.push({ name, unit, rate: num(rate) }); Items.persist(); Items.render();
  },
  reset() {
    Items.editIdx = -1; $("iName").value = ""; $("iRate").value = ""; $("iUnit").value = "nos";
    $("formTitle").textContent = "Add item"; $("iSave").textContent = "Add item"; $("iCancel").hidden = true;
  },
  startEdit(i, scroll) {
    Items.editIdx = i; const it = Items.list[i];
    $("iName").value = it.name; $("iUnit").innerHTML = unitOptions(it.unit); $("iRate").value = it.rate;
    $("formTitle").textContent = "Edit item"; $("iSave").textContent = "Update item"; $("iCancel").hidden = false;
    if (scroll) $("iName").scrollIntoView({ behavior: "smooth", block: "center" });
  },
  render() {
    const q = $("iSearch").value.trim().toLowerCase();
    const rows = Items.list.map((it, i) => ({ it, i })).filter(({ it }) => it.name.toLowerCase().includes(q));
    $("itemList").innerHTML = rows.length ? rows.map(({ it, i }) =>
      `<li><span class="nm">${esc(it.name)}<small>${money(it.rate)} / ${esc(it.unit)}</small></span>
      <span class="act"><button class="sm" data-edit="${i}">Edit</button><button class="sm danger" data-del="${i}">Delete</button></span></li>`
    ).join("") : `<li class="note">Koi item nahi mila.</li>`;
    $("itemSuggest").innerHTML = Items.list.map(it => `<option value="${esc(it.name)}">`).join("");
  }
};
