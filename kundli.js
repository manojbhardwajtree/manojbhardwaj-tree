let geoTimer = null;

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
  if (raw.length < 2) {
    if (st) st.textContent = "";
    return;
  }

  const cityOnly = raw.toLowerCase().split(",").at(0).trim();
  if (CITIES[cityOnly]) {
    const c = CITIES[cityOnly];
    document.getElementById("kLat").value = fmtLat(c.at(0));
    document.getElementById("kLon").value = fmtLon(c.at(1));
    if (st) st.textContent = "✅ Detected: " + raw + " (" + fmtLat(c.at(0)) + ", " + fmtLon(c.at(1)) + ")";
    return;
  }

  if (st) st.textContent = "🔍 Searching coordinates for " + raw + "...";
  try {
    const base = "https://" + "geocoding-api." + "open-meteo.com" + "/v1/search?count=1&language=en&format=json&name=";
    let r = await fetch(base + encodeURIComponent(raw));
    let d = r.ok ? await r.json() : null;

    if ((!d || !d.results || d.results.length === 0) && raw.indexOf(",") !== -1) {
      r = await fetch(base + encodeURIComponent(cityOnly));
      d = r.ok ? await r.json() : null;
    }

    if (d && d.results && d.results.length > 0) {
      const loc = d.results.at(0);
      const latVal = Number(loc.latitude);
      const lonVal = Number(loc.longitude);
      const label = [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ");
      document.getElementById("kLat").value = fmtLat(latVal);
      document.getElementById("kLon").value = fmtLon(lonVal);
      if (st) st.textContent = "✅ Detected: " + label + " (" + fmtLat(latVal) + ", " + fmtLon(lonVal) + ")";
    } else {
      if (st) st.textContent = "⚠️ Location not auto-found. Try City + State (e.g., Pune, Maharashtra).";
    }
  } catch (e) {
    if (st) st.textContent = "⚠️ Lookup slow. Enter Lat/Lon manually if needed.";
  }
} 
const RASHIS = new Array("Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)");
const NAKS = new Array("Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati");
const TITHIS = new Array("Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya");
const YOGAS = new Array("Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti");
const KARANAS = new Array("Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna");
const VARAS = new Array("Ravivara (Sunday)", "Somavara (Monday)", "Mangalavara (Tuesday)", "Budhavara (Wednesday)", "Guruvara (Thursday)", "Shukravara (Friday)", "Shanivara (Saturday)");

function norm(x) { return ((x % 360) + 360) % 360; }

