/* Psicóloga Kauana Abrão — interações do site */
(function () {
  "use strict";

  var WA_NUMBER = "5541998944573";

  /* Nav: hairline once the page scrolls */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menu sheet */
  var sheet = document.getElementById("menu");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  function setSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle("is-open", open);
    sheet.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) sheet.removeAttribute("inert"); else sheet.setAttribute("inert", "");
    document.body.classList.toggle("sheet-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && closeBtn) closeBtn.focus({ preventScroll: true });
    if (!open && openBtn) openBtn.focus({ preventScroll: true });
  }
  if (openBtn) openBtn.addEventListener("click", function () { setSheet(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setSheet(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet && sheet.classList.contains("is-open")) setSheet(false);
  });

  /* Contact form → composes a WhatsApp message (no data is stored anywhere) */
  var form = document.getElementById("contato-form");
  if (!form) return;
  var status = form.querySelector(".form__status");
  var submit = form.querySelector("button[type=submit]");

  function fieldError(name, msg) {
    var input = form.elements[name];
    var wrap = input.closest(".field");
    var err = wrap.querySelector(".field__error");
    wrap.setAttribute("data-invalid", msg ? "true" : "false");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg || "";
    return !msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.elements.nome.value.trim();
    var idade = form.elements.idade.value;
    var ok = fieldError("nome", nome ? "" : "Como posso te chamar?");
    ok = fieldError("idade", idade ? "" : "Escolha uma opção.") && ok;
    if (!ok) {
      status.removeAttribute("data-state");
      status.textContent = "Faltou um detalhe — veja os campos acima.";
      var first = form.querySelector("[aria-invalid=true]");
      if (first) first.focus();
      return;
    }

    var periodo = form.elements.periodo.value;
    var msg = form.elements.mensagem.value.trim();
    var text = "Olá, Kauana! Vim pelo site e gostaria de agendar uma sessão.\n\n" +
      "Nome: " + nome + "\n" +
      "Faixa de idade: " + idade + "\n" +
      (periodo ? "Melhor período: " + periodo + "\n" : "") +
      (msg ? "\n" + msg : "");

    submit.setAttribute("data-state", "loading");
    submit.setAttribute("aria-disabled", "true");
    status.removeAttribute("data-state");
    status.textContent = "Abrindo o WhatsApp…";

    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
    var win = window.open(url, "_blank", "noopener");
    setTimeout(function () {
      submit.removeAttribute("data-state");
      submit.removeAttribute("aria-disabled");
      status.setAttribute("data-state", "success");
      if (win) {
        status.textContent = "Sua mensagem está pronta no WhatsApp — é só tocar em enviar.";
      } else {
        status.innerHTML = 'O navegador bloqueou a nova aba. <a class="link" href="' + url + '" target="_blank" rel="noopener">Abrir o WhatsApp</a>';
      }
    }, 400);
  });

  ["nome", "idade"].forEach(function (n) {
    form.elements[n].addEventListener("input", function () { fieldError(n, ""); });
  });
})();
