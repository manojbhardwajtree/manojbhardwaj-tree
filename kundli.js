let geoTimer = null;
window.lastGeneratedKundli = null;

function elTag(t, a, inner) {
  return "<" + t + (a ? " " + a : "") + ">" + (inner || "") + "<" + "/" + t + ">";
}

window.addEventListener("DOMContentLoaded", function() {
  const latEl = document.getElementById("kLat");
  const lonEl = document.getElementById("kLon");
  const placeEl = document.getElementById("kPlace");
  if (latEl) { latEl.type = "text"; latEl.placeholder = "e.g., 23.29° N"; }
  if (lonEl) { lonEl.type = "text"; lonEl.placeholder = "e.g., 76.20° E"; }
  if (placeEl) {
    placeEl.addEventListener("input", function() {
      clearTimeout(geoTimer);
      geoTimer = setTimeout(lookupCoords, 400);
    });
  }
});

function switchTab(t) {
  const kSec = document.getElementById("kundliSection");
  const fSec = document.getElementById("familySection");
  const kBtn = document.getElementById("tabKundliBtn");
  const fBtn = document.getElementById("tabFamilyBtn");
  if (kSec) kSec.style.display = t === "kundli" ? "block" : "none";
  if (fSec) fSec.style.display = t === "family" ? "block" : "none";
  if (kBtn) kBtn.classList.toggle("active", t === "kundli");
  if (fBtn) fBtn.classList.toggle("active", t === "family");
}

const CITIES = {
  "mumbai": new Array(19.08, 72.88), "thane": new Array(19.22, 72.98), "pune": new Array(18.52, 73.86),
  "delhi": new Array(28.61, 77.21), "new delhi": new Array(28.61, 77.21), "chandigarh": new Array(30.73, 76.78),
  "ludhiana": new Array(30.90, 75.86), "amritsar": new Array(31.63, 74.87), "jalandhar": new Array(31.33, 75.58),
  "patiala": new Array(30.34, 76.39), "punjab": new Array(31.15, 75.34), "haryana": new Array(29.06, 76.09),
  "jaipur": new Array(26.91, 75.79), "lucknow": new Array(26.85, 80.95), "varanasi": new Array(25.32, 82.97),
  "kolkata": new Array(22.57, 88.36), "chennai": new Array(13.08, 80.27), "bengaluru": new Array(12.97, 77.59),
  "hyderabad": new Array(17.39, 78.49), "ahmedabad": new Array(23.02, 72.57), "haridwar": new Array(29.95, 78.16)
};

function fmtLat(v) { return Math.abs(v).toFixed(2) + "° " + (v >= 0 ? "N" : "S"); }
function fmtLon(v) { return Math.abs(v).toFixed(2) + "° " + (v >= 0 ? "E" : "W"); }

function parseCoord(s, fallback) {
  if (!s) return fallback;
  const n = parseFloat(String(s).replace(/[^\d.-]/g, ""));
  if (isNaN(n)) return fallback;
  return (/[SW]/i.test(s) && n > 0) ? -n : n;
}

