(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Toast
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1200);
  }

  // Copy buttons
  $$(".copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
        showToast("Copied");
      } catch (e) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Copied");
      }
    });
  });

  // Language toggle (simple i18n via data-en / data-ru)
  const langButtons = $$(".lang button");
  function setLang(lang){
    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("ef_lang", lang);
    langButtons.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));

    $$("[data-en][data-ru]").forEach(el => {
      el.textContent = (lang === "ru") ? el.getAttribute("data-ru") : el.getAttribute("data-en");
    });

    // For elements where we need HTML (e.g., strong tags inside)
    $$("[data-en-html][data-ru-html]").forEach(el => {
      el.innerHTML = (lang === "ru") ? el.getAttribute("data-ru-html") : el.getAttribute("data-en-html");
    });
  }

  const saved = localStorage.getItem("ef_lang");
  setLang(saved === "ru" ? "ru" : "en");
  langButtons.forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // Active link highlight
  const path = location.pathname.split("/").pop() || "index.html";
  $$(`.nav-links a`).forEach(a => {
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });

  // Smooth anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  });
})();