async function generateKundli() {
  const first = document.getElementById("kFirst").value.trim();
  const last = document.getElementById("kLast").value.trim();
  const dob = document.getElementById("kDob").value;
  const tob = document.getElementById("kTob").value || "08:45";
  const acc = document.getElementById("kTimeAcc").value;
  const sys = document.getElementById("kSystem").value;
  const place = document.getElementById("kPlace").value.trim() || "India";

  if (!first || !dob) {
    alert("Please enter First Name and Date of Birth.");
    return;
  }

  if (!document.getElementById("kLat").value || !document.getElementById("kLon").value) {
    await lookupCoords();
  }
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

  const mIdx = Math.floor(moon / 30);
  const sIdx = Math.floor(sun / 30);
  const lIdx = Math.floor(lagna / 30);
  const nakIdx = Math.floor(moon / (360 / 27));
  const pada = Math.floor((moon % (360 / 27)) / (360 / 108)) + 1;
  const diff = norm(moon - sun);
  const tNum = Math.floor(diff / 12);

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
  document.getElementById("repYoga").textContent = YOGAS.at(Math.floor(norm(moon + sun) / (360 / 27)));
  document.getElementById("repKarana").textContent = KARANAS.at(Math.floor(diff / 6) % 11);
  document.getElementById("repRashi").textContent = RASHIS.at(mIdx);
  document.getElementById("repSunSign").textContent = RASHIS.at(sIdx);
  document.getElementById("repLagna").textContent = RASHIS.at(lIdx);
  const grahas = new Array(
    { name: "Lagna (Ascendant)", lon: lagna, st: "Rising" },
    { name: "Surya (Sun)", lon: sun, st: "Direct" },
    { name: "Chandra (Moon)", lon: moon, st: "Direct" },
    { name: "Mangal (Mars)", lon: mars, st: "Direct" },
    { name: "Budha (Mercury)", lon: merc, st: "Direct" },
    { name: "Guru (Jupiter)", lon: jup, st: "Direct" },
    { name: "Shukra (Venus)", lon: ven, st: "Direct" },
    { name: "Shani (Saturn)", lon: sat, st: "Direct" },
    { name: "Rahu (North Node)", lon: rahu, st: "Retrograde" },
    { name: "Ketu (South Node)", lon: ketu, st: "Retrograde" }
  );

  const pb = document.getElementById("repPlanets");
  pb.innerHTML = "";
  grahas.forEach(function(g) {
    pb.innerHTML += "<tr><td><strong>" + g.name + "</strong></td><td>" + RASHIS.at(Math.floor(g.lon / 30)) + "</td><td>" + (g.lon % 30).toFixed(2) + "°</td><td>" + NAKS.at(Math.floor(g.lon / (360 / 27))) + "</td><td>" + g.st + "</td></tr>";
  });

  document.getElementById("repChartStyle").textContent = sys === "KP" ? "South Indian (Square)" : "North Indian (Diamond)";
  document.getElementById("chartContainer").innerHTML = sys === "KP" ? buildSouthChart(grahas) : buildNorthChart(lIdx, grahas);

  const fc = new Array(
    "<strong>Career & Finance:</strong> Steady expansion in leadership and family enterprise; favorable quarters for long-term investments.<br><strong>Family & Harmony:</strong> Stronger bonding with elders and ancestral roots; auspicious family gatherings indicated.<br><strong>Health & Guidance:</strong> Maintain disciplined morning routines and balanced diet.",
    "<strong>Career & Finance:</strong> Recognition for methodical work and property/asset stability.<br><strong>Family & Harmony:</strong> Supportive domestic environment; good period for resolving past misunderstandings.<br><strong>Health & Guidance:</strong> Focus on throat/respiratory care during seasonal shifts.",
    "<strong>Career & Finance:</strong> New communication channels, writing, or advisory opportunities flourish.<br><strong>Family & Harmony:</strong> Short travels with siblings and relatives bring joy.<br><strong>Health & Guidance:</strong> Prioritize restful sleep and nervous system calm."
  );
  document.getElementById("repForecast").innerHTML = "<p style='margin:0 0 6px 0;'><strong>Chandra Rashi (" + RASHIS.at(mIdx) + ") &amp; Lagna (" + RASHIS.at(lIdx) + ") Yearly Outlook:</strong></p>" + fc.at(mIdx % 3);

  document.getElementById("kundliReport").style.display = "block";
  document.getElementById("btnDownloadPdf").style.display = "inline-block";
  document.getElementById("btnPrintKundli").style.display = "inline-block";
  const pushBtn = document.getElementById("btnPushToFamily");
  if (pushBtn && typeof currentRole !== "undefined" && currentRole) {
    pushBtn.style.display = "inline-block";
  }
  document.getElementById("kundliReport").scrollIntoView({ behavior: "smooth" });
}

