"use strict";
const Backup = {
  init() {
    $("bkDown").onclick = Backup.download;
    $("bkFile").onchange = Backup.restore;
  },
  download() {
    const data = { app: "mega-infra-billing", version: 1, date: new Date().toISOString(),
      settings: Settings.data, items: Items.list, bills: Store.get("bills", []) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = "mega-infra-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Store.flash($("bkMsg"), "Backup download ho gaya");
  },
  restore(e) {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      let d;
      try {
        d = JSON.parse(rd.result);
        if (d.app !== "mega-infra-billing" || !Array.isArray(d.items) || !Array.isArray(d.bills)) throw new Error("bad");
      } catch (err) { Store.flash($("bkMsg"), "Ye valid backup file nahi hai"); return; }
      if (!confirm("Restore karne se abhi ka saara data replace ho jayega. Continue?")) return;
      Store.set("settings", d.settings || {}); Store.set("items", d.items); Store.set("bills", d.bills);
      location.reload();
    };
    rd.readAsText(f);
    e.target.value = "";
  }
};
