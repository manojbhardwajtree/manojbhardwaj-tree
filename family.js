let currentRole = null;
let editIdx = -1;

if (!localStorage.getItem("b_family_pass")) localStorage.setItem("b_family_pass", "family108");
if (!localStorage.getItem("b_admin_pass")) localStorage.setItem("b_admin_pass", "manoj108");

const base = new Array(
  { id: "M_00", order: 1, gen: "G0_00", lin: "Root Ancestor", first: "Shiv Dayal", last: "Mehta", father: "Root", mother: "", sib: "", stat: "Punyaatma", dob: "1786-01-15", tob: "08:45", pob: "Est. ~82 yrs (1786-1868)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_01", order: 1, gen: "G1_00", lin: "Paternal Lineage", first: "Radha Krishan", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1814-03-10", tob: "08:45", pob: "Est. ~80 yrs (1814-1894)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_02", order: 2, gen: "G1_00", lin: "Paternal Lineage", first: "Thakur Das", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1817-05-12", tob: "08:45", pob: "Est. ~79 yrs (1817-1896)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_03", order: 3, gen: "G1_00", lin: "Paternal Lineage", first: "Uttam Chand", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1820-07-18", tob: "08:45", pob: "Est. ~81 yrs (1820-1901)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_04", order: 4, gen: "G1_00", lin: "Paternal Lineage", first: "Lalchand", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1823-09-22", tob: "08:45", pob: "Est. ~84 yrs (1823-1907)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_05", order: 5, gen: "G1_00", lin: "Paternal Lineage", first: "Manohar Lal", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1826-02-14", tob: "08:45", pob: "Est. ~78 yrs (1826-1904)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_06", order: 6, gen: "G1_00", lin: "Paternal Lineage", first: "Harbanslal", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1829-04-19", tob: "08:45", pob: "Est. ~80 yrs (1829-1909)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_07", order: 7, gen: "G1_00", lin: "Maternal Lineage", first: "Kaushalya", last: "Vijra", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1832-08-25", tob: "08:45", pob: "Est. ~77 yrs (1832-1909)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_08", order: 8, gen: "G1_00", lin: "Paternal Lineage", first: "Amar Nath", last: "Mehta", father: "M_00", mother: "", sib: "", stat: "Punyaatma", dob: "1835-11-30", tob: "08:45", pob: "Est. ~83 yrs (1835-1918)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_09", order: 1, gen: "G2_00", lin: "Paternal Lineage", first: "Brij Mohan", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1842-02-10", tob: "08:45", pob: "Est. ~80 yrs (1842-1922)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_10", order: 2, gen: "G2_00", lin: "Paternal Lineage", first: "Harbanslal", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1845-04-15", tob: "08:45", pob: "Est. ~78 yrs (1845-1923)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_11", order: 3, gen: "G2_00", lin: "Paternal Lineage", first: "Kulbhushan", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1848-06-20", tob: "08:45", pob: "Est. ~84 yrs (1848-1932)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_12", order: 4, gen: "G2_00", lin: "Paternal Lineage", first: "Virendra", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1851-08-24", tob: "08:45", pob: "Est. ~81 yrs (1851-1932)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_13", order: 5, gen: "G2_00", lin: "Maternal Lineage", first: "Praveen", last: "Vijra", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1854-10-12", tob: "08:45", pob: "Est. ~79 yrs (1854-1933)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_14", order: 6, gen: "G2_00", lin: "Maternal Lineage", first: "Meena", last: "Paul", father: "M_01", mother: "", sib: "", stat: "Punyaatma", dob: "1857-01-18", tob: "08:45", pob: "Est. ~80 yrs (1857-1937)", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_15", order: 7, gen: "G2_00", lin: "Paternal Lineage", first: "Iqbal Krishan", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Alive", dob: "1860-03-22", tob: "08:45", pob: "Est. ~82 yrs", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_16", order: 8, gen: "G2_00", lin: "Paternal Lineage", first: "Kewal Krishan", last: "Mehta", father: "M_01", mother: "", sib: "", stat: "Alive", dob: "1965-01-01", tob: "08:45", pob: "Haryana", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_17", order: 9, gen: "G2_00", lin: "Maternal Lineage", first: "Reeta", last: "Pal", father: "M_01", mother: "", sib: "", stat: "Alive", dob: "1866-07-14", tob: "08:45", pob: "Est. ~78 yrs", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_18", order: 10, gen: "G2_00", lin: "Maternal Lineage", first: "Renu", last: "Batra", father: "M_01", mother: "", sib: "", stat: "Alive", dob: "1869-09-28", tob: "08:45", pob: "Est. ~80 yrs", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_22", order: 1, gen: "G3_00", lin: "Paternal Lineage", first: "Sunil", last: "Mehta", father: "M_11", mother: "", sib: "M_23, M_24, M_25, M_26", stat: "Alive", dob: "", tob: "", pob: "", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_23", order: 2, gen: "G3_00", lin: "Paternal Lineage", first: "Seema", last: "Mehta", father: "M_11", mother: "", sib: "M_22, M_24, M_25, M_26", stat: "Alive", dob: "", tob: "", pob: "", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_24", order: 3, gen: "G3_00", lin: "Paternal Lineage", first: "Satish", last: "Mehta", father: "M_11", mother: "", sib: "M_22, M_23, M_25, M_26", stat: "Alive", dob: "", tob: "", pob: "", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_25", order: 4, gen: "G3_00", lin: "Paternal Lineage", first: "Manoj", last: "Mehta", father: "M_11", mother: "", sib: "M_22, M_23, M_24, M_26", stat: "Alive", dob: "", tob: "", pob: "", gotra: "Bhardwaj", email: "", phone: "", locked: false },
  { id: "M_26", order: 5, gen: "G3_00", lin: "Paternal Lineage", first: "Sanjay", last: "Mehta", father: "M_11", mother: "", sib: "M_22, M_23, M_24, M_25", stat: "Alive", dob: "", tob: "", pob: "", gotra: "Bhardwaj", email: "", phone: "", locked: false }
);            
function fTag(t, a, inner) {
  return "<" + t + (a ? " " + a : "") + ">" + (inner || "") + "<" + "/" + t + ">";
}

function unlock() {
  const u = document.getElementById("uid").value.trim().toLowerCase();
  const p = document.getElementById("pwd").value.trim();
  if (u === "admin" && p === localStorage.getItem("b_admin_pass")) {
    currentRole = "admin";
  } else if (u === "bhardwaj" && p === localStorage.getItem("b_family_pass")) {
    currentRole = "family";
  } else {
    document.getElementById("err").style.display = "block";
    return;
  }
  document.getElementById("err").style.display = "none";
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("mainPortal").style.display = "block";
  document.getElementById("roleBadge").textContent = currentRole === "admin" ? "👑 ADMIN (FULL OVERWRITE & LOCK)" : "👪 FAMILY CONTRIBUTOR";
  document.getElementById("adminLockBox").style.display = currentRole === "admin" ? "block" : "none";
  render();
}

document.addEventListener("DOMContentLoaded", function() {
  new Array("uid", "pwd").forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("keydown", function(e) {
        if (e.key === "Enter") { e.preventDefault(); unlock(); }
      });
    }
  });
});

