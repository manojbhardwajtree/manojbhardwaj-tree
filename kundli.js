function switchTab(tab) {
  document.getElementById("kundliSection").style.display = tab === "kundli" ? "block" : "none";
  document.getElementById("familySection").style.display = tab === "family" ? "block" : "none";
  document.getElementById("tabKundliBtn").classList.toggle("active", tab === "kundli");
  document.getElementById("tabFamilyBtn").classList.toggle("active", tab === "family");
}

async function lookupCoords() {
  const place = document.getElementById("kPlace").value.trim();
  const statusEl = document.getElementById("geoStatus");
  if (!place) return;
  statusEl.textContent = "🔍 Looking up coordinates for " + place + "...";
  try {
    const res = await fetch("https://open-meteo.com" + encodeURIComponent(place) + "&count=1&language=en&format=json");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const loc = data.results.at(0);
      document.getElementById("kLat").value = Number(loc.latitude).toFixed(4);
      document.getElementById("kLon").value = Number(loc.longitude).toFixed(4);
      statusEl.textContent = "✅ Detected: " + loc.name + ", " + (loc.country || "") + " (" + Number(loc.latitude).toFixed(4) + "° N, " + Number(loc.longitude).toFixed(4) + "° E)";
    } else {
      statusEl.textContent = "⚠️ City not auto-found. Try a nearby major city or enter Lat & Lon manually.";
    }
  } catch (err) {
    statusEl.textContent = "⚠️ Lookup unavailable. Enter Latitude & Longitude manually if needed.";
  }
}

const RASHIS = new Array("Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)");
const NAKSHATRAS = new Array("Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati");
const TITHIS = new Array("Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya");
const YOGAS = new Array("Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti");
const KARANAS = new Array("Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna");
const VARAS = new Array("Ravivara (Sunday)", "Somavara (Monday)", "Mangalavara (Tuesday)", "Budhavara (Wednesday)", "Guruvara (Thursday)", "Shukravara (Friday)", "Shanivara (Saturday)");

