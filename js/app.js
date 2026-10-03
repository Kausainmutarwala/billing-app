"use strict";
const App = {
  TABS: ["bill", "items", "history", "settings"],
  route() {
    const h = (location.hash || "#bill").slice(1), id = App.TABS.includes(h) ? h : "bill";
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.id === id));
    document.querySelectorAll("nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
    window.scrollTo(0, 0);
  },
  init() {
    Settings.init(); Items.init(); Bill.init(); History.init(); Backup.init();
    window.addEventListener("hashchange", App.route);
    App.route();
  }
};
document.addEventListener("DOMContentLoaded", App.init);