async function lookupCoords() {
  const placeEl = document.getElementById("kPlace");
  const st = document.getElementById("geoStatus");
  if (!placeEl) return;
  const raw = placeEl.value.trim();
  if (raw.length < 2) { if (st) st.textContent = ""; return; }
  const cityOnly = raw.toLowerCase().split(",").at(0).trim();
  const firstWord = raw.toLowerCase().split(/[\s,]+/).at(0) || "";
  const matchedKey = CITIES[cityOnly] ? cityOnly : (CITIES[firstWord] ? firstWord : null);
  if (matchedKey) {
    const c = CITIES[matchedKey];
    document.getElementById("kLat").value = fmtLat(c.at(0));
    document.getElementById("kLon").value = fmtLon(c.at(1));
    if (st) st.textContent = "✅ Detected: " + raw + " (" + fmtLat(c.at(0)) + ", " + fmtLon(c.at(1)) + ")";
    return;
  }
  if (st) st.textContent = "🔍 Searching coordinates for " + raw + "...";
  try {
    const url = "https://open-meteo.com" + encodeURIComponent(cityOnly);
    const r = await fetch(url);
    const d = r.ok ? await r.json() : null;
    if (d && d.results && d.results.length > 0) {
      const loc = d.results.at(0);
      document.getElementById("kLat").value = fmtLat(Number(loc.latitude));
      document.getElementById("kLon").value = fmtLon(Number(loc.longitude));
      if (st) st.textContent = "✅ Detected: " + loc.name + " (" + fmtLat(Number(loc.latitude)) + ", " + fmtLon(Number(loc.longitude)) + ")";
    } else if (st) {
      st.textContent = "⚠️ Location not auto-found. Enter Lat/Lon manually.";
    }
  } catch (e) {
    if (st) st.textContent = "⚠️ Lookup slow. Enter Lat/Lon manually.";
  }
}
const RASHIS = new Array("Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)");
const NAKS = new Array("Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati");
const NAK_LORDS = new Array("Ketu", "Shukra (Venus)", "Surya (Sun)", "Chandra (Moon)", "Mangal (Mars)", "Rahu", "Guru (Jupiter)", "Shani (Saturn)", "Budha (Mercury)");
const DASHA_YEARS = new Array(7, 20, 6, 10, 7, 18, 16, 19, 17);
const TITHIS = new Array("Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya");
const YOGAS = new Array("Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti");
const KARANAS = new Array("Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna");
const VARAS = new Array("Ravivara (Sunday)", "Somavara (Monday)", "Mangalavara (Tuesday)", "Budhavara (Wednesday)", "Guruvara (Thursday)", "Shukravara (Friday)", "Shanivara (Saturday)");

function norm(x) { return ((x % 360) + 360) % 360; }

function computeVimshottari(moonLon, birthYear) {
  const nakSpan = 360 / 27;
  const nakIdx = Math.floor(moonLon / nakSpan);
  const remFraction = 1 - ((moonLon % nakSpan) / nakSpan);
  const startLordIdx = nakIdx % 9;
  let runningYear = birthYear + (remFraction * DASHA_YEARS.at(startLordIdx));
  const nowYear = new Date().getFullYear() + (new Date().getMonth() / 12);
  let activeLord = NAK_LORDS.at(startLordIdx);
  let activeEnd = Math.round(runningYear);
  if (nowYear > runningYear) {
    for (let step = 1; step <= 18; step++) {
      const idx = (startLordIdx + step) % 9;
      const nextEnd = runningYear + DASHA_YEARS.at(idx);
      if (nowYear <= nextEnd) { activeLord = NAK_LORDS.at(idx); activeEnd = Math.round(nextEnd); break; }
      runningYear = nextEnd;
    }
  }
  return { birthLord: NAK_LORDS.at(startLordIdx), activeLord: activeLord, activeEnd: activeEnd };
}