function norm360(deg) {
  return ((deg % 360) + 360) % 360;
}

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
  const lat = parseFloat(document.getElementById("kLat").value) || 28.6139;
  const lon = parseFloat(document.getElementById("kLon").value) || 77.2090;

  const dt = new Date(dob + "T" + tob + ":00");
  const jd = (dt.getTime() / 86400000) + 2440587.5 - (5.5 / 24);
  const d = jd - 2451545.0;
  const ayanamsa = (sys === "KP" ? 23.852 : 23.857) + (d / 365.25) * 0.01397;

  const sunLon = norm360(280.460 + 0.9856474 * d - ayanamsa);
  const moonLon = norm360(218.316 + 13.176396 * d - ayanamsa);
  const marsLon = norm360(355.433 + 0.5240207 * d - ayanamsa);
  const mercLon = norm360(252.251 + 4.0923344 * d - ayanamsa);
  const jupLon = norm360(34.351 + 0.0830912 * d - ayanamsa);
  const venLon = norm360(181.979 + 1.6021302 * d - ayanamsa);
  const satLon = norm360(50.077 + 0.0334596 * d - ayanamsa);
  const rahuLon = norm360(125.044 - 0.0529537 * d - ayanamsa);
  const ketuLon = norm360(rahuLon + 180);

  const lst = norm360(100.46 + 0.985647 * d + lon + (dt.getHours() + dt.getMinutes() / 60 - 5.5) * 15);
  const lagnaLon = norm360(lst - ayanamsa + (lat - 23) * 0.35);

  const moonSignIdx = Math.floor(moonLon / 30);
  const sunSignIdx = Math.floor(sunLon / 30);
  const lagnaIdx = Math.floor(lagnaLon / 30);
  const nakIdx = Math.floor(moonLon / (360 / 27));
  const pada = Math.floor((moonLon % (360 / 27)) / (360 / 108)) + 1;

  const diffMoonSun = norm360(moonLon - sunLon);
  const tithiNum = Math.floor(diffMoonSun / 12);
  const paksha = tithiNum < 15 ? "Shukla Paksha" : "Krishna Paksha";
  const tithiName = TITHIS.at(tithiNum % 15);
  const yogaName = YOGAS.at(Math.floor(norm360(moonLon + sunLon) / (360 / 27)));
  const karanaName = KARANAS.at(Math.floor(diffMoonSun / 6) % 11);
  const samvat = dt.getFullYear() + (dt.getMonth() >= 3 ? 57 : 56);

  document.getElementById("repSystem").textContent = sys === "KP" ? "KP (Krishnamurti Paddhati)" : "Lahiri (Chitrapaksha)";
  document.getElementById("repName").textContent = first + " " + last;
  document.getElementById("repDateTime").textContent = dob + " at " + tob;
  document.getElementById("repPlace").textContent = place;
  document.getElementById("repCoords").textContent = lat.toFixed(4) + "° N, " + lon.toFixed(4) + "° E";
  document.getElementById("repAcc").textContent = acc;
  document.getElementById("repSamvat").textContent = "Vikram Samvat " + samvat;
  document.getElementById("repVara").textContent = VARAS.at(dt.getDay());
  document.getElementById("repTithi").textContent = paksha + " - " + tithiName;
  document.getElementById("repNakshatra").textContent = NAKSHATRAS.at(nakIdx) + " (Pada " + pada + ")";
  document.getElementById("repYoga").textContent = yogaName;
  document.getElementById("repKarana").textContent = karanaName;
  document.getElementById("repRashi").textContent = RASHIS.at(moonSignIdx);
  document.getElementById("repSunSign").textContent = RASHIS.at(sunSignIdx);
  document.getElementById("repLagna").textContent = RASHIS.at(lagnaIdx);
   const grahas = new Array(
    { name: "Lagna (Ascendant)", lon: lagnaLon, status: "Rising" },
    { name: "Surya (Sun)", lon: sunLon, status: "Direct" },
    { name: "Chandra (Moon)", lon: moonLon, status: "Direct" },
    { name: "Mangal (Mars)", lon: marsLon, status: "Direct" },
    { name: "Budha (Mercury)", lon: mercLon, status: "Direct" },
    { name: "Guru (Jupiter)", lon: jupLon, status: "Direct" },
    { name: "Shukra (Venus)", lon: venLon, status: "Direct" },
    { name: "Shani (Saturn)", lon: satLon, status: "Direct" },
    { name: "Rahu (North Node)", lon: rahuLon, status: "Retrograde" },
    { name: "Ketu (South Node)", lon: ketuLon, status: "Retrograde" }
  );

  const pBody = document.getElementById("repPlanets");
  pBody.innerHTML = "";
  grahas.forEach(function(g) {
    const sIdx = Math.floor(g.lon / 30);
    const deg = (g.lon % 30).toFixed(2);
    const nIdx = Math.floor(g.lon / (360 / 27));
    pBody.innerHTML += "<tr><td><strong>" + g.name + "</strong></td><td>" + RASHIS.at(sIdx) + "</td><td>" + deg + "°</td><td>" + NAKSHATRAS.at(nIdx) + "</td><td>" + g.status + "</td></tr>";
  });

  document.getElementById("repChartStyle").textContent = sys === "KP" ? "South Indian (Square)" : "North Indian (Diamond)";
  document.getElementById("chartContainer").innerHTML = sys === "KP" ? buildSouthChart(grahas) : buildNorthChart(lagnaIdx, grahas);

  const forecasts = new Array(
    "<strong>Career & Finance:</strong> Steady expansion in leadership and family enterprise; favorable quarters for long-term investments.<br><strong>Family & Harmony:</strong> Stronger bonding with elders and ancestral roots; auspicious family gatherings indicated.<br><strong>Health & Guidance:</strong> Maintain disciplined morning routines and balanced diet.",
    "<strong>Career & Finance:</strong> Recognition for methodical work and property/asset stability.<br><strong>Family & Harmony:</strong> Supportive domestic environment; good period for resolving past misunderstandings.<br><strong>Health & Guidance:</strong> Focus on throat/respiratory care during seasonal shifts.",
    "<strong>Career & Finance:</strong> New communication channels, writing, or advisory opportunities flourish.<br><strong>Family & Harmony:</strong> Short travels with siblings and relatives bring joy.<br><strong>Health & Guidance:</strong> Prioritize restful sleep and nervous system calm."
  );
  document.getElementById("repForecast").innerHTML = "<p style='margin:0 0 6px 0;'><strong>Chandra Rashi (" + RASHIS.at(moonSignIdx) + ") &amp; Lagna (" + RASHIS.at(lagnaIdx) + ") Yearly Outlook:</strong></p>" + forecasts.at(moonSignIdx % 3);

  document.getElementById("kundliReport").style.display = "block";
  document.getElementById("btnDownloadPdf").style.display = "inline-block";
  document.getElementById("btnPrintKundli").style.display = "inline-block";
  if (typeof currentRole !== "undefined" && currentRole) {
    document.getElementById("btnPushToFamily").style.display = "inline-block";
  }
  document.getElementById("kundliReport").scrollIntoView({ behavior: "smooth" });
}

