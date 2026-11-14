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
  grahas.slice(1, 8).forEach(function(g) {
    if ((g.lon % 30) > (akPlanet.lon % 30)) akPlanet = g;
  });

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
    const isAK = g.name === akPlanet.name ? ' <span style="background:#FFD700;color:#4A0202;padding:1px 5px;border-radius:6px;font-size:0.75em;font-weight:800;">AK</span>' : "";
    pb.innerHTML += "<tr>" +
      "<td><span class='p-badge' style='background:" + g.bg + ";color:" + g.fg + ";'>" + g.name + "</span>" + isAK + "</td>" +
      "<td><strong>" + RASHIS.at(Math.floor(g.lon / 30)) + "</strong></td>" +
      "<td>" + (g.lon % 30).toFixed(2) + "°</td>" +
      "<td>" + NAKS.at(Math.floor(g.lon / (360 / 27))) + "</td>" +
      "<td>" + g.st + "</td>" +
    "</tr>";
  });

  document.getElementById("repChartStyle").textContent = sys === "KP" ? "South Indian (Square)" : "North Indian (Diamond)";
  document.getElementById("chartContainer").innerHTML = sys === "KP" ? buildSouthChart(grahas) : buildNorthChart(lIdx, grahas);

  document.getElementById("repForecast").innerHTML = build12MonthForecast(mIdx, lIdx, dashaObj);

  window.lastGeneratedKundli = {
    rashi: RASHIS.at(mIdx),
    nakshatra: NAKS.at(nakIdx),
    pada: pada,
    lagna: RASHIS.at(lIdx),
    atmakaraka: akPlanet.name.split(" ").at(0)
  };

  document.getElementById("kundliReport").style.display = "block";
  document.getElementById("btnDownloadPdf").style.display = "inline-block";
  document.getElementById("btnPrintKundli").style.display = "inline-block";
  const pushBtn = document.getElementById("btnPushToFamily");
  if (pushBtn) pushBtn.style.display = "inline-block";
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
    lbl += '<text x="' + cx.at(i) + '" y="' + (cy.at(i) - 6) + '" font-size="10" fill="#B30000" text-anchor="middle" font-weight="bold">' + (((lIdx + i) % 12) + 1) + '</text>';
    lbl += '<text x="' + cx.at(i) + '" y="' + (cy.at(i) + 8) + '" font-size="9.5" fill="#1C0D02" font-weight="bold" text-anchor="middle">' + h.at(i) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#FFF9E6" stroke="#8B0000" stroke-width="2.5"/><line x1="2" y1="2" x2="298" y2="298" stroke="#B8860B" stroke-width="1.5"/><line x1="298" y1="2" x2="2" y2="298" stroke="#B8860B" stroke-width="1.5"/><polygon points="150,2 298,150 150,298 2,150" fill="rgba(255,215,0,0.08)" stroke="#8B0000" stroke-width="1.8"/>' + lbl + '</svg>';
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
    cells += '<rect x="' + x + '" y="' + y + '" width="74" height="74" fill="#FFFDF4" stroke="#8B0000" stroke-width="1.5"/><text x="' + (x + 6) + '" y="' + (y + 14) + '" font-size="9" fill="#B30000" font-weight="bold">' + (i + 1) + '</text><text x="' + (x + 37) + '" y="' + (y + 42) + '" font-size="9.5" fill="#1C0D02" font-weight="bold" text-anchor="middle">' + s.at(i) + '</text>';
  }
  return '<svg viewBox="0 0 300 300" class="chart-svg"><rect x="2" y="2" width="296" height="296" fill="#F7E6B5" stroke="#8B0000" stroke-width="2.5"/>' + cells + '<text x="150" y="154" font-size="12" fill="#8B0000" font-weight="bold" text-anchor="middle">KP RASHI</text></svg>';
}

function downloadKundliPDF() {
  const rep = document.getElementById("kundliReport");
  if (!rep || rep.style.display === "none") {
    alert("Please click Generate Kundli & Yearly Forecast first.");
    return;
  }
  const origTitle = document.title;
  const fname = (document.getElementById("kFirst").value.trim() || "Vedic") + "_Kundli_Report";
  document.title = fname;
  window.print();
  setTimeout(function() { document.title = origTitle; }, 500);
}

function printKundliOnly() {
  downloadKundliPDF();
 
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