function signOut() {
  currentRole = null;
  editIdx = -1;
  document.getElementById("uid").value = "";
  document.getElementById("pwd").value = "";
  document.getElementById("mainPortal").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function getList() {
  return JSON.parse(localStorage.getItem("b_db_v6")) || base;
}

function getNextId(list) {
  let maxNum = 0;
  list.forEach(function(r) {
    const m = String(r.id).match(/(\d+)/);
    if (m) maxNum = Math.max(maxNum, parseInt(m.at(1), 10));
  });
  return "M_" + String(maxNum + 1).padStart(2, "0");
}

function render() {
  const list = getList();
  list.sort(function(a, b) {
    if (a.id === "M_00") return -1;
    if (b.id === "M_00") return 1;
    if (a.father !== b.father) return String(a.father).localeCompare(String(b.father));
    return (Number(a.order) || 99) - (Number(b.order) || 99);
  });
  localStorage.setItem("b_db_v6", JSON.stringify(list));

  if (editIdx === -1) document.getElementById("mId").value = getNextId(list);

  new Array("mFather", "mMother").forEach(function(id) {
    const el = document.getElementById(id);
    const cur = el.value;
    let opts = fTag("option", 'value=""', "-- None / Unknown --") + fTag("option", 'value="Root"', "Root");
    list.forEach(function(r) { opts += fTag("option", 'value="' + r.id + '"', r.id + " - " + r.first + " " + r.last); });
    el.innerHTML = opts;
    el.value = cur;
  });

  const tb = document.getElementById("tBody");
  tb.innerHTML = "";
  list.forEach(function(r, i) {
    const isLocked = Boolean(r.locked);
    const lockTag = isLocked ? " " + fTag("span", 'class="badge-lock"', "🛡️ Verified") : "";
    const astroTag = r.rashi ? "<br>" + fTag("small", 'style="color:#FFD700;font-weight:700;"', "🪐 " + r.rashi.split(" ").at(0) + " • " + (r.nakshatra || "")) : "";
    const canEdit = currentRole === "admin" || !isLocked;
    const editBtn = canEdit ? fTag("button", 'class="btn" onclick="ed(' + i + ')"', "Edit") : fTag("span", 'style="color:#ccc;font-size:0.8em;"', "Admin Locked");
    const delBtn = currentRole === "admin" ? " " + fTag("button", 'class="btn btn-danger" onclick="del(' + i + ')"', "Erase") : "";
    tb.innerHTML += fTag("tr", "",
      fTag("td", "", fTag("strong", "", r.id)) +
      fTag("td", "", "#" + (r.order || 1)) +
      fTag("td", "", fTag("strong", "", r.first + " " + r.last) + lockTag + astroTag) +
      fTag("td", "", r.lin) +
      fTag("td", "", r.father) +
      fTag("td", "", r.dob) +
      fTag("td", "", r.pob) +
      fTag("td", "", r.email + " " + r.phone) +
      fTag("td", 'class="no-print"', editBtn + delBtn)
    );
  });
}

function saveRec(e) {
  e.preventDefault();
  const list = getList();
  if (editIdx > -1 && list.at(editIdx).locked && currentRole !== "admin") {
    alert("This record is verified and locked by Admin.");
    return;
  }
  const existing = editIdx > -1 ? list.at(editIdx) : {};
  const vMeta = window.pendingVedicMeta || {};
  const obj = {
    id: mId.value.trim(), order: parseInt(mOrder.value, 10) || 1, gen: mGen.value, lin: mLin.value,
    first: mFirst.value.trim(), last: mLast.value.trim(), father: mFather.value, mother: mMother.value,
    sib: mSib.value.trim(), stat: mStat.value, dob: mDob.value, tob: mTob.value, pob: mPob.value.trim(),
    gotra: mGotra.value.trim(), email: mEmail.value.trim(), phone: mPhone.value.trim(),
    rashi: vMeta.rashi || existing.rashi || "", nakshatra: vMeta.nakshatra || existing.nakshatra || "",
    pada: vMeta.pada || existing.pada || "", lagna: vMeta.lagna || existing.lagna || "",
    atmakaraka: vMeta.atmakaraka || existing.atmakaraka || "",
    locked: currentRole === "admin" ? mLocked.checked : false
  };
  window.pendingVedicMeta = null;
  if (editIdx > -1) { list[editIdx] = obj; editIdx = -1; } else { list.push(obj); }
  localStorage.setItem("b_db_v6", JSON.stringify(list));
  clr(); render();
}

function ed(i) {
  const r = getList().at(i);
  if (r.locked && currentRole !== "admin") { alert("Only Admin can edit a verified record."); return; }
  editIdx = i;
  mId.value = r.id; mOrder.value = r.order || 1; mGen.value = r.gen; mLin.value = r.lin;
  mFirst.value = r.first; mLast.value = r.last; mFather.value = r.father; mMother.value = r.mother;
  mSib.value = r.sib; mStat.value = r.stat; mDob.value = r.dob; mTob.value = r.tob;
  mPob.value = r.pob; mGotra.value = r.gotra; mEmail.value = r.email; mPhone.value = r.phone;
  mLocked.checked = Boolean(r.locked);
  document.getElementById("fForm").scrollIntoView({ behavior: "smooth" });
}

function del(i) {
  if (currentRole !== "admin") return;
  if (confirm("Admin Action: Permanently erase this record?")) {
    const list = getList(); list.splice(i, 1); localStorage.setItem("b_db_v6", JSON.stringify(list)); render();
  }
}

function clr() {
  editIdx = -1; window.pendingVedicMeta = null; document.getElementById("fForm").reset();
  mLast.value = "Mehta"; mGotra.value = "Bhardwaj"; mOrder.value = 1; mLocked.checked = false; render();
}

function changePass() {
  const p = prompt("Enter new password for your current role (min 4 characters):");
  if (p && p.length >= 4) {
    if (currentRole === "admin") localStorage.setItem("b_admin_pass", p);
    else localStorage.setItem("b_family_pass", p);
    alert("Password updated successfully!");
  }
}

function exportCSV() {
  let csv = "Person_ID,Sibling_Order,Generation,Branch,First_Name,Last_Name,Father_ID,Mother_ID,Siblings,Status,DOB,TOB,POB,Birth_Gotra,Chandra_Rashi,Janma_Nakshatra,Pada,Lagna,Atmakaraka,Email,Phone,AdminLocked\n";
  getList().forEach(function(r) {
    const row = new Array(
      r.id, r.order || 1, r.gen, r.lin, r.first, r.last, r.father, r.mother, r.sib, r.stat, r.dob, r.tob,
      r.pob, r.gotra, r.rashi || "", r.nakshatra || "", r.pada || "", r.lagna || "", r.atmakaraka || "",
      r.email, r.phone, r.locked ? "Yes" : "No"
    ).map(function(v) { return '"' + String(v || "").replace(/"/g, '""') + '"'; }).join(",");
    csv += row + "\n";
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(new Array(csv), { type: "text/csv" }));
  a.download = "Bhardwaj_Kundli_Lineage_Bridge.csv";
  a.click();
}

function familyLogout() { signOut(); }