function build12MonthForecast(mIdx, lIdx, dashaObj) {
  const timeline = new Array(
    { label: "Nov 2026", masa: "Kartika / Margashirsha", sunSign: 6, jupSign: 3, satSign: 11, color: "#1B5E20" },
    { label: "Dec 2026", masa: "Margashirsha / Pausha", sunSign: 7, jupSign: 3, satSign: 11, color: "#0D47A1" },
    { label: "Jan 2027", masa: "Pausha / Magha", sunSign: 8, jupSign: 3, satSign: 11, color: "#4A148C" },
    { label: "Feb 2027", masa: "Magha / Phalguna", sunSign: 9, jupSign: 3, satSign: 11, color: "#006064" },
    { label: "Mar 2027", masa: "Phalguna / Chaitra", sunSign: 10, jupSign: 3, satSign: 11, color: "#1B5E20" },
    { label: "Apr 2027", masa: "Chaitra / Vaishakha", sunSign: 11, jupSign: 3, satSign: 11, color: "#E65100" },
    { label: "May 2027", masa: "Vaishakha / Jyeshtha", sunSign: 0, jupSign: 3, satSign: 11, color: "#880E4F" },
    { label: "Jun 2027", masa: "Jyeshtha / Ashadha", sunSign: 1, jupSign: 4, satSign: 11, color: "#1B5E20" },
    { label: "Jul 2027", masa: "Ashadha / Shravana", sunSign: 2, jupSign: 4, satSign: 11, color: "#4E342E" },
    { label: "Aug 2027", masa: "Shravana / Bhadrapada", sunSign: 3, jupSign: 4, satSign: 11, color: "#0D47A1" },
    { label: "Sep 2027", masa: "Bhadrapada / Ashwin", sunSign: 4, jupSign: 4, satSign: 11, color: "#BF360C" },
    { label: "Oct 2027", masa: "Ashwin / Kartika", sunSign: 5, jupSign: 4, satSign: 11, color: "#1B5E20" }
  );
  const careerNotes = new Array("Surya Gochar energizes leadership and recognition.", "Financial planning and asset consolidation bring gains.", "Collaborative projects and communication open new doors.", "Focus on methodical execution; avoid impulsive expenses.", "Strong professional momentum; ideal for strategic steps.", "Review agreements carefully and consult trusted elders.");
  const familyNotes = new Array("Warm domestic harmony; auspicious for family rituals.", "Support from elders strengthens household peace.", "Short travels or gatherings with relatives bring joy.", "Practice patience in conversations; evening prayer restores calm.");
  const healthNotes = new Array("Good vitality; maintain morning Surya Namaskar and hydration.", "Prioritize digestive balance and restful sleep.", "Channel high energy into brisk walking and pranayama.");
  const ashtama = RASHIS.at((mIdx + 7) % 12).split(" ").at(0);
  const banner = elTag("div", 'class="forecast-summary-banner"', elTag("strong", "", "🌟 Annual Horoscope Overview (2026–2027): ") + "For " + elTag("strong", "", RASHIS.at(mIdx)) + " & " + elTag("strong", "", RASHIS.at(lIdx) + " Lagna") + ", your active " + elTag("strong", "", dashaObj.activeLord + " Mahadasha") + " (till ~" + dashaObj.activeEnd + ") favors steady growth and family harmony. " + elTag("em", "", "Chandrashtama Caution: ") + "Avoid major launches when Chandra transits " + elTag("strong", "", ashtama) + ".");
  let cards = "";
  timeline.forEach(function(item, idx) {
    const head = elTag("div", 'class="month-card-head"', elTag("span", 'class="month-title"', "📆 " + item.label) + elTag("span", 'class="masa-pill"', item.masa));
    const gochar = elTag("div", 'style="font-size:0.8em;color:#5C3A00;margin-bottom:5px;"', elTag("strong", "", "Gochar: ") + "Surya H" + (((item.sunSign - mIdx + 12) % 12) + 1) + " • Guru H" + (((item.jupSign - mIdx + 12) % 12) + 1) + " • Shani H" + (((item.satSign - mIdx + 12) % 12) + 1));
    const body = elTag("div", 'style="font-size:0.86em;line-height:1.42;color:#2B0500;"', elTag("strong", "", "💼 Career: ") + careerNotes.at((mIdx + idx) % 6) + "<br>" + elTag("strong", "", "🏡 Family: ") + familyNotes.at((lIdx + idx) % 4) + "<br>" + elTag("strong", "", "🌿 Health: ") + healthNotes.at((mIdx + idx) % 3));
    cards += elTag("div", 'class="month-card" style="border-top-color:' + item.color + ';"', head + gochar + body);
  });
  return banner + elTag("div", 'class="month-grid"', cards);
}
async function generateKundli() {
  const first = document.getElementById("kFirst").value.trim();
  const last = document.getElementById("kLast").value.trim();
  const dob = document.getElementById("kDob").value;
  const tob = document.getElementById("kTob").value || "08:45";
  const acc = document.getElementById("kTimeAcc").value;
  const sys = document.getElementById("kSystem").value;
  const place = document.getElementById("kPlace").value.trim() || "India";
  if (!first || !dob) { alert("Please enter First Name and Date of Birth."); return; }
  if (!document.getElementById("kLat").value || !document.getElementById("kLon").value) { await lookupCoords(); }
  const lat = parseCoord(document.getElementById("kLat").value, 28.61);
  const lon = parseCoord(document.getElementById("kLon").value, 77.21);
  const partsD = dob.split("-");
  const yr = Number(partsD.at(0)), mo = Number(partsD.at(1)), dy = Number(partsD.at(2));
  const partsT = tob.split(":");
  const hr = Number(partsT.at(0)), mn = Number(partsT.at(1));
  const utcMs = Date.UTC(yr, mo - 1, dy, hr, mn, 0) - (5.5 * 3600000);
  const d = (utcMs / 86400000) + 2440587.5 - 2451545.0;
  const istDate = new Date(Date.UTC(yr, mo - 1, dy, hr, mn, 0));
  const ayan = (sys === "KP" ? 23.852 : 23.857) + (d / 365.25) * 0.01397;
  const sun = norm(280.46 + 0.9856474 * d - ayan);
  const moon = norm(218.32 + 13.176396 * d - ayan);
  const mars = norm(355.43 + 0.5240207 * d - ayan);
  const merc = norm(252.25 + 4.0923344 * d - ayan);
  const jup = norm(34.35 + 0.0830912 * d - ayan);
  const ven = norm(181.98 + 1.6021302 * d - ayan);
  const sat = norm(50.08 + 0.0334596 * d - ayan);
  const rahu = norm(125.04 - 0.0529537 * d - ayan);
  const ketu = norm(rahu + 180);
  const lagna = norm(100.46 + 0.985647 * d + lon + (hr + mn / 60 - 5.5) * 15 - ayan + (lat - 23) * 0.35);
  const mIdx = Math.floor(moon / 30), sIdx = Math.floor(sun / 30), lIdx = Math.floor(lagna / 30);
  const nakIdx = Math.floor(moon / (360 / 27));
  const pada = Math.floor((moon % (360 / 27)) / (360 / 108)) + 1;
  const diff = norm(moon - sun), tNum = Math.floor(diff / 12);
  const grahas = new Array(
    { name: "Lagna (Ascendant)", lon: lagna, st: "Rising", bg: "#FFF3CD", fg: "#6E0000" },
    { name: "Surya (Sun)", lon: sun, st: "Direct", bg: "#FFE0B2", fg: "#BF360C" },
    { name: "Chandra (Moon)", lon: moon, st: "Direct", bg: "#E3F2FD", fg: "#0D47A1" },
    { name: "Mangal (Mars)", lon: mars, st: "Direct", bg: "#FFCDD2", fg: "#B71C1C" },
    { name: "Budha (Mercury)", lon: merc, st: "Direct", bg: "#C8E6C9", fg: "#1B5E20" },
    { name: "Guru (Jupiter)", lon: jup, st: "Direct", bg: "#FFF9C4", fg: "#827717" },
    { name: "Shukra (Venus)", lon: ven, st: "Direct", bg: "#F8BBD0", fg: "#880E4F" },
    { name: "Shani (Saturn)", lon: sat, st: "Direct", bg: "#D1C4E9", fg: "#311B92" },
    { name: "Rahu (North Node)", lon: rahu, st: "Retrograde", bg: "#CFD8DC", fg: "#263238" },
    { name: "Ketu (South Node)", lon: ketu, st: "Retrograde", bg: "#D7CCC8", fg: "#3E2723" }
  );
  let akPlanet = grahas.at(1);
  grahas.slice(1, 8).forEach(function(g) { if ((g.lon % 30) > (akPlanet.lon % 30)) akPlanet = g; });
  const dashaObj = computeVimshottari(moon, yr);
  document.getElementById("repSystem").textContent = sys === "KP" ? "KP (Krishnamurti Paddhati)" : "Lahiri (Chitrapaksha)";
  document.getElementById("repName").textContent = (first + " " + last).trim();
  document.getElementById("repDateTime").textContent = dob + " at " + tob;
  document.getElementById("repPlace").textContent = place;
  document.getElementById("repCoords").textContent = fmtLat(lat) + ", " + fmtLon(lon);
  document.getElementById("repAcc").textContent = acc;
  document.getElementById("repSamvat").textContent = "Vikram Samvat " + (yr + (mo >= 4 ? 57 : 56));
  document.getElementById("repVara").textContent = VARAS.at(istDate.getUTCDay());
  document.getElementById("repTithi").textContent = (tNum < 15 ? "Shukla Paksha - " : "Krishna Paksha - ") + TITHIS.at(tNum % 15);
  document.getElementById("repNakshatra").textContent = NAKS.at(nakIdx) + " (Pada " + pada + ")";
  document.getElementById("repYoga").textContent = YOGAS.at(Math.floor(norm(moon + sun) / (360 / 27))) + " | AK: " + akPlanet.name.split(" ").at(0);
  document.getElementById("repKarana").textContent = KARANAS.at(Math.floor(diff / 6) % 11) + " | Dasha: " + dashaObj.activeLord.split(" ").at(0);
  document.getElementById("repRashi").textContent = RASHIS.at(mIdx);
  document.getElementById("repSunSign").textContent = RASHIS.at(sIdx);
  document.getElementById("repLagna").textContent = RASHIS.at(lIdx);
  const pb = document.getElementById("repPlanets");
  pb.innerHTML = "";
  grahas.forEach(function(g) {
    const akBadge = g.name === akPlanet.name ? " " + elTag("span", 'style="background:#FFD700;color:#4A0202;padding:1px 5px;border-radius:6px;font-size:0.75em;font-weight:800;"', "AK") : "";
    const pBadge = elTag("span", 'class="p-badge" style="background:' + g.bg + ';color:' + g.fg + ';"', g.name) + akBadge;
    pb.innerHTML += elTag("tr", "", elTag("td", "", pBadge) + elTag("td", "", elTag("strong", "", RASHIS.at(Math.floor(g.lon / 30)))) + elTag("td", "", (g.lon % 30).toFixed(2) + "°") + elTag("td", "", NAKS.at(Math.floor(g.lon / (360 / 27)))) + elTag("td", "", g.st));
  });
  document.getElementById("repChartStyle").textContent = sys === "KP" ? "South Indian (Square)" : "North Indian (Diamond)";
  document.getElementById("chartContainer").innerHTML = sys === "KP" ? buildSouthChart(grahas) : buildNorthChart(lIdx, grahas);
  document.getElementById("repForecast").innerHTML = build12MonthForecast(mIdx, lIdx, dashaObj);
  window.lastGeneratedKundli = { rashi: RASHIS.at(mIdx), nakshatra: NAKS.at(nakIdx), pada: pada, lagna: RASHIS.at(lIdx), atmakaraka: akPlanet.name.split(" ").at(0) };
  document.getElementById("kundliReport").style.display = "block";
  document.getElementById("btnDownloadPdf").style.display = "inline-block";
  document.getElementById("btnPrintKundli").style.display = "inline-block";
  const pushBtn = document.getElementById("btnPushToFamily");
  if (pushBtn) pushBtn.style.display = "inline-block";
  document.getElementById("kundliReport").scrollIntoView({ behavior: "smooth" });
}

