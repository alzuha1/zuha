const KEY = "site_config_v1";

const byId = (id) => document.getElementById(id);

async function fetchRepoConfig() {
  const res = await fetch("../config.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch config.json");
  return await res.json();
}

function loadLocal() {
  const saved = localStorage.getItem(KEY);
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
}

function saveLocal(cfg) {
  localStorage.setItem(KEY, JSON.stringify(cfg, null, 2));
}

function clearLocal() {
  localStorage.removeItem(KEY);
}

function fillForm(cfg) {
  byId("siteName").value = cfg.brand.siteName ?? "";
  byId("logoText").value = cfg.brand.logoText ?? "";
  byId("ctaTop").value = cfg.brand.ctaTop ?? "";

  byId("heroTitle").value = (cfg.hero.title ?? "");
  byId("heroSubtitle").value = (cfg.hero.subtitle ?? "");
  byId("heroImage").value = (cfg.hero.image ?? "");

  byId("s1v").value = cfg.stats?.[0]?.value ?? "";
  byId("s1l").value = cfg.stats?.[0]?.label ?? "";
  byId("s2v").value = cfg.stats?.[1]?.value ?? "";
  byId("s2l").value = cfg.stats?.[1]?.label ?? "";
  byId("s3v").value = cfg.stats?.[2]?.value ?? "";
  byId("s3l").value = cfg.stats?.[2]?.label ?? "";

  const imgs = (cfg.projects?.items ?? []).map(x => x.image).slice(0, 6);
  byId("projectsImages").value = imgs.join("\n");

  // contact cards
  const emailCard = cfg.contact.cards.find(c => c.icon === "mail");
  const phoneCard = cfg.contact.cards.find(c => c.icon === "phone");
  const pinCard = cfg.contact.cards.find(c => c.icon === "pin");

  byId("email").value = emailCard?.linkText ?? "";
  byId("phone").value = phoneCard?.linkText ?? "";
  byId("address").value = pinCard?.linkText ?? "";
}

function readForm(cfg) {
  cfg.brand.siteName = byId("siteName").value.trim();
  cfg.brand.logoText = byId("logoText").value.trim();
  cfg.brand.ctaTop = byId("ctaTop").value.trim();

  cfg.hero.title = byId("heroTitle").value;
  cfg.hero.subtitle = byId("heroSubtitle").value;
  cfg.hero.image = byId("heroImage").value.trim();

  cfg.stats = [
    { value: byId("s1v").value.trim(), label: byId("s1l").value.trim() },
    { value: byId("s2v").value.trim(), label: byId("s2l").value.trim() },
    { value: byId("s3v").value.trim(), label: byId("s3l").value.trim() }
  ];

  const lines = byId("projectsImages").value
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  cfg.projects.items = lines.map(image => ({ image }));

  // update contact
  cfg.contact.cards = cfg.contact.cards.map(c => {
    if (c.icon === "mail") {
      const mail = byId("email").value.trim();
      return { ...c, linkText: mail, href: mail ? `mailto:${mail}` : c.href };
    }
    if (c.icon === "phone") {
      const phone = byId("phone").value.trim();
      const tel = phone.replace(/\s+/g, "");
      return { ...c, linkText: phone, href: tel ? `tel:${tel}` : c.href };
    }
    if (c.icon === "pin") {
      const address = byId("address").value.trim();
      return { ...c, linkText: address };
    }
    return c;
  });

  return cfg;
}

function downloadJSON(cfg) {
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "config.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

(async function init(){
  let cfg = loadLocal();
  if (!cfg) cfg = await fetchRepoConfig();
  fillForm(cfg);

  byId("loadRepo").onclick = async () => {
    cfg = await fetchRepoConfig();
    fillForm(cfg);
    alert("تم تحميل الإعدادات من الريبو.");
  };

  byId("resetLocal").onclick = () => {
    clearLocal();
    alert("تم مسح الإعدادات المحلية. سيتم استخدام إعدادات الريبو عند فتح الموقع.");
  };

  byId("saveLocal").onclick = () => {
    cfg = readForm(cfg);
    saveLocal(cfg);
    alert("تم الحفظ محليًا. افتح الصفحة الرئيسية وسترى التغيير على جهازك.");
  };

  byId("exportJson").onclick = () => {
    cfg = readForm(cfg);
    downloadJSON(cfg);
  };
})();