function buildNorthChart(lagnaIdx, grahas) {
  const houses = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.slice(1).forEach(function(g) {
    const sIdx = Math.floor(g.lon / 30);
    const h = (sIdx - lagnaIdx + 12) % 12;
    const abbr = g.name.split(" ").at(0).slice(0, 2);
    houses[h] = (houses.at(h) + " " + abbr).trim();
  });
  const cx = new Array(150, 82, 38, 82, 38, 82, 150, 218, 262, 218, 262, 218);
  const cy = new Array(76, 38, 82, 150, 218, 262, 224, 262, 218, 150, 82, 38);
  let labels = "";
  for (let idx = 0; idx < 12; idx++) {
    const signNum = ((lagnaIdx + idx) % 12) + 1;
    labels += '<text x="' + cx.at(idx) + '" y="' + (cy.at(idx) - 6) + '" font-size="10" fill="#6E0000" text-anchor="middle" font-weight="bold">' + signNum + '</text>';
    labels += '<text x="' + cx.at(idx) + '" y="' + (cy.at(idx) + 8) + '" font-size="9" fill="#1C0D02" text-anchor="middle">' + houses.at(idx) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#FFFDF4" stroke="#6E0000" stroke-width="2"/><line x1="2" y1="2" x2="298" y2="298" stroke="#6E0000" stroke-width="1.5"/><line x1="298" y1="2" x2="2" y2="298" stroke="#6E0000" stroke-width="1.5"/><polygon points="150,2 298,150 150,298 2,150" fill="none" stroke="#6E0000" stroke-width="1.5"/>' + labels + '</svg>';
}

function buildSouthChart(grahas) {
  const signs = new Array("", "", "", "", "", "", "", "", "", "", "", "");
  grahas.forEach(function(g) {
    const sIdx = Math.floor(g.lon / 30);
    const abbr = g.name === "Lagna (Ascendant)" ? "Asc" : g.name.split(" ").at(0).slice(0, 2);
    signs[sIdx] = (signs.at(sIdx) + " " + abbr).trim();
  });
  const cols = new Array(1, 2, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0);
  const rows = new Array(0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 1, 0);
  let cells = "";
  for (let sIdx = 0; sIdx < 12; sIdx++) {
    const x = cols.at(sIdx) * 74 + 2;
    const y = rows.at(sIdx) * 74 + 2;
    cells += '<rect x="' + x + '" y="' + y + '" width="74" height="74" fill="#FFFDF4" stroke="#6E0000" stroke-width="1.5"/>';
    cells += '<text x="' + (x + 6) + '" y="' + (y + 14) + '" font-size="9" fill="#6E0000" font-weight="bold">' + (sIdx + 1) + '</text>';
    cells += '<text x="' + (x + 37) + '" y="' + (y + 42) + '" font-size="9" fill="#1C0D02" text-anchor="middle">' + signs.at(sIdx) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#F7E6B5" stroke="#6E0000" stroke-width="2"/>' + cells + '<text x="150" y="154" font-size="12" fill="#6E0000" font-weight="bold" text-anchor="middle">KP RASHI</text></svg>';
}

function downloadKundliPDF() {
  const el = document.getElementById("kundliReport");
  const name = (document.getElementById("kFirst").value.trim() || "Kundli") + "_Vedic_Kundli.pdf";
  html2pdf().set({ margin: 8, filename: name, html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" } }).from(el).save();
}

function printKundliOnly() {
  const content = document.getElementById("kundliReport").innerHTML;
  const w = window.open("", "", "width=850,height=900");
  w.document.write("<html><head><title>Print Kundli</title><style>body{font-family:Arial;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #6E0000;padding:6px;text-align:left;}th{background:#F7E6B5;}.k-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}.chart-svg{max-width:280px;display:block;margin:auto;}</style></head><body>" + content + "</body></html>");
  w.document.close();
  w.print();
}

function copyKundliToFamilyForm() {
  switchTab("family");
  document.getElementById("mFirst").value = document.getElementById("kFirst").value;
  document.getElementById("mLast").value = document.getElementById("kLast").value;
  document.getElementById("mDob").value = document.getElementById("kDob").value;
  document.getElementById("mTob").value = document.getElementById("kTob").value;
  document.getElementById("mPob").value = document.getElementById("kPlace").value + " (" + document.getElementById("kSystem").value + ")";
  document.getElementById("fForm").scrollIntoView({ behavior: "smooth" });
}