function buildNorthChart(lIdx, grahas) {
  const h = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.slice(1).forEach(function(g) { const idx = (Math.floor(g.lon / 30) - lIdx + 12) % 12; h[idx] = (h.at(idx) + " " + g.name.split(" ").at(0).slice(0, 2)).trim(); });
  const cx = new Array(150, 82, 38, 82, 38, 82, 150, 218, 262, 218, 262, 218);
  const cy = new Array(76, 38, 82, 150, 218, 262, 224, 262, 218, 150, 82, 38);
  let lbl = "";
  for (let i = 0; i < 12; i++) {
    lbl += elTag("text", 'x="' + cx.at(i) + '" y="' + (cy.at(i) - 6) + '" font-size="10" fill="#B30000" text-anchor="middle" font-weight="bold"', String(((lIdx + i) % 12) + 1));
    lbl += elTag("text", 'x="' + cx.at(i) + '" y="' + (cy.at(i) + 8) + '" font-size="9.5" fill="#1C0D02" font-weight="bold" text-anchor="middle"', h.at(i));
  }
  const innerSvg = elTag("rect", 'x="2" y="2" width="296" height="296" fill="#FFF9E6" stroke="#8B0000" stroke-width="2.5"', "") + elTag("line", 'x1="2" y1="2" x2="298" y2="298" stroke="#B8860B" stroke-width="1.5"', "") + elTag("line", 'x1="298" y1="2" x2="2" y2="298" stroke="#B8860B" stroke-width="1.5"', "") + elTag("polygon", 'points="150,2 298,150 150,298 2,150" fill="rgba(255,215,0,0.08)" stroke="#8B0000" stroke-width="1.8"', "") + lbl;
  return elTag("svg", 'viewBox="0 0 300 300" class="chart-svg"', innerSvg);
}

