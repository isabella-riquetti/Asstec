(function () {
  "use strict";

  var WHATSAPP_NUMBER = "553184171256";

  var state = {
    brand: "Puma",
    service: "Manutenção / reparo",
    tool: "",
    qty: "1",
    notes: ""
  };

  function buildMessage(s) {
    return [
      "Olá, COMIFER (ASSTEC). Gostaria de um orçamento.",
      "",
      "Serviço: " + s.service,
      "Marca: " + s.brand,
      "Ferramenta/modelo: " + (s.tool || "(informar)"),
      "Problema: " + (s.notes || "(a avaliar)")
    ].join("\n");
  }

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function refreshQuote() {
    var preview = document.getElementById("quote-message");
    var link = document.getElementById("quote-wa-link");
    if (!preview || !link) return;
    var message = buildMessage(state);
    preview.textContent = message;
    link.href = waLink(message);
  }

  function selectChip(group, value) {
    state[group] = value;
    var chips = document.querySelectorAll('[data-chip="' + group + '"]');
    for (var i = 0; i < chips.length; i++) {
      var chip = chips[i];
      chip.setAttribute("aria-pressed", String(chip.getAttribute("data-value") === value));
    }
    refreshQuote();
  }

  function initChips() {
    var chips = document.querySelectorAll("[data-chip]");
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", function () {
        selectChip(this.getAttribute("data-chip"), this.getAttribute("data-value"));
      });
    }
  }

  function initFields() {
    var toolInput = document.getElementById("quote-tool");
    var qtyInput = document.getElementById("quote-qty");
    var notesInput = document.getElementById("quote-notes");
    if (toolInput) toolInput.addEventListener("input", function () { state.tool = this.value; refreshQuote(); });
    if (qtyInput) qtyInput.addEventListener("input", function () { state.qty = this.value; refreshQuote(); });
    if (notesInput) notesInput.addEventListener("input", function () { state.notes = this.value; refreshQuote(); });
  }

  var WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function getHoursStatus() {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      hourCycle: "h23",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
    var parts = {};
    fmt.formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var day = WEEKDAY_INDEX[parts.weekday];
    var minutes = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
    var open = day >= 1 && day <= 5 && ((minutes >= 480 && minutes < 720) || (minutes >= 810 && minutes < 1080));
    return {
      open: open,
      label: open ? "ABERTO AGORA" : "FECHADO AGORA",
      dot: open ? "#4f9a63" : "#b25a4e"
    };
  }

  function refreshHours() {
    var status = getHoursStatus();
    var dots = document.querySelectorAll(".hours-badge__dot");
    var labels = document.querySelectorAll(".hours-badge__label");
    for (var i = 0; i < dots.length; i++) dots[i].style.background = status.dot;
    for (var i = 0; i < labels.length; i++) labels[i].textContent = status.label;
  }

  // The reviews carousel only rotates on desktop, where three cards show at a
  // time and wrap around. On phones the track is a native scroll-snap row, so
  // the arrows and dots are hidden and --order is never applied.
  var REVIEWS_VISIBLE = 3;

  function initReviews() {
    var root = document.getElementById("avaliacoes");
    if (!root) return;
    var items = root.querySelectorAll(".reviews__item");
    var dots = root.querySelectorAll("[data-review-dot]");
    var position = root.querySelector(".reviews__position");
    var total = items.length;
    if (!total) return;

    var index = 0;
    // With three or fewer reviews the desktop grid already shows all of them,
    // so rotating would only shuffle the same cards. Controls hide themselves
    // and turn back on by themselves once a fourth review is added.
    var rotates = total > REVIEWS_VISIBLE;

    root.classList.add("reviews--js");
    if (!rotates) root.classList.add("reviews--static");

    function render() {
      if (!rotates) return;
      for (var i = 0; i < total; i++) {
        items[i].setAttribute("data-out", "");
        items[i].style.removeProperty("--order");
      }
      for (var k = 0; k < REVIEWS_VISIBLE && k < total; k++) {
        var item = items[(index + k) % total];
        item.removeAttribute("data-out");
        item.style.setProperty("--order", String(k));
      }
      for (var d = 0; d < dots.length; d++) {
        dots[d].setAttribute("aria-current", String(d === index));
      }
      if (position) position.textContent = (index + 1) + " / " + total;
    }

    function go(next) {
      index = ((next % total) + total) % total;
      render();
    }

    var prev = root.querySelector('[data-review-nav="prev"]');
    var next = root.querySelector('[data-review-nav="next"]');
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });
    for (var n = 0; n < dots.length; n++) {
      dots[n].addEventListener("click", function () {
        go(parseInt(this.getAttribute("data-review-dot"), 10));
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initChips();
    initFields();
    refreshQuote();
    refreshHours();
    initReviews();
  });
})();
