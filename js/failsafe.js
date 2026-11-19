// FAILSAFE: pasang semua form handler + auto-calculation tanpa bergantung app.js
document.addEventListener("DOMContentLoaded", function() {
  // 1. Auto-calculation for Total Belanja
  var calcFields = ["hargaBarang", "kuantitas", "ongkir", "sisaBayar"];
  function doCalc() {
    if (typeof updateTotalBelanja === "function") { updateTotalBelanja(); return; }
    var k = parseFloat(document.getElementById("kuantitas") && document.getElementById("kuantitas").value) || 0;
    var h = parseFloat(document.getElementById("hargaBarang") && document.getElementById("hargaBarang").value) || 0;
    var o = parseFloat(document.getElementById("ongkir") && document.getElementById("ongkir").value) || 0;
    var s = parseFloat(document.getElementById("sisaBayar") && document.getElementById("sisaBayar").value) || 0;
    var tb = document.getElementById("totalBelanja");
    if (tb) tb.value = Math.max(0, (k * h) + o + s);
  }
  calcFields.forEach(function(fid) {
    var el = document.getElementById(fid);
    if (!el) return;
    el.addEventListener("input", doCalc);
    el.addEventListener("change", doCalc);
  });

  // 2. Form submit handlers — stopImmediatePropagation cegah double execution
  var handlers = {
    "login-form": "handleLoginSubmit",
    "transaction-form": "handleTransactionFormSubmit",
    "search-form": "handleSearchSubmit"
  };
  Object.keys(handlers).forEach(function(fid) {
    var form = document.getElementById(fid);
    if (!form) return;
    var fnName = handlers[fid];
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (typeof window[fnName] === "function") window[fnName](e);
      return false;
    }, true);
  });
});