function buildSouthChart(grahas) {
  const s = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.forEach(function(g) { const idx = Math.floor(g.lon / 30); s[idx] = (s.at(idx) + " " + (g.name === "Lagna (Ascendant)" ? "Asc" : g.name.split(" ").at(0).slice(0, 2))).trim(); });
  const cols = new Array(1, 2, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0);
  const rows = new Array(0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 1, 0);
  let cells = "";
  for (let i = 0; i < 12; i++) {
    const x = cols.at(i) * 74 + 2, y = rows.at(i) * 74 + 2;
    cells += elTag("rect", 'x="' + x + '" y="' + y + '" width="74" height="74" fill="#FFFDF4" stroke="#8B0000" stroke-width="1.5"', "") + elTag("text", 'x="' + (x + 6) + '" y="' + (y + 14) + '" font-size="9" fill="#B30000" font-weight="bold"', String(i + 1)) + elTag("text", 'x="' + (x + 37) + '" y="' + (y + 42) + '" font-size="9.5" fill="#1C0D02" font-weight="bold" text-anchor="middle"', s.at(i));
  }
  const innerSvg = elTag("rect", 'x="2" y="2" width="296" height="296" fill="#F7E6B5" stroke="#8B0000" stroke-width="2.5"', "") + cells + elTag("text", 'x="150" y="154" font-size="12" fill="#8B0000" font-weight="bold" text-anchor="middle"', "KP RASHI");
  return elTag("svg", 'viewBox="0 0 300 300" class="chart-svg"', innerSvg);
}

