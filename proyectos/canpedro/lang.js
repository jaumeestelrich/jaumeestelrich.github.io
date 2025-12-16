// lang.js
const SUPPORTED = ["es","ca","en","fr","de","it"];

async function loadLanguage(lang) {
    lang = lang.toLowerCase();
    if (!SUPPORTED.includes(lang)) lang = "es";

    try {
        const res = await fetch(`lang/${lang}.json`);
        if (!res.ok) throw new Error("No se pudo cargar el JSON de idioma");
        const data = await res.json();

        // texto simple
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.getAttribute("data-lang");
            if (data[key] !== undefined) {
                if (el.tagName.toLowerCase() === "title") {
                    document.title = data[key];
                } else {
                    el.textContent = data[key];
                }
            }
        });

        // atributos (alt, placeholder, etc.) con data-lang-attr="key|attr"
        document.querySelectorAll("[data-lang-attr]").forEach(el => {
            const spec = el.getAttribute("data-lang-attr"); // ex: "logo_alt|alt"
            const [key, attr] = spec.split("|");
            if (data[key] !== undefined) el.setAttribute(attr, data[key]);
        });

        // marcar idioma activo visualmente
        document.querySelectorAll("[data-lang-btn]").forEach(btn => {
            btn.classList.toggle("active-lang", btn.getAttribute("data-lang-btn").toLowerCase() === lang);
        });

        // guardar elección
        localStorage.setItem("lang", lang);
    } catch (err) {
        console.error("Error cargando idioma:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Cargar español por defecto o idioma guardado
    const savedLang = localStorage.getItem("lang") || "es";
    loadLanguage(savedLang);

    // conectar botones de idioma
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang-btn").toLowerCase();
            loadLanguage(lang);
        });
    });

    // resaltar item de menú activo
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === current);
    });
});