function buildNorthChart(lIdx, grahas) {
  const h = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.slice(1).forEach(function(g) {
    const idx = (Math.floor(g.lon / 30) - lIdx + 12) % 12;
    h[idx] = (h.at(idx) + " " + g.name.split(" ").at(0).slice(0, 2)).trim();
  });
  const cx = new Array(150, 82, 38, 82, 38, 82, 150, 218, 262, 218, 262, 218);
  const cy = new Array(76, 38, 82, 150, 218, 262, 224, 262, 218, 150, 82, 38);
  let lbl = "";
  for (let i = 0; i < 12; i++) {
    lbl += '<text x="' + cx.at(i) + '" y="' + (cy.at(i) - 6) + '" font-size="10" fill="#6E0000" text-anchor="middle" font-weight="bold">' + (((lIdx + i) % 12) + 1) + '</text>';
    lbl += '<text x="' + cx.at(i) + '" y="' + (cy.at(i) + 8) + '" font-size="9" fill="#1C0D02" text-anchor="middle">' + h.at(i) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#FFFDF4" stroke="#6E0000" stroke-width="2"/><line x1="2" y1="2" x2="298" y2="298" stroke="#6E0000" stroke-width="1.5"/><line x1="298" y1="2" x2="2" y2="298" stroke="#6E0000" stroke-width="1.5"/><polygon points="150,2 298,150 150,298 2,150" fill="none" stroke="#6E0000" stroke-width="1.5"/>' + lbl + '</svg>';
}

function buildSouthChart(grahas) {
  const s = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.forEach(function(g) {
    const idx = Math.floor(g.lon / 30);
    s[idx] = (s.at(idx) + " " + (g.name === "Lagna (Ascendant)" ? "Asc" : g.name.split(" ").at(0).slice(0, 2))).trim();
  });
  const cols = new Array(1, 2, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0);
  const rows = new Array(0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 1, 0);
  let cells = "";
  for (let i = 0; i < 12; i++) {
    const x = cols.at(i) * 74 + 2;
    const y = rows.at(i) * 74 + 2;
    cells += '<rect x="' + x + '" y="' + y + '" width="74" height="74" fill="#FFFDF4" stroke="#6E0000" stroke-width="1.5"/><text x="' + (x + 6) + '" y="' + (y + 14) + '" font-size="9" fill="#6E0000" font-weight="bold">' + (i + 1) + '</text><text x="' + (x + 37) + '" y="' + (y + 42) + '" font-size="9" fill="#1C0D02" text-anchor="middle">' + s.at(i) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#F7E6B5" stroke="#6E0000" stroke-width="2"/>' + cells + '<text x="150" y="154" font-size="12" fill="#6E0000" font-weight="bold" text-anchor="middle">KP RASHI</text></svg>';

  const w = window.open("", "_blank", "width=850,height=900");
  if (!w) {
    alert("Pop-up blocked! Please allow pop-ups for this site to print the Kundli.");
    return;}  
 function downloadKundliPDF() {
  const el = document.getElementById("kundliReport");
  const fname = (document.getElementById("kFirst").value.trim() || "Kundli") + "_Vedic_Kundli.pdf";
  const opt = {
    margin: 8,
    filename: fname,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  if (typeof html2pdf !== "undefined") {
    html2pdf().set(opt).from(el).save();
    return;
  }

  const s = document.createElement("script");
  s.src = "https://" + "cdnjs" + ".cloudflare" + ".com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
  s.onload = function() {
    html2pdf().set(opt).from(el).save();
  };
  s.onerror = function() {
    alert("Could not load PDF library. Please check your internet connection or use Print Kundli.");
  };
  document.head.appendChild(s);
} 

function printKundliOnly() {
  }
  w.document.write("<html><head><title>Print Kundli</title><style>body{font-family:Arial;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #6E0000;padding:6px;text-align:left;}th{background:#F7E6B5;}.k-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}.chart-svg{max-width:280px;display:block;margin:auto;}</style></head><body>" + document.getElementById("kundliReport").innerHTML + "</body></html>");
  w.document.close();
  w.focus();
  setTimeout(function() { w.print(); }, 250);
}

function copyKundliToFamilyForm() {
  switchTab("family");
  document.getElementById("mFirst").value = document.getElementById("kFirst").value;
  document.getElementById("mLast").value = document.getElementById("kLast").value;
  document.getElementById("mDob").value = document.getElementById("kDob").value;
  document.getElementById("mTob").value = document.getElementById("kTob").value;
  const mPob = document.getElementById("mPob");
  if (mPob) {
    mPob.value = document.getElementById("kPlace").value + " (" + document.getElementById("kSystem").value + ")";
  }
  const fForm = document.getElementById("fForm");
  if (fForm) fForm.scrollIntoView({ behavior: "smooth" });
 }
 