function downloadKundliPDF() {
  const rep = document.getElementById("kundliReport");
  if (!rep || rep.style.display === "none") { alert("Please click Generate Kundli & Yearly Forecast first."); return; }
  const origTitle = document.title;
  document.title = (document.getElementById("kFirst").value.trim() || "Vedic") + "_Kundli_Report";
  window.print();
  setTimeout(function() { document.title = origTitle; }, 500);
}

function printKundliOnly() { downloadKundliPDF(); }

function copyKundliToFamilyForm() {
  switchTab("family");
  document.getElementById("mFirst").value = document.getElementById("kFirst").value;
  document.getElementById("mLast").value = document.getElementById("kLast").value;
  document.getElementById("mDob").value = document.getElementById("kDob").value;
  document.getElementById("mTob").value = document.getElementById("kTob").value;
  const mPob = document.getElementById("mPob");
  const k = window.lastGeneratedKundli;
  if (mPob) {
  const astroTag = k ? (" | " + k.rashi.split(" ").at(0) + ", " + k.nakshatra + " P" + k.pada + ", Lagna: " + k.lagna.split(" ").at(0) + ", AK: " + k.atmakaraka) : "";
mPob.value = document.getElementById("kPlace").value + " (" + document.getElementById("kSystem").value + ")" + astroTag;
}
window.pendingVedicMeta = k || null;
const fForm = document.getElementById("fForm");
if (fForm) fForm.scrollIntoView({ behavior: "smooth" });
}  
