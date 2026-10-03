"use strict";
const Settings = {
  data: null,
  defaults: { name: "Mega Infra Project", phone: "+91 62607 16687", addr: "", upi: "" },
  init() {
    Settings.data = Object.assign({}, Settings.defaults, Store.get("settings", {}));
    Settings.fill();
    Settings.header();
    $("save").onclick = () => {
      Settings.data = { name: $("sName").value.trim(), phone: $("sPhone").value.trim(), addr: $("sAddr").value.trim(), upi: $("sUpi").value.trim() };
      const ok = Store.set("settings", Settings.data);
      Settings.header();
      Store.flash($("msg"), ok ? "Saved" : "Save nahi hua (browser storage blocked)");
    };
  },
  fill() {
    const d = Settings.data;
    $("sName").value = d.name; $("sPhone").value = d.phone; $("sAddr").value = d.addr; $("sUpi").value = d.upi;
  },
  header() {
    const d = Settings.data;
    $("hName").textContent = d.name || "Mega Infra Project";
    $("hSub").textContent = [d.phone, d.addr].filter(Boolean).join("  |  ");
  }
};
