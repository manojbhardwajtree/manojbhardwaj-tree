 let currentRole = null;
let editIdx = -1;

if (!localStorage.getItem("b_family_pass")) localStorage.setItem("b_family_pass", "family108");
if (!localStorage.getItem("b_admin_pass")) localStorage.setItem("b_admin_pass", "manoj108");

const base = [
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
];

function unlock() {
  const u = document.getElementById("uid").value.trim().toLowerCase();
  const p = document.getElementById("pwd").value;
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
  list.forEach(r => {
    const m = String(r.id).match(/(\d+)/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  });
  return "M_" + String(maxNum + 1).padStart(2, "0");
}

function render() {
  const list = getList();
  list.sort((a, b) => {
    if (a.id === "M_00") return -1;
    if (b.id === "M_00") return 1;
    if (a.father !== b.father) return String(a.father).localeCompare(String(b.father));
    return (Number(a.order) || 99) - (Number(b.order) || 99);
  });
  localStorage.setItem("b_db_v6", JSON.stringify(list));

  if (editIdx === -1) document.getElementById("mId").value = getNextId(list);

  ["mFather", "mMother"].forEach(id => {
    const el = document.getElementById(id);
    const cur = el.value;
    el.innerHTML = '<option value="">-- None / Unknown --</option><option value="Root">Root</option>';
    list.forEach(r => el.innerHTML += `<option value="${r.id}">${r.id} - ${r.first} ${r.last}</option>`);
    el.value = cur;
  });

  const tb = document.getElementById("tBody");
  tb.innerHTML = "";
  list.forEach((r, i) => {
    const isLocked = Boolean(r.locked);
    const lockTag = isLocked ? ' <span class="badge-lock">🛡️ Verified</span>' : "";
    const canEdit = currentRole === "admin" || !isLocked;
    const editBtn = canEdit ? `<button class="btn" onclick="ed(${i})">Edit</button>` : '<span style="color:#ccc;font-size:0.8em;">Admin Locked</span>';
    const delBtn = currentRole === "admin" ? `<button class="btn btn-danger" onclick="del(${i})">Erase</button>` : "";
    tb.innerHTML += `<tr>
      <td><strong>${r.id}</strong></td>
      <td>#${r.order || 1}</td>
      <td>${r.first} ${r.last}${lockTag}</td>
      <td>${r.lin}</td>
      <td>${r.father}</td>
      <td>${r.dob}</td>
      <td>${r.pob}</td>
      <td>${r.email} ${r.phone}</td>
      <td class="no-print">${editBtn} ${delBtn}</td>
    </tr>`;
  });
}

function saveRec(e) {
  e.preventDefault();
