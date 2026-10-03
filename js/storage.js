"use strict";
const $ = id => document.getElementById(id);
const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const money = n => "Rs " + num(n).toLocaleString("en-IN", {maximumFractionDigits: 2});
const UNITS = ["nos", "rm", "point", "times", "set", "sq ft", "day", "lot"];
const unitOptions = sel => (UNITS.includes(sel) || !sel ? UNITS : UNITS.concat(sel))
  .map(u => `<option${u === sel ? " selected" : ""}>${esc(u)}</option>`).join("");

// Saara data yahin se save/load hota hai. Baad mein Firebase yahin judega.
const Store = {
  get(k, f) { try { const v = localStorage.getItem("mip_" + k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
  set(k, v) { try { localStorage.setItem("mip_" + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  flash(el, text, ms) { el.textContent = text; setTimeout(() => { el.textContent = ""; }, ms || 2500); }
};
