// FAILSAFE: pasang semua form handler tanpa bergantung app.js
document.addEventListener("DOMContentLoaded", function() {
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
      e.stopPropagation();
      if (typeof window[fnName] === "function") {
        window[fnName](e);
      }
      return false;
    }, true);
  });
});
