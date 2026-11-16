/* galeri-masonry-3 — Galeri — Sahne ve Küçük Resimler (1 Kas 2026, T1-B varyant).
   Yer tutucular: gs3head gs3slides gs3thumbs gs3empty gs3sayac gs3tek. Veri: json.data[] = [{img, thumb?, title{}, alt{}, w, h}].
   Ortak yardımcılar: esc t guvenliHref gorselYol evet sayi metinleriYaz (desing metinleri kaçışlı). */
var D = json.desing || {};
var L = json.lang || "tr";

/* HTML kaçışı — html'e giden her değer bundan geçer */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* Dil seçimi: aktif dil → tr → en → ilk anahtar (motorun wmPickLang'i) */
function t(v) { return wmPickLang(v, L); }
/* Bağlantı: dış/mailto/tel/# aynen; iç sayfa adı → dil önekli yol; javascript: vb. reddedilir */
function guvenliHref(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s) || s.charAt(0) === "/") { return s; }
  return wxLangInternalHref(s);
}
/* Görsel yolu: "/" ve http(s) aynen; yalın ad → /img/<ad>; tehlikeli şema → "" */
function gorselYol(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}
function evet(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}
function sayi(v, d, mn, mx) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) { n = d; }
  return Math.min(mx, Math.max(mn, n));
}
/* desing'deki düz metin / {tr,en,ar} değerlerini {{anahtar}} yerine KAÇIŞLI yazar.
   Motor aynı yer tutucuyu ham yazardı; back.js önce davrandığı için kaçışsız değer html'e ulaşmaz. */
function metinleriYaz() {
  var k;
  for (k in D) {
    if (!Object.prototype.hasOwnProperty.call(D, k)) { continue; }
    var v = D[k];
    if (v == null) { continue; }
    var dilli = typeof v === "object" && !Array.isArray(v) && (typeof v.tr === "string" || typeof v.en === "string");
    if (typeof v === "object" && !dilli) { continue; }
    var deger = esc(t(v));
    var desen = new RegExp("\\{\\{" + String(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\}\\}", "g");
    html = html.replace(desen, function () { return deger; });
  }
}

var gs3Items = Array.isArray(json.data) ? json.data : [];
function gs3Dim(v, d) { var n = parseInt(v, 10); return isFinite(n) && n > 0 && n < 20000 ? n : d; }

var gs3Slides = "";
var gs3Thumbs = "";
var gs3N = 0;
var gs3i;
for (gs3i = 0; gs3i < gs3Items.length; gs3i++) {
  var it = gs3Items[gs3i] || {};
  var title = t(it.title);
  var alt = t(it.alt) || title;
  var full = gorselYol(it.img);
  var thumb = gorselYol(it.thumb) || full;
  var w = gs3Dim(it.w, 1600);
  var h = gs3Dim(it.h, 900);
  var ilk = gs3N === 0;
  var sahne = full
    ? '<img class="modulex-gs3-img" src="' + esc(full) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '" loading="' + (ilk ? "eager" : "lazy") + '" decoding="async" />'
    : '<span class="modulex-gs3-ph" role="img" aria-label="' + esc(alt) + '"><span class="material-symbols-outlined" aria-hidden="true">image</span></span>';
  gs3Slides += '<figure class="modulex-gs3-slide" data-gs3-i="' + gs3N + '"' + (ilk ? "" : " hidden") + ">" + sahne +
    (title ? '<figcaption class="modulex-gs3-cap">' + esc(title) + "</figcaption>" : "") + "</figure>";
  var kucuk = thumb
    ? '<img src="' + esc(thumb) + '" alt="" width="160" height="100" loading="lazy" decoding="async" />'
    : '<span class="material-symbols-outlined" aria-hidden="true">image</span>';
  var etiket = esc((gs3N + 1) + ". " + (alt || title));
  gs3Thumbs += "<li>" + (full
    ? '<a class="modulex-gs3-thumb" href="' + esc(full) + '" data-gs3-git="' + gs3N + '" aria-label="' + etiket + '"' + (ilk ? ' aria-current="true"' : "") + ">" + kucuk + "</a>"
    : '<button type="button" class="modulex-gs3-thumb" data-gs3-git="' + gs3N + '" aria-label="' + etiket + '"' + (ilk ? ' aria-current="true"' : "") + ">" + kucuk + "</button>") + "</li>";
  gs3N++;
}
var gs3Empty = gs3N ? "" : '<p class="modulex-gs3-bos">' + esc(t(D.emptyText)) + "</p>";
var gs3Head = (t(D.title) || t(D.description))
  ? '<header class="modulex-gs3-head">' + (t(D.title) ? '<h2 class="modulex-gs3-title">' + esc(t(D.title)) + "</h2>" : "") +
    (t(D.description) ? '<p class="modulex-gs3-desc">' + esc(t(D.description)) + "</p>" : "") + "</header>"
  : "";
var gs3Sayac = gs3N > 1 ? esc(t(D.counter).replace("{i}", "1").replace("{n}", String(gs3N))) : "";

html = html.replace(/\{\{gs3head\}\}/g, function () { return gs3Head; });
html = html.replace(/\{\{gs3slides\}\}/g, function () { return gs3Slides; });
html = html.replace(/\{\{gs3thumbs\}\}/g, function () { return gs3Thumbs; });
html = html.replace(/\{\{gs3empty\}\}/g, function () { return gs3Empty; });
html = html.replace(/\{\{gs3sayac\}\}/g, function () { return gs3Sayac; });
html = html.replace(/\{\{gs3tek\}\}/g, function () { return gs3N < 2 ? " modulex-gs3-tek" : ""; });
metinleriYaz();
