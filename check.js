
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  FIREBASE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const firebaseConfig = {
  apiKey: "AIzaSyDMfeXV1S9g2v7rR05xDHKUnnyDVwTmQoI",
  authDomain: "musclelab-gym.firebaseapp.com",
  projectId: "musclelab-gym",
  storageBucket: "musclelab-gym.firebasestorage.app",
  messagingSenderId: "206968588318",
  appId: "1:206968588318:web:5dd74a56deb28a2c85c60f"
};
const _app    = initializeApp(firebaseConfig);
const _appAux = initializeApp(firebaseConfig, 'aux'); // secondary instance â€” create users without logging out admin
const db      = getFirestore(_app);
const auth    = getAuth(_app);
const authAux = getAuth(_appAux);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  FIRESTORE HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fsSet(coll, id, data) {
  const { id: _id, ...rest } = data;
  await setDoc(doc(db, coll, id), rest);
}
async function fsUpdate(coll, id, changes) {
  const { id: _id, ...rest } = changes;
  await updateDoc(doc(db, coll, id), rest);
}
async function fsDelete(coll, id) {
  await deleteDoc(doc(db, coll, id));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  LOADER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showLoader(show) {
  const el = document.getElementById('appLoader');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  STATE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let currentUser     = null;
let currentUserRole = null;
let currentUserName = 'User';
let _invoicePayId   = null;
let _collectRxId    = null;

const S = {
  members: [], plans: [], payments: [], enquiries: [], staff: [], receivables: [],
  personalTraining: [], expenses: [],
  gymSettings: { name:'', phone:'', address:'', tagline:'', signature:'' },
  editMemberId: null, editPlanId: null, editEnqId: null, editStaffId: null,
  charts: {}
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  STORAGE â€” Firestore
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function load() {
  showLoader(true);
  try {
    const [mSnap, plSnap, pySnap, eSnap, stSnap, rxSnap, gsSnap, ptSnap, exSnap] = await Promise.all([
      getDocs(collection(db, 'members')),
      getDocs(collection(db, 'plans')),
      getDocs(collection(db, 'payments')),
      getDocs(collection(db, 'enquiries')),
      getDocs(collection(db, 'staff')),
      getDocs(collection(db, 'receivables')),
      getDoc(doc(db, 'settings', 'gym')),
      getDocs(collection(db, 'personalTraining')),
      getDocs(collection(db, 'expenses')),
    ]);
    S.members          = mSnap.docs.map(d  => ({ ...d.data(), id: d.id }));
    S.plans            = plSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    S.payments         = pySnap.docs.map(d => ({ ...d.data(), id: d.id }));
    S.enquiries        = eSnap.docs.map(d  => ({ ...d.data(), id: d.id }));
    S.staff            = stSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    S.receivables      = rxSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    S.personalTraining = ptSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    S.expenses         = exSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    if (gsSnap.exists()) Object.assign(S.gymSettings, gsSnap.data());
  } catch(e) {
    toast('Failed to load data: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

// One-time sync: create receivable records for existing partial payments that were
// recorded before due-tracking was added. Safe to run on every load â€” skips
// payments that already have a receivable or are fully paid.
async function syncMissingDues() {
  const created = [];
  for (const p of S.payments) {
    // Skip if a receivable already exists for this payment
    if (S.receivables.some(r => r.relatedPayId === p.id)) continue;
    const plan = S.plans.find(pl => pl.id === p.planId);
    if (!plan) continue;
    const due = Math.round((plan.price - Number(p.amount || 0)) * 100) / 100;
    if (due <= 0) continue;
    const member = S.members.find(m => m.id === p.memberId);
    const rx = {
      id: uid('rx'),
      memberId:         p.memberId,
      memberName:       p.memberName || (member ? member.name : ''),
      phone:            member ? member.phone : '',
      amount:           due,
      description:      `Balance for ${plan.name} (${p.receiptNo})`,
      relatedReceiptNo: p.receiptNo,
      relatedPayId:     p.id,
      createdAt:        p.date || todayStr(),
      status:           'pending',
    };
    S.receivables.push(rx);
    created.push(fsSet('receivables', rx.id, rx));
  }
  if (created.length) {
    await Promise.all(created);
    console.log(`[syncMissingDues] Created ${created.length} missing due record(s).`);
  }
}

async function initDefaults() {
  if (S.plans.length === 0) {
    const defaults = [
      { id: uid('plan'), name: 'Monthly',     days: 30,  price: 1000, desc: 'Full access for 1 month' },
      { id: uid('plan'), name: 'Quarterly',   days: 90,  price: 2500, desc: 'Full access for 3 months' },
      { id: uid('plan'), name: 'Half Yearly', days: 180, price: 4500, desc: 'Full access for 6 months' },
      { id: uid('plan'), name: 'Annual',      days: 365, price: 8000, desc: 'Full access for 1 year' },
    ];
    S.plans = defaults;
    try {
      await Promise.all(defaults.map(p => fsSet('plans', p.id, p)));
    } catch(e) {
      toast('Error saving default plans: ' + e.message, 'error');
    }
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  UTILITIES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function uid(pfx) { return pfx + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function pad2(n) { return String(n).padStart(2,'0'); }

function addDays(dateStr, n) {
  const p = dateStr.split('-').map(Number);
  const d = new Date(p[0], p[1]-1, p[2] + n);
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function fmtDate(s) {
  if (!s) return 'â€”';
  const [y,m,d] = s.split('-');
  return `${d}/${m}/${y}`;
}

function fmtMoney(n) { return 'â‚¹' + Number(n||0).toLocaleString('en-IN'); }

function getMemberStatus(expiryDate) {
  if (!expiryDate) return 'Expired';
  const today = todayStr();
  if (expiryDate < today) return 'Expired';
  const diff = Math.ceil((new Date(expiryDate) - new Date(today)) / 86400000);
  return diff <= 7 ? 'Expiring' : 'Active';
}

function statusBadge(st) {
  const m = { Active:'badge-green', Expiring:'badge-orange', Expired:'badge-red' };
  return `<span class="badge ${m[st]||'badge-gray'}">${st==='Expiring'?'Expiring Soon':st}</span>`;
}

function enqBadge(st) {
  const m = { New:'badge-blue', Contacted:'badge-gray', Interested:'badge-purple', Converted:'badge-green', Lost:'badge-red' };
  return `<span class="badge ${m[st]||'badge-gray'}">${st}</span>`;
}

function nextMemberId() {
  const nums = S.members.map(m => parseInt(m.id.replace('ML','')) || 0);
  return 'ML' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3,'0');
}

function nextReceiptNo() {
  const nums = S.payments.map(p => parseInt((p.receiptNo||'').replace('RCP','')) || 0);
  return 'RCP' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4,'0');
}

function getPlan(id) { return S.plans.find(p => p.id === id); }
function getMember(id) { return S.members.find(m => m.id === id); }

function resizeImg(file, cb) {
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height, max = 200;
      if (w > max) { h = h*max/w; w = max; }
      if (h > max) { w = w*max/h; h = max; }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      cb(c.toDataURL('image/jpeg',0.72));
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  TOAST
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function toast(msg, type='success') {
  const icons = { success:'âœ…', error:'âŒ', info:'â„¹ï¸', warning:'âš ï¸' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${icons[type]||'â€¢'}</span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => { el.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(()=>el.remove(),300); }, 3200);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  CONFIRM
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _confirmCb = null;
function confirm2(title, text, cb, icon='ðŸ—‘ï¸') {
  document.getElementById('confirmIcon').textContent = icon;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmText').textContent = text;
  _confirmCb = cb;
  openModal('confirmModal');
  document.getElementById('confirmOk').onclick = () => { closeModal('confirmModal'); _confirmCb && _confirmCb(); };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  MODALS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  AUTH
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.active === false) {
        await signOut(auth);
        showLoginPage();
        setTimeout(() => toast('Your access has been revoked. Contact admin.', 'error'), 600);
        return;
      }
      currentUserRole = data.role || 'trainer';
      currentUserName = data.name || currentUser?.email || 'User';
    } else {
      currentUserRole = 'trainer';
      currentUserName = currentUser?.email || 'User';
    }
  } catch(e) {
    currentUserRole = 'trainer';
    currentUserName = 'User';
  }
}

function applyRolePermissions() {
  const role = currentUserRole || 'trainer';
  const hu = document.getElementById('headerUserName');
  if (hu) hu.textContent = `ðŸ‘¤ ${currentUserName}`;
  const wt = document.querySelector('#dashboardPage .section-title');
  if (wt) wt.textContent = `Welcome back, ${currentUserName}! ðŸ‘‹`;
  document.querySelectorAll('[data-requires-role]').forEach(el => {
    const allowed = (el.dataset.requiresRole || '').split(' ').filter(Boolean);
    el.style.display = allowed.includes(role) ? '' : 'none';
  });
}

function showLoginPage() {
  document.getElementById('setupPage').style.display   = 'none';
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('loginPage').style.display   = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.style.display = 'none';
}

function showSetupPage() {
  document.getElementById('loginPage').style.display   = 'none';
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('setupPage').style.display   = 'flex';
}

async function checkFirstRun() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.empty;
}

async function setupAdmin(e) {
  e.preventDefault();
  const name  = document.getElementById('setupName').value.trim();
  const email = document.getElementById('setupEmail').value.trim();
  const pass  = document.getElementById('setupPass').value;
  const errEl = document.getElementById('setupError');
  errEl.style.display = 'none';
  showLoader(true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, name, email, role: 'admin' });
    toast('Admin account created! Please log in.', 'success');
    await signOut(auth);
    showLoginPage();
  } catch(err) {
    errEl.textContent = err.message;
    errEl.style.display = 'block';
  } finally {
    showLoader(false);
  }
}

function showForgotPassword() {
  document.getElementById('forgotPanel').style.display = 'block';
  document.getElementById('forgotMsg').style.display = 'none';
  document.getElementById('forgotEmail').value = document.getElementById('loginUser').value || '';
  document.getElementById('forgotEmail').focus();
}

function hideForgotPassword() {
  document.getElementById('forgotPanel').style.display = 'none';
}

async function sendResetEmail() {
  const email = document.getElementById('forgotEmail').value.trim();
  const msgEl = document.getElementById('forgotMsg');
  if (!email) {
    msgEl.textContent = 'âŒ Please enter your email address.';
    msgEl.style.color = 'var(--danger)';
    msgEl.style.display = 'block';
    return;
  }
  showLoader(true);
  try {
    await sendPasswordResetEmail(auth, email);
    msgEl.textContent = 'âœ… Reset link sent! Check your email inbox (and spam folder).';
    msgEl.style.color = 'var(--success)';
    msgEl.style.display = 'block';
  } catch(err) {
    msgEl.textContent = 'âŒ ' + (err.code === 'auth/user-not-found' ? 'No account found with this email.' : err.message);
    msgEl.style.color = 'var(--danger)';
    msgEl.style.display = 'block';
  } finally {
    showLoader(false);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginUser').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';
  if (!email || !pass) {
    errEl.textContent = 'âŒ Please enter email and password';
    errEl.style.display = 'block';
    return;
  }
  showLoader(true);
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged handles the rest
  } catch(err) {
    errEl.textContent = 'âŒ Invalid email or password';
    errEl.style.display = 'block';
    showLoader(false);
  }
}

function doLogout() {
  confirm2('Logout', 'Are you sure you want to logout?', async () => {
    showLoader(true);
    try { await signOut(auth); } catch(e) { toast('Logout error: ' + e.message, 'error'); showLoader(false); }
  }, 'ðŸšª');
}

function showApp() {
  document.getElementById('loginPage').style.display   = 'none';
  document.getElementById('setupPage').style.display   = 'none';
  document.getElementById('appContainer').style.display = 'flex';
  applyRolePermissions();
  navigate('dashboard');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  NAVIGATION
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PAGE_TITLES = { dashboard:'Dashboard', members:'Members', plans:'Plans', payments:'Payments', dues:'Pending Dues', reports:'Reports', enquiries:'Enquiries', staff:'Staff', analytics:'Analytics', settings:'Settings', personaltraining:'Personal Training', expenses:'Expenses' };

const RESTRICTED_PAGES = {
  members:   ['admin','receptionist'],
  plans:     ['admin','receptionist'],
  payments:  ['admin','receptionist'],
  reports:   ['admin','receptionist'],
  staff:     ['admin'],
  analytics: ['admin'],
  settings:  ['admin'],
};

function navigate(page) {
  if (currentUserRole && RESTRICTED_PAGES[page] && !RESTRICTED_PAGES[page].includes(currentUserRole)) {
    toast('Access denied', 'warning');
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById(page+'Page');
  if (pg) pg.classList.add('active');
  const nv = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (nv) nv.classList.add('active');
  document.getElementById('headerTitle').textContent = PAGE_TITLES[page] || page;
  closeSidebar();
  renderPage(page);
}

function renderPage(page) {
  const map = { dashboard:renderDashboard, members:renderMembers, plans:renderPlans, payments:renderPayments, dues:renderDuesPage, reports:renderReports, enquiries:renderEnquiries, staff:renderStaff, analytics:renderAnalytics, settings:renderSettings, personaltraining:renderPersonalTraining, expenses:renderExpenses };
  if (map[page]) map[page]();
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebarOverlay');
  if (s.classList.contains('open')) { s.classList.remove('open'); o.classList.remove('show'); }
  else { s.classList.add('open'); o.classList.add('show'); }
}
function closeSidebar() {
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PHOTO PREVIEW
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function previewPhoto(input, previewId) {
  if (input.files && input.files[0]) {
    resizeImg(input.files[0], data => {
      input.dataset.img = data;
      document.getElementById(previewId).innerHTML = `<img src="${data}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);margin-top:4px">`;
    });
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  DASHBOARD â€” real-time via onSnapshot
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _dashUnsubs = [];
function setupDashboardListeners() {
  _dashUnsubs.forEach(u => u());
  _dashUnsubs = [];
  const refresh = () => {
    if (document.getElementById('dashboardPage').classList.contains('active')) renderDashboard();
  };
  _dashUnsubs.push(
    onSnapshot(collection(db,'members'),         snap => { S.members          = snap.docs.map(d => ({...d.data(),id:d.id})); refresh(); }),
    onSnapshot(collection(db,'payments'),        snap => { S.payments         = snap.docs.map(d => ({...d.data(),id:d.id})); refresh(); }),
    onSnapshot(collection(db,'enquiries'),       snap => { S.enquiries        = snap.docs.map(d => ({...d.data(),id:d.id})); refresh(); }),
    onSnapshot(collection(db,'personalTraining'),snap => { S.personalTraining = snap.docs.map(d => ({...d.data(),id:d.id})); refresh(); }),
    onSnapshot(collection(db,'expenses'),        snap => { S.expenses         = snap.docs.map(d => ({...d.data(),id:d.id})); refresh(); })
  );
}

function renderDashboard() {
  const d = new Date();
  const el = document.getElementById('dashDate');
  if (el) el.textContent = d.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  let active=0, expiring=0, expired=0;
  const expiringList = [];
  S.members.forEach(m => {
    const st = getMemberStatus(m.expiryDate);
    if (st === 'Active') active++;
    else if (st === 'Expiring') { expiring++; expiringList.push(m); }
    else expired++;
  });

  const thisMonth = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  const monthRev = S.payments.filter(p => p.date && p.date.startsWith(thisMonth)).reduce((s,p)=>s+Number(p.amount||0),0)
    + S.personalTraining.filter(pt => pt.date && pt.date.startsWith(thisMonth)).reduce((s,pt)=>s+Number(pt.amount||0),0);
  const newEnq = S.enquiries.filter(e => e.status === 'New').length;

  const stats = [
    { icon:'ðŸ‘¥', val: S.members.length,        label:'Total Members',       cls:'' },
    { icon:'ðŸ’ª', val: active + expiring,         label:'Active Members',      cls:'green' },
    { icon:'ðŸ’°', val: fmtMoney(monthRev),        label:'Revenue This Month',  cls:'blue' },
    { icon:'â³', val: expiring,                  label:'Expiring This Week',  cls:'orange' },
    { icon:'âš ï¸', val: fmtMoney(S.receivables.filter(r=>r.status==='pending').reduce((s,r)=>s+Number(r.amount||0),0)), label:'Pending Dues',  cls:'orange' },
    { icon:'ðŸ“‹', val: newEnq,                    label:'New Enquiries',       cls:'purple' },
  ];

  document.getElementById('statsGrid').innerHTML = stats.map(s =>
    `<div class="stat-card ${s.cls}"><span class="stat-icon">${s.icon}</span><div class="stat-number ${s.cls}">${s.val}</div><div class="stat-label">${s.label}</div></div>`
  ).join('');

  // Recent Members
  const rm = [...S.members].reverse().slice(0,5);
  document.getElementById('dashRecentMembers').innerHTML = rm.length === 0
    ? `<div class="empty-state" style="padding:28px"><div class="empty-icon">ðŸ‘¥</div><div>No members yet</div></div>`
    : `<table><thead><tr><th>Name</th><th>Phone</th><th>Plan</th><th>Status</th></tr></thead><tbody>${rm.map(m=>{
        const st = getMemberStatus(m.expiryDate);
        return `<tr><td><strong>${m.name}</strong></td><td class="td-muted">${m.phone}</td><td class="td-muted">${m.planName||'â€”'}</td><td>${statusBadge(st)}</td></tr>`;
      }).join('')}</tbody></table>`;

  // Recent Payments
  const rp = [...S.payments].reverse().slice(0,5);
  document.getElementById('dashRecentPayments').innerHTML = rp.length === 0
    ? `<div class="empty-state" style="padding:28px"><div class="empty-icon">ðŸ’°</div><div>No payments yet</div></div>`
    : `<table><thead><tr><th>Member</th><th>Amount</th><th>Mode</th><th>Date</th><th></th></tr></thead><tbody>${rp.map(p=>
        `<tr><td><strong>${p.memberName}</strong></td><td style="color:var(--success);font-weight:700">${fmtMoney(p.amount)}</td><td class="td-muted">${p.mode}</td><td class="td-muted">${fmtDate(p.date)}</td><td><button class="btn btn-icon btn-sm" title="View Invoice" onclick="openInvoiceModal('${p.id}')">ðŸ§¾</button></td></tr>`
      ).join('')}</tbody></table>`;

  // Pending Dues on dashboard
  const pendingRx = S.receivables.filter(r => r.status === 'pending');
  const pendingTotal = pendingRx.reduce((s,r) => s + Number(r.amount||0), 0);
  document.getElementById('dashDuesBadge').textContent = pendingRx.length;
  document.getElementById('dashDuesList').innerHTML = pendingRx.length === 0
    ? `<div style="color:var(--text2);font-size:13px;text-align:center;padding:18px">âœ… No pending dues</div>`
    : `${pendingRx.slice(0,5).map(r =>
        `<div class="expiry-item">
          <div>
            <div style="font-weight:600;font-size:13px">${r.memberName}</div>
            <div style="color:var(--text2);font-size:11px">${r.description||'â€”'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px;font-weight:700;color:var(--warning)">${fmtMoney(r.amount)}</div>
            <button class="btn btn-whatsapp btn-sm" onclick="sendWA_due('${r.id}')" style="margin-top:4px;padding:3px 8px;font-size:11px">ðŸ’¬ WA</button>
          </div>
        </div>`
      ).join('')}${pendingRx.length>5?`<div style="text-align:center;padding:8px;font-size:12px;color:var(--text2)">+${pendingRx.length-5} more â€” <a onclick="navigate('payments')" style="color:var(--primary);cursor:pointer">View all â†’</a></div>`:''}` ;

  // Expiring list
  document.getElementById('expiringBadge').textContent = expiringList.length;
  document.getElementById('expiringList').innerHTML = expiringList.length === 0
    ? `<div style="color:var(--text2);font-size:13px;text-align:center;padding:18px">âœ… No memberships expiring this week</div>`
    : expiringList.map(m =>
        `<div class="expiry-item">
          <div>
            <div style="font-weight:600;font-size:13px">${m.name}</div>
            <div style="color:var(--text2);font-size:11px">${m.phone} Â· ${m.planName||'â€”'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;color:var(--warning)">${fmtDate(m.expiryDate)}</div>
            <button class="btn btn-whatsapp btn-sm" onclick="sendWA_expiry('${m.id}')" style="margin-top:4px;padding:3px 8px;font-size:11px">ðŸ’¬ WA</button>
          </div>
        </div>`
      ).join('');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  MEMBERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderMembers() {
  const q = (document.getElementById('memberSearch')?.value||'').toLowerCase();
  const f = document.getElementById('memberFilter')?.value||'all';

  const list = S.members.filter(m => {
    const st = getMemberStatus(m.expiryDate);
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q);
    const matchF = f==='all' || st===f || (f==='Expiring' && st==='Expiring');
    return matchQ && matchF;
  });

  const wrap = document.getElementById('membersTable');
  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">ðŸ‘¥</div><div class="empty-title">No Members Found</div><div class="empty-text">Add your first member to get started</div><button class="btn btn-primary" onclick="openMemberModal()">âž• Add Member</button></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Photo</th><th>Name</th><th>Phone</th><th>Plan</th><th>Start Date</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${list.map(m => {
        const st = getMemberStatus(m.expiryDate);
        return `<tr>
          <td><span style="font-size:12px;color:var(--text2)">${m.id}</span></td>
          <td><div class="member-thumb">${m.photo?`<img src="${m.photo}" alt="">`:'ðŸ‘¤'}</div></td>
          <td><strong>${m.name}</strong></td>
          <td class="td-muted">${m.phone}</td>
          <td class="td-muted">${m.planName||'â€”'}</td>
          <td class="td-muted">${fmtDate(m.joinDate)}</td>
          <td class="td-muted">${fmtDate(m.expiryDate)}</td>
          <td>${statusBadge(st)}</td>
          <td><div class="actions-group">
            <button class="btn btn-icon btn-sm" title="View Profile" onclick="openProfile('${m.id}')">ðŸ‘ï¸</button>
            ${['admin','receptionist'].includes(currentUserRole) ? `<button class="btn btn-icon btn-sm" title="Edit" onclick="openMemberModal('${m.id}')">âœï¸</button>` : ''}
            ${['admin','receptionist'].includes(currentUserRole) ? `<button class="btn btn-icon btn-sm" title="Delete" onclick="deleteMember('${m.id}')" style="color:var(--danger)">ðŸ—‘ï¸</button>` : ''}
            ${(()=>{ const lp=getLastPaymentId(m.id); return lp?`<button class="btn btn-icon btn-sm" title="Last Invoice" onclick="openInvoiceModal('${lp}')">ðŸ§¾</button>`:''; })()}
            <button class="btn btn-whatsapp btn-sm" title="WhatsApp" onclick="sendWA_expiry('${m.id}')">ðŸ’¬</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

function openMemberModal(memberId) {
  S.editMemberId = memberId || null;
  const isEdit = !!memberId;
  document.getElementById('memberModalTitle').textContent = isEdit ? 'Edit Member' : 'Add New Member';

  // Populate plan dropdown
  document.getElementById('mPlan').innerHTML = '<option value="">Select a plan</option>' +
    S.plans.map(p => `<option value="${p.id}">${p.name} â€” ${fmtMoney(p.price)}</option>`).join('');

  // Reset photo
  const photo = document.getElementById('mPhoto');
  photo.value = '';
  delete photo.dataset.img;

  if (isEdit) {
    const m = getMember(memberId);
    if (!m) return;
    document.getElementById('mId').value = m.id;
    document.getElementById('mName').value = m.name;
    document.getElementById('mPhone').value = m.phone;
    document.getElementById('mEmail').value = m.email||'';
    document.getElementById('mDob').value = m.dob||'';
    document.getElementById('mGender').value = m.gender||'';
    document.getElementById('mAddress').value = m.address||'';
    document.getElementById('mEmergency').value = m.emergency||'';
    document.getElementById('mJoinDate').value = m.joinDate||todayStr();
    document.getElementById('mPlan').value = m.planId||'';
    document.getElementById('mPayAmtWrap').style.display = 'none';
    document.getElementById('mPayModeWrap').style.display = 'none';
    document.getElementById('mPayDueWrap').style.display = 'none';
    document.getElementById('mPhotoPreview').innerHTML = m.photo
      ? `<img src="${m.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">` : '';
  } else {
    document.getElementById('mId').value = nextMemberId();
    ['mName','mPhone','mEmail','mAddress','mEmergency'].forEach(id => document.getElementById(id).value='');
    document.getElementById('mDob').value = '';
    document.getElementById('mGender').value = '';
    document.getElementById('mJoinDate').value = todayStr();
    document.getElementById('mPlan').value = '';
    document.getElementById('mPayAmt').value = '';
    document.getElementById('mPayDue').value = '0';
    document.getElementById('mPayMode').value = 'Cash';
    document.getElementById('mPayAmtWrap').style.display = '';
    document.getElementById('mPayModeWrap').style.display = '';
    document.getElementById('mPayDueWrap').style.display = '';
    document.getElementById('mPhotoPreview').innerHTML = '';
  }
  openModal('memberModal');
}

function onMemberPlanChange() {
  const plan = getPlan(document.getElementById('mPlan').value);
  if (plan && !S.editMemberId) {
    document.getElementById('mPayAmt').value = plan.price;
    document.getElementById('mPayDue').value = '0';
  }
}

function updateMemberDue() {
  const plan = getPlan(document.getElementById('mPlan').value);
  if (!plan || S.editMemberId) return;
  const paid = parseFloat(document.getElementById('mPayAmt').value || 0) || 0;
  const due  = Math.max(0, plan.price - paid);
  document.getElementById('mPayDue').value = due > 0 ? due : '0';
}

async function saveMember() {
  const name     = document.getElementById('mName').value.trim();
  const phone    = document.getElementById('mPhone').value.trim();
  const joinDate = document.getElementById('mJoinDate').value;
  const planId   = document.getElementById('mPlan').value;
  const isEdit   = !!S.editMemberId;

  if (!name)    { toast('Please enter member name','error'); return; }
  if (!phone)   { toast('Please enter phone number','error'); return; }
  if (!planId)  { toast('Please select a plan','error'); return; }
  if (!joinDate){ toast('Please select join date','error'); return; }
  if (!isEdit && !document.getElementById('mPayAmt').value) { toast('Please enter payment amount','error'); return; }

  const plan = getPlan(planId);
  const expiryDate = plan ? addDays(joinDate, plan.days) : joinDate;
  const photoInput = document.getElementById('mPhoto');
  const newPhoto = photoInput.dataset.img || null;

  showLoader(true);
  try {
    if (isEdit) {
      const updates = {
        name, phone,
        email: document.getElementById('mEmail').value.trim(),
        dob: document.getElementById('mDob').value,
        gender: document.getElementById('mGender').value,
        address: document.getElementById('mAddress').value.trim(),
        emergency: document.getElementById('mEmergency').value.trim(),
        joinDate, planId, planName: plan ? plan.name : '', expiryDate,
      };
      if (newPhoto) updates.photo = newPhoto;
      const idx = S.members.findIndex(m => m.id === S.editMemberId);
      if (idx !== -1) S.members[idx] = { ...S.members[idx], ...updates };
      await fsUpdate('members', S.editMemberId, updates);
      toast('Member updated!', 'success');
    } else {
      const id = document.getElementById('mId').value || nextMemberId();
      const member = {
        id, name, phone,
        email: document.getElementById('mEmail').value.trim(),
        dob: document.getElementById('mDob').value,
        gender: document.getElementById('mGender').value,
        address: document.getElementById('mAddress').value.trim(),
        emergency: document.getElementById('mEmergency').value.trim(),
        joinDate, planId, planName: plan ? plan.name : '',
        expiryDate, photo: newPhoto || '', createdAt: todayStr(),
      };
      S.members.push(member);
      await fsSet('members', id, member);
      // Auto-record initial payment
      const amt  = parseFloat(document.getElementById('mPayAmt').value || 0);
      const amtDue = parseFloat(document.getElementById('mPayDue').value || 0) || 0;
      const mode = document.getElementById('mPayMode').value;
      if (amt > 0) {
        const payment = {
          id: uid('pay'), receiptNo: nextReceiptNo(),
          memberId: id, memberName: name,
          amount: amt, mode, planId, planName: plan ? plan.name : '',
          date: joinDate, expiryDate, note: 'Initial registration',
        };
        S.payments.push(payment);
        await fsSet('payments', payment.id, payment);
        // Track partial payment due
        if (amtDue > 0) {
          const rx = {
            id: uid('rx'), memberId: id, memberName: name,
            phone, amount: amtDue,
            description: `Balance for ${plan ? plan.name : 'membership'} (${payment.receiptNo})`,
            relatedReceiptNo: payment.receiptNo, relatedPayId: payment.id,
            createdAt: joinDate, status: 'pending',
          };
          S.receivables.push(rx);
          await fsSet('receivables', rx.id, rx);
        }
      }
      toast(`Member ${id} added!${amtDue > 0 ? ` Due: â‚¹${amtDue}` : ''}`, 'success');
    }
  } catch(e) {
    toast('Error saving member: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
  S.editMemberId = null;
  closeModal('memberModal');
  renderMembers();
}

function deleteMember(id) {
  const m = getMember(id);
  if (!m) return;
  confirm2('Delete Member', `Remove ${m.name}? Payment records will remain.`, async () => {
    showLoader(true);
    try {
      await fsDelete('members', id);
      S.members = S.members.filter(x => x.id !== id);
      toast('Member deleted', 'success');
      renderMembers();
    } catch(e) {
      toast('Error deleting member: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

function openProfile(memberId) {
  const m = getMember(memberId);
  if (!m) return;
  const st = getMemberStatus(m.expiryDate);
  const pays = S.payments.filter(p => p.memberId === memberId);
  document.getElementById('profileBody').innerHTML = `
    <div class="profile-hdr">
      <div class="profile-avatar">${m.photo?`<img src="${m.photo}" alt="">`: 'ðŸ‘¤'}</div>
      <div style="flex:1">
        <div class="profile-name">${m.name}</div>
        <div class="profile-id">${m.id}</div>
        <div>${statusBadge(st)}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-whatsapp btn-sm" onclick="sendWA_expiry('${m.id}')">ðŸ’¬ WhatsApp</button>
        <button class="btn btn-primary btn-sm" onclick="closeModal('profileModal');openRenewalModal('${m.id}')">ðŸ”„ Renew</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal('profileModal');openMemberModal('${m.id}')">âœï¸ Edit</button>
      </div>
    </div>
    <div class="profile-details">
      <div class="detail-item"><label>Phone</label><span>${m.phone}</span></div>
      <div class="detail-item"><label>Email</label><span>${m.email||'â€”'}</span></div>
      <div class="detail-item"><label>Date of Birth</label><span>${fmtDate(m.dob)}</span></div>
      <div class="detail-item"><label>Gender</label><span>${m.gender||'â€”'}</span></div>
      <div class="detail-item"><label>Address</label><span>${m.address||'â€”'}</span></div>
      <div class="detail-item"><label>Emergency Contact</label><span>${m.emergency||'â€”'}</span></div>
      <div class="detail-item"><label>Plan</label><span>${m.planName||'â€”'}</span></div>
      <div class="detail-item"><label>Join Date</label><span>${fmtDate(m.joinDate)}</span></div>
      <div class="detail-item"><label>Expiry Date</label><span style="${st==='Expired'?'color:var(--danger)':st==='Expiring'?'color:var(--warning)':''}">${fmtDate(m.expiryDate)}</span></div>
      <div class="detail-item"><label>Member Since</label><span>${fmtDate(m.createdAt)}</span></div>
    </div>
    <div class="section-header" style="margin-bottom:12px">
      <div class="section-title">Payment History</div>
      <span class="badge badge-blue">${pays.length} records</span>
    </div>
    ${pays.length === 0
      ? `<div style="color:var(--text2);font-size:13px;padding:12px 0">No payment records found.</div>`
      : `<div class="table-wrapper"><table>
          <thead><tr><th>Receipt No</th><th>Date</th><th>Plan</th><th>Amount</th><th>Mode</th><th>Note</th></tr></thead>
          <tbody>${[...pays].reverse().map(p =>
            `<tr>
              <td><span style="font-family:monospace;font-size:12px;color:var(--text2)">${p.receiptNo}</span></td>
              <td class="td-muted">${fmtDate(p.date)}</td>
              <td class="td-muted">${p.planName||'â€”'}</td>
              <td style="color:var(--success);font-weight:700">${fmtMoney(p.amount)}</td>
              <td class="td-muted">${p.mode}</td>
              <td class="td-muted">${p.note||'â€”'}</td>
            </tr>`
          ).join('')}</tbody>
        </table></div>`
    }`;
  openModal('profileModal');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PLANS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderPlans() {
  const grid = document.getElementById('plansGrid');
  if (!S.plans.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">ðŸ’³</div><div class="empty-title">No Plans</div><button class="btn btn-primary" onclick="openPlanModal()">âž• Add Plan</button></div>`;
    return;
  }
  grid.innerHTML = S.plans.map(p => {
    const cnt = S.members.filter(m => m.planId === p.id).length;
    return `
      <div class="plan-card">
        <div class="plan-badge">${p.days}d</div>
        <div class="plan-name">${p.name}</div>
        <div class="plan-duration">${p.days} days duration</div>
        <div class="plan-price">${fmtMoney(p.price)}</div>
        <div class="plan-price-label">per membership</div>
        ${p.desc?`<div class="plan-desc">${p.desc}</div>`:''}
        <div class="plan-members">ðŸ‘¥ ${cnt} member${cnt!==1?'s':''} on this plan</div>
        <div class="plan-actions">
          ${currentUserRole === 'admin' ? `<button class="btn btn-secondary btn-sm" onclick="openPlanModal('${p.id}')">âœï¸ Edit</button>` : ''}
          ${currentUserRole === 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deletePlan('${p.id}')">ðŸ—‘ï¸ Delete</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function openPlanModal(planId) {
  S.editPlanId = planId || null;
  document.getElementById('planModalTitle').textContent = planId ? 'Edit Plan' : 'Add New Plan';
  if (planId) {
    const p = getPlan(planId);
    if (!p) return;
    document.getElementById('pName').value = p.name;
    document.getElementById('pDays').value = p.days;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pDesc').value = p.desc||'';
  } else {
    document.getElementById('pName').value = '';
    document.getElementById('pDays').value = '';
    document.getElementById('pPrice').value = '';
    document.getElementById('pDesc').value = '';
  }
  openModal('planModal');
}

async function savePlan() {
  const name  = document.getElementById('pName').value.trim();
  const days  = parseInt(document.getElementById('pDays').value);
  const price = parseFloat(document.getElementById('pPrice').value);
  if (!name)           { toast('Enter plan name','error'); return; }
  if (!days || days<1) { toast('Enter valid duration','error'); return; }
  if (isNaN(price) || price<0) { toast('Enter valid price','error'); return; }

  const data = { name, days, price, desc: document.getElementById('pDesc').value.trim() };
  showLoader(true);
  try {
    if (S.editPlanId) {
      const idx = S.plans.findIndex(p => p.id === S.editPlanId);
      if (idx!==-1) S.plans[idx] = { ...S.plans[idx], ...data };
      await fsUpdate('plans', S.editPlanId, data);
      toast('Plan updated!', 'success');
    } else {
      const id = uid('plan');
      S.plans.push({ id, ...data });
      await fsSet('plans', id, { id, ...data });
      toast('Plan added!', 'success');
    }
  } catch(e) {
    toast('Error saving plan: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
  S.editPlanId = null;
  closeModal('planModal');
  renderPlans();
}

function deletePlan(planId) {
  const p = getPlan(planId);
  if (!p) return;
  const cnt = S.members.filter(m => m.planId===planId).length;
  confirm2('Delete Plan', `Delete "${p.name}"?${cnt>0?` ${cnt} member(s) use this plan.`:''}`, async () => {
    showLoader(true);
    try {
      await fsDelete('plans', planId);
      S.plans = S.plans.filter(x => x.id !== planId);
      toast('Plan deleted', 'success');
      renderPlans();
    } catch(e) {
      toast('Error deleting plan: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  PAYMENTS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderPayments() {
  const q    = (document.getElementById('paySearch')?.value||'').toLowerCase();
  const mode = document.getElementById('payModeFilter')?.value||'all';
  const from = document.getElementById('payFrom')?.value||'';
  const to   = document.getElementById('payTo')?.value||'';

  const list = [...S.payments].reverse().filter(p => {
    const matchQ = !q || p.memberName.toLowerCase().includes(q);
    const matchM = mode==='all' || p.mode===mode;
    const matchF = !from || p.date>=from;
    const matchT = !to   || p.date<=to;
    return matchQ && matchM && matchF && matchT;
  });

  // Daily summary
  const today = todayStr();
  const todayPays = S.payments.filter(p => p.date===today);
  const dTotal = todayPays.reduce((s,p)=>s+Number(p.amount||0),0);
  const dCash  = todayPays.filter(p=>p.mode==='Cash').reduce((s,p)=>s+Number(p.amount||0),0);
  const dUPI   = todayPays.filter(p=>p.mode==='UPI').reduce((s,p)=>s+Number(p.amount||0),0);
  const dCard  = todayPays.filter(p=>p.mode==='Card').reduce((s,p)=>s+Number(p.amount||0),0);

  document.getElementById('dailySummary').innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--text2);letter-spacing:1px;white-space:nowrap">TODAY'S COLLECTION</div>
    <div class="daily-summary-item"><div class="daily-summary-num">${fmtMoney(dTotal)}</div><div class="daily-summary-label">Total</div></div>
    <div class="daily-summary-item"><div class="daily-summary-num">${fmtMoney(dCash)}</div><div class="daily-summary-label">Cash</div></div>
    <div class="daily-summary-item"><div class="daily-summary-num">${fmtMoney(dUPI)}</div><div class="daily-summary-label">UPI</div></div>
    <div class="daily-summary-item"><div class="daily-summary-num">${fmtMoney(dCard)}</div><div class="daily-summary-label">Card</div></div>
    <div class="daily-summary-item"><div class="daily-summary-num">${todayPays.length}</div><div class="daily-summary-label">Transactions</div></div>`;

  const wrap = document.getElementById('paymentsTable');
  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">ðŸ’°</div><div class="empty-title">No Payments Found</div><button class="btn btn-primary" onclick="openPaymentModal()">âž• Record Payment</button></div>`;
    return;
  }

  const modeBadge = m => {
    const mp = { Cash:'badge-green', UPI:'badge-blue', Card:'badge-purple' };
    return `<span class="badge ${mp[m]||'badge-gray'}">${m}</span>`;
  };

  wrap.innerHTML = `
    <table>
      <thead><tr><th>Receipt No</th><th>Date</th><th>Member</th><th>Amount</th><th>Mode</th><th>Plan</th><th>Note</th><th>Actions</th></tr></thead>
      <tbody>${list.map(p=>`<tr>
        <td><span style="font-family:monospace;font-size:12px;color:var(--text2)">${p.receiptNo}</span></td>
        <td class="td-muted">${fmtDate(p.date)}</td>
        <td><strong>${p.memberName}</strong></td>
        <td style="color:var(--success);font-weight:700">${fmtMoney(p.amount)}</td>
        <td>${modeBadge(p.mode)}</td>
        <td class="td-muted">${p.planName||'â€”'}</td>
        <td class="td-muted" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.note||'â€”'}</td>
        <td><div class="actions-group">
          <button class="btn btn-icon btn-sm" title="Invoice" onclick="openInvoiceModal('${p.id}')">ðŸ§¾</button>
          <button class="btn btn-whatsapp btn-sm" title="Send Receipt via WhatsApp" onclick="sendWA_receipt('${p.id}')">ðŸ’¬</button>
          ${currentUserRole === 'admin' ? `<button class="btn btn-icon btn-sm" title="Delete" onclick="deletePayment('${p.id}')" style="color:var(--danger)">ðŸ—‘ï¸</button>` : ''}
        </div></td>
      </tr>`).join('')}</tbody>
    </table>`;
  renderReceivables();
}

function openPaymentModal(prefillMemberId) {
  document.getElementById('payMember').innerHTML = '<option value="">Select member</option>' +
    S.members.map(m=>`<option value="${m.id}">${m.name} (${m.id})</option>`).join('');
  document.getElementById('payPlan').innerHTML = '<option value="">Select plan</option>' +
    S.plans.map(p=>`<option value="${p.id}">${p.name} â€” ${fmtMoney(p.price)}</option>`).join('');
  document.getElementById('payAmt').value = '';
  document.getElementById('payMode').value = 'Cash';
  document.getElementById('payDate').value = todayStr();
  document.getElementById('payNote').value = '';
  document.getElementById('payDue').value = '0';
  if (prefillMemberId) {
    document.getElementById('payMember').value = prefillMemberId;
    onPayMemberChange();
  }
  openModal('paymentModal');
}

function openRenewalModal(memberId) { openPaymentModal(memberId); }

function onPayMemberChange() {
  const m = getMember(document.getElementById('payMember').value);
  if (m && m.planId) { document.getElementById('payPlan').value = m.planId; onPayPlanChange(); }
}

function onPayPlanChange() {
  const plan = getPlan(document.getElementById('payPlan').value);
  if (plan) document.getElementById('payAmt').value = plan.price;
  updatePayDue();
}

function updatePayDue() {
  const plan = getPlan(document.getElementById('payPlan').value);
  if (!plan) { document.getElementById('payDue').value = '0'; return; }
  const paid = parseFloat(document.getElementById('payAmt').value || 0) || 0;
  const due  = Math.max(0, plan.price - paid);
  document.getElementById('payDue').value = due > 0 ? due : '0';
}

async function savePayment() {
  const memberId = document.getElementById('payMember').value;
  const planId   = document.getElementById('payPlan').value;
  const amt      = parseFloat(document.getElementById('payAmt').value);
  const date     = document.getElementById('payDate').value;

  if (!memberId)      { toast('Select a member','error'); return; }
  if (!amt || amt<=0) { toast('Enter valid amount','error'); return; }
  if (!date)          { toast('Select payment date','error'); return; }

  const member = getMember(memberId);
  const plan   = planId ? getPlan(planId) : null;
  const expiryDate = plan ? addDays(date, plan.days) : '';

  const payment = {
    id: uid('pay'), receiptNo: nextReceiptNo(),
    memberId, memberName: member ? member.name : '',
    amount: amt, mode: document.getElementById('payMode').value,
    planId: planId||'', planName: plan ? plan.name : '',
    date, expiryDate, note: document.getElementById('payNote').value.trim(),
  };
  const amtDue = parseFloat(document.getElementById('payDue').value || 0) || 0;
  showLoader(true);
  try {
    S.payments.push(payment);
    await fsSet('payments', payment.id, payment);
    // Update member plan/expiry
    if (member && plan) {
      const idx = S.members.findIndex(m => m.id === memberId);
      if (idx!==-1) {
        S.members[idx].planId = planId;
        S.members[idx].planName = plan.name;
        S.members[idx].expiryDate = expiryDate;
      }
      await fsUpdate('members', memberId, { planId, planName: plan.name, expiryDate });
    }
    // Record pending due if partial payment
    if (amtDue > 0) {
      const rx = {
        id: uid('rx'), memberId, memberName: member ? member.name : '',
        phone: member ? member.phone : '',
        amount: amtDue,
        description: `Balance for ${plan ? plan.name : 'membership'} (${payment.receiptNo})`,
        relatedReceiptNo: payment.receiptNo, relatedPayId: payment.id,
        createdAt: todayStr(), status: 'pending',
      };
      S.receivables.push(rx);
      await fsSet('receivables', rx.id, rx);
    }
    closeModal('paymentModal');
    toast(`Payment ${payment.receiptNo} recorded!${amtDue>0?' Due: '+fmtMoney(amtDue):''}`, 'success');
    renderPage('payments');
  } catch(e) {
    toast('Error saving payment: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

function deletePayment(id) {
  confirm2('Delete Payment', 'Remove this payment record?', async () => {
    showLoader(true);
    try {
      await fsDelete('payments', id);
      S.payments = S.payments.filter(p => p.id!==id);
      toast('Payment deleted','success');
      renderPayments();
    } catch(e) {
      toast('Error deleting payment: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

function exportCSV() {
  if (!S.payments.length) { toast('No payments to export','warning'); return; }
  const header = ['Receipt No','Date','Member Name','Amount','Mode','Plan','Expiry Date','Note'];
  const rows = S.payments.map(p => [
    p.receiptNo, p.date, `"${p.memberName}"`, p.amount, p.mode,
    `"${p.planName||''}"`, p.expiryDate||'', `"${p.note||''}"`
  ]);
  const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'})),
    download: `musclelab_payments_${todayStr()}.csv`
  });
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Payments exported!','success');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  REPORTS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _currentReportTab = 'monthly';

function setReportTab(tab) {
  _currentReportTab = tab;
  document.querySelectorAll('.rpt-tab').forEach(b => {
    b.classList.toggle('btn-primary',   b.dataset.rpt === tab);
    b.classList.toggle('btn-secondary', b.dataset.rpt !== tab);
  });
  document.querySelectorAll('.rpt-filter').forEach(f => f.style.display = 'none');
  const fEl = document.getElementById('rptFilter_' + tab);
  if (fEl) fEl.style.display = '';
  renderReport();
}

function rptThisMonth() {
  const d = new Date();
  document.getElementById('rptMonth').value = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  renderReport();
}
function rptPrevMonth() {
  const v = document.getElementById('rptMonth').value;
  if (!v) { rptThisMonth(); return; }
  const [y,m] = v.split('-').map(Number);
  const d = new Date(y, m-2, 1);
  document.getElementById('rptMonth').value = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  renderReport();
}
function rptNextMonth() {
  const v = document.getElementById('rptMonth').value;
  if (!v) { rptThisMonth(); return; }
  const [y,m] = v.split('-').map(Number);
  const d = new Date(y, m, 1);
  document.getElementById('rptMonth').value = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  renderReport();
}

function renderReport() {
  const tab = _currentReportTab;
  if (tab === 'monthly')   _rptMonthly();
  else if (tab === 'daterange') _rptDateRange();
  else if (tab === 'dues') _rptDues();
  else if (tab === 'members') _rptMembers();
}

function renderReports() {
  // Populate plan dropdown in members filter
  const ps = document.getElementById('rptMemberPlan');
  if (ps && ps.options.length <= 1) {
    S.plans.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.name;
      ps.appendChild(o);
    });
  }
  // Default month to current
  const rm = document.getElementById('rptMonth');
  if (rm && !rm.value) rptThisMonth();
  else renderReport();
}

// â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _csvDownload(filename, headers, rows, summaryRows) {
  const escape = v => (v === null || v === undefined) ? '' :
    (String(v).includes(',') || String(v).includes('"') || String(v).includes('\n'))
      ? `"${String(v).replace(/"/g,'""')}"` : String(v);
  const lines = [
    headers.map(escape).join(','),
    ...rows.map(r => r.map(escape).join(',')),
    '',
    ...(summaryRows||[]).map(r => r.map(escape).join(',')),
  ];
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], {type:'text/csv;charset=utf-8;'});
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: filename
  });
  a.click(); URL.revokeObjectURL(a.href);
  toast('Exported: ' + filename, 'success');
}

function _setSummary(items) {
  const el = document.getElementById('rptSummary');
  if (!el) return;
  el.innerHTML = items.map(s =>
    `<div class="stat-card ${s.cls||''}">
      <span class="stat-icon">${s.icon}</span>
      <div class="stat-number ${s.cls||''}">${s.val}</div>
      <div class="stat-label">${s.label}</div>
    </div>`
  ).join('');
}

function _setTable(headers, rows, emptyMsg) {
  const wrap = document.getElementById('rptTable');
  const rc   = document.getElementById('rptRowCount');
  if (!rows.length) {
    if (wrap) wrap.innerHTML = `<div class="empty-state" style="padding:40px"><div class="empty-icon">ðŸ“‹</div><div class="empty-title">${emptyMsg||'No data'}</div></div>`;
    if (rc) rc.textContent = '0 records';
    return;
  }
  if (rc) rc.textContent = `${rows.length} record${rows.length!==1?'s':''}`;
  const thCells = headers.map(h => `<th>${h}</th>`).join('');
  const tRows   = rows.map(r =>
    `<tr>${r.map((c,i) => `<td ${i===headers.length-1&&typeof c==='number'?'style="text-align:right;font-weight:700;color:var(--success)"':''>${c!==undefined&&c!==null?c:'â€”'}</td>`).join('')}</tr>`
  ).join('');
  if (wrap) wrap.innerHTML = `<table><thead><tr>${thCells}</tr></thead><tbody>${tRows}</tbody></table>`;
}

// â”€â”€ Monthly Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _rptMonthly() {
  const mv = document.getElementById('rptMonth')?.value;
  if (!mv) { _setSummary([]); _setTable([],[],'Select a month above'); return; }

  const pays = S.payments.filter(p => p.date && p.date.startsWith(mv));
  const ptPays = S.personalTraining.filter(pt => pt.date && pt.date.startsWith(mv));
  const ptTotal = ptPays.reduce((s,pt)=>s+Number(pt.amount||0),0);
  const total  = pays.reduce((s,p) => s+Number(p.amount||0), 0) + ptTotal;
  const cash   = pays.filter(p=>p.mode==='Cash').reduce((s,p)=>s+Number(p.amount||0),0);
  const upi    = pays.filter(p=>p.mode==='UPI').reduce((s,p)=>s+Number(p.amount||0),0);
  const card   = pays.filter(p=>p.mode==='Card').reduce((s,p)=>s+Number(p.amount||0),0);

  // New members joined this month
  const newMembers = S.members.filter(m => m.joinDate && m.joinDate.startsWith(mv));

  // Dues created this month
  const dues = S.receivables.filter(r => r.createdAt && r.createdAt.startsWith(mv) && r.status==='pending');
  const dueTotal = dues.reduce((s,r)=>s+Number(r.amount||0),0);

  _setSummary([
    { icon:'ðŸ’°', val: fmtMoney(total),        label:'Total Collection', cls:'blue'   },
    { icon:'ðŸ’µ', val: fmtMoney(cash),          label:'Cash',             cls:''       },
    { icon:'ðŸ“±', val: fmtMoney(upi),           label:'UPI',              cls:''       },
    { icon:'ðŸ’³', val: fmtMoney(card),          label:'Card',             cls:''       },
    { icon:'🏋️', val: fmtMoney(ptTotal),       label:'Personal Training',cls:'purple' },
    { icon:'ðŸ‘¥', val: newMembers.length,        label:'New Members',      cls:'green'  },
    { icon:'âš ï¸', val: fmtMoney(dueTotal),      label:'Dues Created',     cls:'orange' },
  ]);

  const headers = ['Receipt No','Date','Member Name','Phone','Plan','Amount (â‚¹)','Mode','Expiry Date','Note'];
  const rows = pays.map(p => {
    const m = getMember(p.memberId);
    return [p.receiptNo, fmtDate(p.date), p.memberName, m?m.phone:'', p.planName||'', Number(p.amount||0), p.mode, fmtDate(p.expiryDate), p.note||''];
  });

  _setTable(headers, rows, 'No payments found for this month');
}

// â”€â”€ Date Range â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _rptDateRange() {
  const from = document.getElementById('rptFrom')?.value || '';
  const to   = document.getElementById('rptTo')?.value   || '';
  const mode = document.getElementById('rptMode')?.value || 'all';
  const q    = (document.getElementById('rptMemberQ')?.value||'').toLowerCase();

  let pays = [...S.payments];
  if (from) pays = pays.filter(p => p.date >= from);
  if (to)   pays = pays.filter(p => p.date <= to);
  if (mode !== 'all') pays = pays.filter(p => p.mode === mode);
  if (q) pays = pays.filter(p =>
    p.memberName.toLowerCase().includes(q) ||
    (getMember(p.memberId)?.phone||'').includes(q)
  );
  pays.sort((a,b) => (b.date||'').localeCompare(a.date||''));

  const total = pays.reduce((s,p)=>s+Number(p.amount||0),0);
  const cash  = pays.filter(p=>p.mode==='Cash').reduce((s,p)=>s+Number(p.amount||0),0);
  const upi   = pays.filter(p=>p.mode==='UPI').reduce((s,p)=>s+Number(p.amount||0),0);
  const card  = pays.filter(p=>p.mode==='Card').reduce((s,p)=>s+Number(p.amount||0),0);

  _setSummary([
    { icon:'ðŸ’°', val: fmtMoney(total), label:'Total',    cls:'blue' },
    { icon:'ðŸ’µ', val: fmtMoney(cash),  label:'Cash',     cls:''     },
    { icon:'ðŸ“±', val: fmtMoney(upi),   label:'UPI',      cls:''     },
    { icon:'ðŸ’³', val: fmtMoney(card),  label:'Card',     cls:''     },
    { icon:'ðŸ§¾', val: pays.length,     label:'Receipts', cls:''     },
  ]);

  const headers = ['Receipt No','Date','Member Name','Phone','Plan','Amount (â‚¹)','Mode','Expiry Date','Note'];
  const rows = pays.map(p => {
    const m = getMember(p.memberId);
    return [p.receiptNo, fmtDate(p.date), p.memberName, m?m.phone:'', p.planName||'', Number(p.amount||0), p.mode, fmtDate(p.expiryDate), p.note||''];
  });
  _setTable(headers, rows, 'No payments match the selected filters');
}

// â”€â”€ Pending Dues â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _rptDues() {
  const statusFilter = document.getElementById('rptDueStatus')?.value || 'pending';
  const rxList = statusFilter === 'all'
    ? [...S.receivables]
    : S.receivables.filter(r => r.status === 'pending');
  rxList.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));

  const total     = rxList.reduce((s,r)=>s+Number(r.amount||0),0);
  const pendCount = rxList.filter(r=>r.status==='pending').length;
  const paidCount = rxList.filter(r=>r.status==='collected').length;

  _setSummary([
    { icon:'âš ï¸', val: pendCount,        label:'Pending',   cls:'orange' },
    { icon:'âœ…', val: paidCount,        label:'Collected', cls:'green'  },
    { icon:'ðŸ’°', val: fmtMoney(total),  label:'Total Due', cls:'red'    },
  ]);

  const headers = ['Date','Member Name','Phone','Description','Amount Due (â‚¹)','Status','Receipt No'];
  const rows = rxList.map(r => [
    fmtDate(r.createdAt), r.memberName, r.phone, r.description,
    Number(r.amount||0), r.status==='pending'?'Pending':'Collected', r.relatedReceiptNo||''
  ]);
  _setTable(headers, rows, 'No dues records found');
}

// â”€â”€ Member List â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _rptMembers() {
  const statusF = document.getElementById('rptMemberStatus')?.value || 'all';
  const planF   = document.getElementById('rptMemberPlan')?.value   || 'all';

  let list = S.members.map(m => ({ ...m, _status: getMemberStatus(m.expiryDate) }));
  if (statusF !== 'all') list = list.filter(m => m._status === statusF);
  if (planF   !== 'all') list = list.filter(m => m.planId === planF);
  list.sort((a,b) => (a.name||'').localeCompare(b.name||''));

  const active   = list.filter(m=>m._status==='Active').length;
  const expiring = list.filter(m=>m._status==='Expiring').length;
  const expired  = list.filter(m=>m._status==='Expired').length;

  // Calc each member's pending due
  const memberDue = id => S.receivables
    .filter(r=>r.memberId===id&&r.status==='pending')
    .reduce((s,r)=>s+Number(r.amount||0),0);

  _setSummary([
    { icon:'ðŸ‘¥', val: list.length,  label:'Total',    cls:''       },
    { icon:'ðŸ’ª', val: active,       label:'Active',   cls:'green'  },
    { icon:'â³', val: expiring,     label:'Expiring', cls:'orange' },
    { icon:'âŒ', val: expired,      label:'Expired',  cls:'red'    },
  ]);

  const headers = ['Member ID','Name','Phone','Email','Plan','Join Date','Expiry Date','Status','Pending Due (â‚¹)'];
  const rows = list.map(m => [
    m.id, m.name, m.phone, m.email||'', m.planName||'',
    fmtDate(m.joinDate), fmtDate(m.expiryDate), m._status,
    memberDue(m.id)||0
  ]);
  _setTable(headers, rows, 'No members match the selected filters');
}

// â”€â”€ Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function exportReport() {
  const tab = _currentReportTab;
  const d   = new Date();

  if (tab === 'monthly') {
    const mv = document.getElementById('rptMonth')?.value || '';
    const pays = S.payments.filter(p => p.date && p.date.startsWith(mv));
    if (!pays.length) { toast('No data to export','warning'); return; }
    const total = pays.reduce((s,p)=>s+Number(p.amount||0),0);
    const cash  = pays.filter(p=>p.mode==='Cash').reduce((s,p)=>s+Number(p.amount||0),0);
    const upi   = pays.filter(p=>p.mode==='UPI').reduce((s,p)=>s+Number(p.amount||0),0);
    const card  = pays.filter(p=>p.mode==='Card').reduce((s,p)=>s+Number(p.amount||0),0);
    const heads  = ['Receipt No','Date','Member Name','Phone','Plan','Amount','Mode','Expiry Date','Note'];
    const rows   = pays.map(p => {
      const m = getMember(p.memberId);
      return [p.receiptNo, p.date, p.memberName, m?m.phone:'', p.planName||'', p.amount, p.mode, p.expiryDate||'', p.note||''];
    });
    const summary = [
      [''],['--- SUMMARY ---'],
      ['Total Collection','','','','',total],
      ['Cash','','','','',cash],
      ['UPI','','','','',upi],
      ['Card','','','','',card],
      ['New Members',S.members.filter(m=>m.joinDate&&m.joinDate.startsWith(mv)).length],
    ];
    _csvDownload(`musclelab_monthly_${mv}.csv`, heads, rows, summary);

  } else if (tab === 'daterange') {
    const from = document.getElementById('rptFrom')?.value || '';
    const to   = document.getElementById('rptTo')?.value   || '';
    const mode = document.getElementById('rptMode')?.value || 'all';
    const q    = (document.getElementById('rptMemberQ')?.value||'').toLowerCase();
    let pays = [...S.payments];
    if (from) pays = pays.filter(p=>p.date>=from);
    if (to)   pays = pays.filter(p=>p.date<=to);
    if (mode!=='all') pays = pays.filter(p=>p.mode===mode);
    if (q) pays = pays.filter(p=>p.memberName.toLowerCase().includes(q)||(getMember(p.memberId)?.phone||'').includes(q));
    if (!pays.length) { toast('No data to export','warning'); return; }
    const total = pays.reduce((s,p)=>s+Number(p.amount||0),0);
    const heads = ['Receipt No','Date','Member Name','Phone','Plan','Amount','Mode','Expiry Date','Note'];
    const rows  = pays.map(p => {
      const m = getMember(p.memberId);
      return [p.receiptNo, p.date, p.memberName, m?m.phone:'', p.planName||'', p.amount, p.mode, p.expiryDate||'', p.note||''];
    });
    const summary = [[''],['--- SUMMARY ---'],['Total','','','','',total],['Receipts',pays.length]];
    _csvDownload(`musclelab_payments_${from||'all'}_to_${to||'all'}.csv`, heads, rows, summary);

  } else if (tab === 'dues') {
    const statusFilter = document.getElementById('rptDueStatus')?.value || 'pending';
    const rxList = statusFilter === 'all' ? [...S.receivables] : S.receivables.filter(r=>r.status==='pending');
    if (!rxList.length) { toast('No dues to export','warning'); return; }
    const heads = ['Date','Member Name','Phone','Description','Amount Due','Status','Receipt No'];
    const rows  = rxList.map(r => [r.createdAt, r.memberName, r.phone, r.description, r.amount, r.status, r.relatedReceiptNo||'']);
    const total = rxList.reduce((s,r)=>s+Number(r.amount||0),0);
    const summary = [[''],['--- SUMMARY ---'],['Total Dues','','','',total]];
    _csvDownload(`musclelab_dues_${todayStr()}.csv`, heads, rows, summary);

  } else if (tab === 'members') {
    const statusF = document.getElementById('rptMemberStatus')?.value || 'all';
    const planF   = document.getElementById('rptMemberPlan')?.value   || 'all';
    let list = S.members.map(m => ({ ...m, _status: getMemberStatus(m.expiryDate) }));
    if (statusF !== 'all') list = list.filter(m=>m._status===statusF);
    if (planF   !== 'all') list = list.filter(m=>m.planId===planF);
    if (!list.length) { toast('No members to export','warning'); return; }
    const memberDue = id => S.receivables.filter(r=>r.memberId===id&&r.status==='pending').reduce((s,r)=>s+Number(r.amount||0),0);
    const heads = ['Member ID','Name','Phone','Email','Plan','Join Date','Expiry Date','Status','Pending Due'];
    const rows  = list.map(m => [m.id, m.name, m.phone, m.email||'', m.planName||'', m.joinDate||'', m.expiryDate||'', m._status, memberDue(m.id)||0]);
    const summary = [[''],['--- SUMMARY ---'],['Total Members',list.length],['Active',list.filter(m=>m._status==='Active').length],['Expired',list.filter(m=>m._status==='Expired').length]];
    _csvDownload(`musclelab_members_${todayStr()}.csv`, heads, rows, summary);
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  RECEIVABLES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderDuesPage() {
  const pending = S.receivables.filter(r => r.status === 'pending');
  const total   = pending.reduce((s,r) => s + Number(r.amount||0), 0);
  const badge   = document.getElementById('duesPageBadge');
  if (badge) badge.textContent = pending.length;

  const strip = document.getElementById('duesSummaryStrip');
  if (strip) {
    const uniqueMembers = [...new Set(pending.map(r => r.memberId))].length;
    strip.innerHTML = [
      { icon:'âš ï¸', val: pending.length,     label:'Open Dues',        cls:'orange' },
      { icon:'ðŸ‘¥', val: uniqueMembers,      label:'Members Affected', cls:'' },
      { icon:'ðŸ’°', val: fmtMoney(total),    label:'Total Pending',    cls:'red'  },
    ].map(s => `<div class="stat-card ${s.cls}">
      <span class="stat-icon">${s.icon}</span>
      <div class="stat-number ${s.cls}">${s.val}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
  }

  const wrap = document.getElementById('duesPageTable');
  if (!wrap) return;
  if (!pending.length) {
    wrap.innerHTML = `<div class="empty-state" style="padding:48px">
      <div class="empty-icon">âœ…</div>
      <div class="empty-title">No Pending Dues</div>
      <div class="empty-text">All members are fully paid up. Great job!</div>
    </div>`;
    return;
  }

  const canCollect = ['admin','receptionist'].includes(currentUserRole);
  const sorted = [...pending].sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));

  wrap.innerHTML = `
    <table>
      <thead><tr>
        <th>Date</th><th>Member</th><th>Phone</th><th>Description</th>
        <th style="text-align:right">Amount Due</th><th>Actions</th>
      </tr></thead>
      <tbody>${sorted.map(r => `<tr>
        <td class="td-muted">${fmtDate(r.createdAt)}</td>
        <td><strong>${r.memberName}</strong></td>
        <td class="td-muted">${r.phone}</td>
        <td class="td-muted" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.description}</td>
        <td style="text-align:right;color:var(--warning);font-weight:700;font-size:14px">${fmtMoney(r.amount)}</td>
        <td><div class="actions-group">
          ${canCollect ? `<button class="btn btn-success btn-sm" onclick="openCollectModal('${r.id}')">&#128176; Collect</button>` : '<span class="badge badge-gray" style="font-size:11px">View only</span>'}
          ${r.relatedPayId ? `<button class="btn btn-icon btn-sm" title="View Invoice" onclick="openInvoiceModal('${r.relatedPayId}')">&#129534;</button>` : ''}
          <button class="btn btn-whatsapp btn-sm" onclick="sendWA_due('${r.id}')">&#128172; Remind</button>
          ${canCollect ? `<button class="btn btn-icon btn-sm" onclick="deleteReceivable('${r.id}')" style="color:var(--danger)">&#128465;</button>` : ''}
        </div></td>
      </tr>`).join('')}
      </tbody>
    </table>`;
}

function getLastPaymentId(memberId) {
  const pays = S.payments.filter(p => p.memberId === memberId);
  if (!pays.length) return null;
  return pays.reduce((a,b) => (a.date||'') >= (b.date||'') ? a : b).id;
}

function renderReceivables() {
  const pending = S.receivables.filter(r => r.status === 'pending');
  const badge = document.getElementById('receivablesBadge');
  if (badge) badge.textContent = pending.length;
  const wrap = document.getElementById('receivablesTable');
  if (!wrap) return;
  if (!pending.length) {
    wrap.innerHTML = `<div class="empty-state" style="padding:28px"><div class="empty-icon">âœ…</div><div class="empty-title">No Pending Dues</div><div class="empty-text">All payments are fully collected.</div></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Member</th><th>Phone</th><th>Description</th><th>Amount Due</th><th>Actions</th></tr></thead>
      <tbody>${pending.map(r=>`<tr>
        <td class="td-muted">${fmtDate(r.createdAt)}</td>
        <td><strong>${r.memberName}</strong></td>
        <td class="td-muted">${r.phone}</td>
        <td class="td-muted">${r.description}</td>
        <td class="pending-due-amt">${fmtMoney(r.amount)}</td>
        <td><div class="actions-group">
          <button class="btn btn-success btn-sm" onclick="openCollectModal('${r.id}')">ðŸ’° Collect</button>
          ${r.relatedPayId ? `<button class="btn btn-icon btn-sm" title="View Invoice" onclick="openInvoiceModal('${r.relatedPayId}')">ðŸ§¾</button>` : ''}
          <button class="btn btn-whatsapp btn-sm" onclick="sendWA_due('${r.id}')">ðŸ’¬</button>
          <button class="btn btn-icon btn-sm" onclick="deleteReceivable('${r.id}')" style="color:var(--danger)">ðŸ—‘ï¸</button>
        </div></td>
      </tr>`).join('')}</tbody>
    </table>`;
}

function openCollectModal(rxId) {
  _collectRxId = rxId;
  const rx = S.receivables.find(r => r.id === rxId);
  if (!rx) return;
  document.getElementById('collectInfo').innerHTML =
    `<strong>${rx.memberName}</strong> &nbsp;Â·&nbsp; ${rx.phone}<br>
     <span style="color:var(--text2)">${rx.description}</span><br>
     <strong style="color:var(--warning)">${fmtMoney(rx.amount)} outstanding</strong>`;
  document.getElementById('collectAmt').value = rx.amount;
  document.getElementById('collectMode').value = 'Cash';
  document.getElementById('collectDate').value = todayStr();
  document.getElementById('collectNote').value = '';
  openModal('collectModal');
}

async function saveCollect() {
  const rx = S.receivables.find(r => r.id === _collectRxId);
  if (!rx) return;
  const amt  = parseFloat(document.getElementById('collectAmt').value);
  const mode = document.getElementById('collectMode').value;
  const date = document.getElementById('collectDate').value;
  if (!amt || amt <= 0) { toast('Enter valid amount','error'); return; }
  if (!date) { toast('Select date','error'); return; }
  showLoader(true);
  try {
    const payment = {
      id: uid('pay'), receiptNo: nextReceiptNo(),
      memberId: rx.memberId, memberName: rx.memberName,
      amount: amt, mode, planId: '', planName: '',
      date, expiryDate: '',
      note: `Due collection: ${rx.description}${document.getElementById('collectNote').value.trim() ? ' Â· ' + document.getElementById('collectNote').value.trim() : ''}`,
    };
    S.payments.push(payment);
    await fsSet('payments', payment.id, payment);
    const remaining = Math.max(0, rx.amount - amt);
    if (remaining <= 0) {
      await fsUpdate('receivables', rx.id, { status: 'collected', collectedAt: todayStr() });
      const idx = S.receivables.findIndex(r => r.id === rx.id);
      if (idx !== -1) S.receivables[idx].status = 'collected';
      toast(`Due fully collected! Receipt ${payment.receiptNo}`, 'success');
    } else {
      await fsUpdate('receivables', rx.id, { amount: remaining });
      const idx = S.receivables.findIndex(r => r.id === rx.id);
      if (idx !== -1) S.receivables[idx].amount = remaining;
      toast(`Collected ${fmtMoney(amt)}. Remaining due: ${fmtMoney(remaining)}`, 'info');
    }
    closeModal('collectModal');
    renderPage('payments');
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

function deleteReceivable(id) {
  confirm2('Remove Due', 'Remove this pending due record?', async () => {
    showLoader(true);
    try {
      await fsDelete('receivables', id);
      S.receivables = S.receivables.filter(r => r.id !== id);
      toast('Due removed','success');
      renderReceivables();
    } catch(e) {
      toast('Error: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  ENQUIRIES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderEnquiries() {
  const q  = (document.getElementById('enqSearch')?.value||'').toLowerCase();
  const sf = document.getElementById('enqStatusFilter')?.value||'all';
  const today = todayStr();

  const list = [...S.enquiries].reverse().filter(e => {
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.phone.includes(q);
    const matchS = sf==='all' || e.status===sf;
    return matchQ && matchS;
  });

  const wrap = document.getElementById('enquiriesTable');
  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">ðŸ“‹</div><div class="empty-title">No Enquiries Found</div><button class="btn btn-primary" onclick="openEnquiryModal()">âž• Add Enquiry</button></div>`;
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Plan Interest</th><th>Source</th><th>Status</th><th>Follow Up</th><th>Actions</th></tr></thead>
      <tbody>${list.map(e => {
        const overdue = e.followUpDate && e.followUpDate < today && e.status!=='Converted' && e.status!=='Lost';
        return `<tr>
          <td class="td-muted">${fmtDate(e.date)}</td>
          <td><strong>${e.name}</strong></td>
          <td class="td-muted">${e.phone}</td>
          <td class="td-muted">${e.interestedPlan||'â€”'}</td>
          <td class="td-muted">${e.source}</td>
          <td style="display:flex;align-items:center;gap:6px;padding-top:14px">
            ${enqBadge(e.status)}
            <select class="status-select" onchange="updateEnqStatus('${e.id}',this.value)">
              ${['New','Contacted','Interested','Converted','Lost'].map(s=>`<option value="${s}" ${e.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </td>
          <td class="${overdue?'overdue':'td-muted'}">${e.followUpDate?fmtDate(e.followUpDate):'â€”'}${overdue?' âš ï¸':''}</td>
          <td><div class="actions-group">
            <button class="btn btn-icon btn-sm" title="Edit" onclick="openEnquiryModal('${e.id}')">âœï¸</button>
            <button class="btn btn-whatsapp btn-sm" title="WhatsApp" onclick="sendWA_enquiry('${e.id}')">ðŸ’¬</button>
            <button class="btn btn-icon btn-sm" title="Delete" onclick="deleteEnquiry('${e.id}')" style="color:var(--danger)">ðŸ—‘ï¸</button>
          </div></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

function openEnquiryModal(enqId) {
  S.editEnqId = enqId || null;
  document.getElementById('enquiryModalTitle').textContent = enqId ? 'Edit Enquiry' : 'Add Enquiry';
  document.getElementById('eqPlan').innerHTML = '<option value="">Select plan</option>' +
    S.plans.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');

  if (enqId) {
    const e = S.enquiries.find(x=>x.id===enqId);
    if (!e) return;
    document.getElementById('eqName').value = e.name;
    document.getElementById('eqPhone').value = e.phone;
    document.getElementById('eqEmail').value = e.email||'';
    document.getElementById('eqPlan').value = e.interestedPlan||'';
    document.getElementById('eqSource').value = e.source;
    document.getElementById('eqFollowUp').value = e.followUpDate||'';
    document.getElementById('eqNotes').value = e.notes||'';
  } else {
    ['eqName','eqPhone','eqEmail','eqNotes'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('eqPlan').value='';
    document.getElementById('eqSource').value='Walk-in';
    document.getElementById('eqFollowUp').value='';
  }
  openModal('enquiryModal');
}

async function saveEnquiry() {
  const name  = document.getElementById('eqName').value.trim();
  const phone = document.getElementById('eqPhone').value.trim();
  if (!name)  { toast('Enter name','error'); return; }
  if (!phone) { toast('Enter phone number','error'); return; }

  const data = {
    name, phone,
    email: document.getElementById('eqEmail').value.trim(),
    interestedPlan: document.getElementById('eqPlan').value,
    source: document.getElementById('eqSource').value,
    followUpDate: document.getElementById('eqFollowUp').value,
    notes: document.getElementById('eqNotes').value.trim(),
  };

  showLoader(true);
  try {
    if (S.editEnqId) {
      const idx = S.enquiries.findIndex(e=>e.id===S.editEnqId);
      if (idx!==-1) S.enquiries[idx] = { ...S.enquiries[idx], ...data };
      await fsUpdate('enquiries', S.editEnqId, data);
      toast('Enquiry updated!','success');
    } else {
      const id = uid('enq');
      const enq = { id, date: todayStr(), status: 'New', ...data };
      S.enquiries.push(enq);
      await fsSet('enquiries', id, enq);
      toast('Enquiry added!','success');
    }
  } catch(e) {
    toast('Error saving enquiry: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
  S.editEnqId = null;
  closeModal('enquiryModal');
  renderEnquiries();
}

async function updateEnqStatus(id, status) {
  const idx = S.enquiries.findIndex(e=>e.id===id);
  if (idx!==-1) {
    S.enquiries[idx].status = status;
    try {
      await fsUpdate('enquiries', id, { status });
      toast(`Status â†’ ${status}`,'info');
    } catch(e) {
      toast('Error updating status: ' + e.message, 'error');
    }
  }
}

function deleteEnquiry(id) {
  confirm2('Delete Enquiry','Remove this enquiry?', async ()=>{
    showLoader(true);
    try {
      await fsDelete('enquiries', id);
      S.enquiries = S.enquiries.filter(e=>e.id!==id);
      toast('Enquiry deleted','success');
      renderEnquiries();
    } catch(e) {
      toast('Error deleting enquiry: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  STAFF
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderStaff() {
  const grid = document.getElementById('staffGrid');
  if (!S.staff.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">ðŸ‘¨â€ðŸ’¼</div><div class="empty-title">No Staff Added</div><button class="btn btn-primary" onclick="openStaffModal()">âž• Add Staff</button></div>`;
    return;
  }
  const rc = { Admin:'role-admin', Receptionist:'role-receptionist', Trainer:'role-trainer' };
  grid.innerHTML = S.staff.map(s=>`
    <div class="staff-card">
      <div class="staff-avatar">${s.photo?`<img src="${s.photo}" alt="">`:'ðŸ‘¤'}</div>
      <div class="staff-name">${s.name}</div>
      <span class="staff-role ${rc[s.role]||''}">${s.role}</span>
      <div class="staff-info">
        ðŸ“ž ${s.phone}${s.email?`<br>ðŸ“§ ${s.email}`:''}<br>
        ðŸ“… Joined ${fmtDate(s.joinDate)}${s.salary?`<br>ðŸ’° ${fmtMoney(s.salary)}/month`:''}
      </div>
      <div class="staff-actions">
        <button class="btn btn-secondary btn-sm" onclick="openStaffModal('${s.id}')">âœï¸ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStaff('${s.id}')">ðŸ—‘ï¸ Delete</button>
      </div>
    </div>`).join('');
}

function openStaffModal(staffId) {
  S.editStaffId = staffId || null;
  document.getElementById('staffModalTitle').textContent = staffId ? 'Edit Staff' : 'Add Staff';
  const photoInput = document.getElementById('sfPhoto');
  photoInput.value = '';
  delete photoInput.dataset.img;
  if (staffId) {
    const s = S.staff.find(x=>x.id===staffId);
    if (!s) return;
    document.getElementById('sfName').value = s.name;
    document.getElementById('sfPhone').value = s.phone;
    document.getElementById('sfEmail').value = s.email||'';
    document.getElementById('sfRole').value = s.role;
    document.getElementById('sfSalary').value = s.salary||'';
    document.getElementById('sfJoinDate').value = s.joinDate||'';
    document.getElementById('sfPhotoPreview').innerHTML = s.photo
      ? `<img src="${s.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">` : '';
  } else {
    ['sfName','sfPhone','sfEmail','sfSalary'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('sfRole').value = 'Trainer';
    document.getElementById('sfJoinDate').value = todayStr();
    document.getElementById('sfPhotoPreview').innerHTML = '';
  }
  openModal('staffModal');
}

async function saveStaff() {
  const name  = document.getElementById('sfName').value.trim();
  const phone = document.getElementById('sfPhone').value.trim();
  if (!name)  { toast('Enter name','error'); return; }
  if (!phone) { toast('Enter phone','error'); return; }

  const photoInput = document.getElementById('sfPhoto');
  const newPhoto = photoInput.dataset.img || null;
  const data = {
    name, phone,
    email: document.getElementById('sfEmail').value.trim(),
    role: document.getElementById('sfRole').value,
    salary: document.getElementById('sfSalary').value||'',
    joinDate: document.getElementById('sfJoinDate').value,
  };

  showLoader(true);
  try {
    if (S.editStaffId) {
      const photoUpdate = newPhoto ? { photo: newPhoto } : {};
      const idx = S.staff.findIndex(s=>s.id===S.editStaffId);
      if (idx!==-1) S.staff[idx] = { ...S.staff[idx], ...data, ...photoUpdate };
      await fsUpdate('staff', S.editStaffId, { ...data, ...photoUpdate });
      toast('Staff updated!','success');
    } else {
      const id = uid('stf');
      const staffObj = { id, ...data, photo: newPhoto || '' };
      S.staff.push(staffObj);
      await fsSet('staff', id, staffObj);
      toast('Staff added!','success');
    }
  } catch(e) {
    toast('Error saving staff: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
  S.editStaffId = null;
  closeModal('staffModal');
  renderStaff();
}

function deleteStaff(id) {
  const s = S.staff.find(x=>x.id===id);
  if (!s) return;
  confirm2('Delete Staff', `Remove ${s.name} from staff?`, async ()=>{
    showLoader(true);
    try {
      await fsDelete('staff', id);
      S.staff = S.staff.filter(x=>x.id!==id);
      toast('Staff removed','success');
      renderStaff();
    } catch(e) {
      toast('Error deleting staff: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  ANALYTICS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderAnalytics() {
  // Destroy previous charts
  Object.values(S.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  S.charts = {};

  const totalRev  = S.payments.reduce((s,p)=>s+Number(p.amount||0),0)
    + S.personalTraining.reduce((s,pt)=>s+Number(pt.amount||0),0);
  const active    = S.members.filter(m=>getMemberStatus(m.expiryDate)!=='Expired').length;
  const converted = S.enquiries.filter(e=>e.status==='Converted').length;
  const convRate  = S.enquiries.length ? Math.round(converted/S.enquiries.length*100) : 0;

  document.getElementById('analyticsStats').innerHTML = [
    { icon:'ðŸ’°', val: fmtMoney(totalRev), label:'Total Revenue',     cls:'blue' },
    { icon:'ðŸ’ª', val: active,             label:'Active Members',    cls:'green' },
    { icon:'ðŸŽ¯', val: convRate+'%',        label:'Conversion Rate',   cls:'purple' },
    { icon:'ðŸ“‹', val: S.enquiries.length,  label:'Total Enquiries',   cls:'orange' },
  ].map(s=>`<div class="stat-card ${s.cls}"><span class="stat-icon">${s.icon}</span><div class="stat-number ${s.cls}">${s.val}</div><div class="stat-label">${s.label}</div></div>`).join('');

  // Build last 6 month labels and keys
  const labels=[], keys=[];
  for (let i=5;i>=0;i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth()-i);
    labels.push(d.toLocaleString('default',{month:'short',year:'2-digit'}));
    keys.push(`${d.getFullYear()}-${pad2(d.getMonth()+1)}`);
  }

  const cOpts = (prefix='') => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend:{display:false}, tooltip:{ callbacks:{ label: ctx => prefix ? `${prefix}${(ctx.parsed.y||0).toLocaleString('en-IN')}` : String(ctx.parsed.y) } } },
    scales: {
      x: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#666', font:{size:11} } },
      y: { grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#666', font:{size:11} }, beginAtZero:true },
    }
  });

  const pieOpts = () => ({
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ position:'bottom', labels:{ color:'#888', padding:10, font:{size:11} } } }
  });

  const COLORS = ['#E31E24','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899','#14b8a6'];

  // Revenue (membership + personal training)
  const revData = keys.map(k =>
    S.payments.filter(p=>p.date&&p.date.startsWith(k)).reduce((s,p)=>s+Number(p.amount||0),0) +
    S.personalTraining.filter(pt=>pt.date&&pt.date.startsWith(k)).reduce((s,pt)=>s+Number(pt.amount||0),0)
  );
  S.charts.rev = new Chart(document.getElementById('chartRevenue'), {
    type:'bar',
    data:{ labels, datasets:[{ label:'Revenue', data:revData, backgroundColor:'rgba(227,30,36,0.65)', borderColor:'#E31E24', borderWidth:2, borderRadius:6 }] },
    options: cOpts('â‚¹')
  });

  // New members
  const memData = keys.map(k => S.members.filter(m=>m.joinDate&&m.joinDate.startsWith(k)).length);
  S.charts.mem = new Chart(document.getElementById('chartMembers'), {
    type:'line',
    data:{ labels, datasets:[{ label:'Members', data:memData, borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', borderWidth:2.5, fill:true, tension:0.4, pointBackgroundColor:'#3b82f6', pointRadius:4 }] },
    options: cOpts()
  });

  // Plan distribution
  const planMap = {};
  S.members.forEach(m => { if(m.planName) planMap[m.planName]=(planMap[m.planName]||0)+1; });
  S.charts.plans = new Chart(document.getElementById('chartPlans'), {
    type:'doughnut',
    data:{ labels: Object.keys(planMap).length?Object.keys(planMap):['No Data'], datasets:[{ data: Object.values(planMap).length?Object.values(planMap):[1], backgroundColor: COLORS, borderColor:'#111', borderWidth:3 }] },
    options: pieOpts()
  });

  // Enquiry sources
  const srcMap = {};
  S.enquiries.forEach(e => { srcMap[e.source]=(srcMap[e.source]||0)+1; });
  S.charts.src = new Chart(document.getElementById('chartSources'), {
    type:'pie',
    data:{ labels: Object.keys(srcMap).length?Object.keys(srcMap):['No Data'], datasets:[{ data: Object.values(srcMap).length?Object.values(srcMap):[1], backgroundColor: COLORS.slice().reverse(), borderColor:'#111', borderWidth:3 }] },
    options: pieOpts()
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  INVOICE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openInvoiceModal(payId) {
  _invoicePayId = payId;
  const p  = S.payments.find(x => x.id === payId);
  if (!p) return;
  const m  = getMember(p.memberId);
  const gs = S.gymSettings;
  const gymName = getGymName();

  // Look up pending due for this payment (if any)
  const rx = S.receivables.find(r => r.relatedPayId === payId && r.status === 'pending');
  const amtDue = rx ? rx.amount : 0;

  document.getElementById('invoiceBody').innerHTML = buildInvoiceHTML(p, m, gs, gymName, amtDue);
  openModal('invoiceModal');
}

function buildInvoiceHTML(p, m, gs, gymName, amtDue) {
  const planAmt = (p.amount || 0) + (amtDue || 0);
  const paid    = p.amount || 0;
  const due     = amtDue || 0;

  // â”€â”€ small helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const INR = n => '&#8377;' + Number(n).toLocaleString('en-IN');
  const lbl = (text) =>
    `<div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
       color:#E31E24;margin-bottom:10px;padding-bottom:6px;
       border-bottom:2px solid #E31E24;display:inline-block">${text}</div>`;

  return `
<div id="invoiceContent"
  style="background:#FFFFFF;color:#1a1a1a;
         font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
         width:100%;max-width:700px;margin:0 auto;
         border:1px solid #e8e8e8;border-radius:2px;
         box-shadow:0 4px 24px rgba(0,0,0,0.08)">

  <!-- â•â• HEADER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="padding:36px 40px 28px;display:flex;justify-content:space-between;align-items:flex-start">

    <!-- Left: Gym branding -->
    <div style="display:flex;align-items:center;gap:14px">
      <!-- Logo placeholder -->
      <div style="width:52px;height:52px;background:#0a0a0a;border-radius:4px;
                  display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <div style="font-size:9px;font-weight:900;color:#E31E24;letter-spacing:1px;
                    line-height:1.1;text-align:center">M<br>LAB</div>
      </div>
      <div>
        <div style="font-size:22px;font-weight:900;color:#0a0a0a;letter-spacing:-0.5px;
                    line-height:1">${gymName}</div>
        ${gs.address
          ? `<div style="font-size:10.5px;color:#888;margin-top:4px;line-height:1.5;max-width:220px">${gs.address}</div>`
          : ''}
        ${gs.phone
          ? `<div style="font-size:10.5px;color:#888">Tel: ${gs.phone}</div>`
          : ''}
      </div>
    </div>

    <!-- Right: INVOICE label + meta -->
    <div style="text-align:right">
      <div style="font-size:36px;font-weight:900;color:#E31E24;letter-spacing:-1px;
                  line-height:1;text-transform:uppercase">INVOICE</div>
      <div style="margin-top:10px">
        <div style="font-size:11px;color:#888">Receipt No</div>
        <div style="font-size:15px;font-weight:800;color:#0a0a0a;font-family:monospace;
                    letter-spacing:0.5px">${p.receiptNo}</div>
      </div>
      <div style="margin-top:6px">
        <div style="font-size:11px;color:#888">Date</div>
        <div style="font-size:13px;font-weight:600;color:#1a1a1a">${fmtDate(p.date)}</div>
      </div>
    </div>
  </div>

  <!-- â•â• RED SEPARATOR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="height:3px;background:linear-gradient(to right,#E31E24,#ff6b6b,#E31E24);margin:0"></div>

  <!-- â•â• BILL TO + MEMBERSHIP â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;padding:32px 40px;background:#fafafa;border-bottom:1px solid #eeeeee">

    <!-- Bill To -->
    <div style="padding-right:32px;border-right:1px solid #e8e8e8">
      ${lbl('Bill To')}
      <div style="font-size:18px;font-weight:800;color:#0a0a0a;margin-bottom:8px">
        ${m ? m.name : p.memberName}</div>
      ${m ? `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#555;margin-bottom:4px">
        <span style="color:#E31E24;font-size:13px">&#9742;</span>${m.phone}</div>` : ''}
      ${m && m.email ? `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#555;margin-bottom:4px">
        <span style="color:#E31E24;font-size:11px">&#9993;</span>${m.email}</div>` : ''}
      ${m ? `<div style="margin-top:8px;display:inline-block;background:#f0f0f0;
                padding:3px 10px;border-radius:3px;font-size:10.5px;color:#555">
        Member ID &nbsp;<strong style="color:#0a0a0a">${m.id}</strong></div>` : ''}
    </div>

    <!-- Membership Details -->
    <div style="padding-left:32px">
      ${lbl('Membership Details')}
      ${p.planName ? `<div style="font-size:15px;font-weight:700;color:#0a0a0a;margin-bottom:10px">${p.planName}</div>` : ''}
      <table style="width:100%;border-collapse:collapse">
        ${p.date ? `<tr>
          <td style="font-size:11px;color:#888;padding:3px 0;width:90px">From</td>
          <td style="font-size:12px;font-weight:600;color:#1a1a1a">${fmtDate(p.date)}</td>
        </tr>` : ''}
        ${p.expiryDate ? `<tr>
          <td style="font-size:11px;color:#888;padding:3px 0">Valid Till</td>
          <td style="font-size:12px;font-weight:700;color:#16a34a">${fmtDate(p.expiryDate)}</td>
        </tr>` : ''}
        <tr>
          <td style="font-size:11px;color:#888;padding:3px 0">Mode</td>
          <td style="font-size:12px;font-weight:600;color:#1a1a1a">${p.mode}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- â•â• DESCRIPTION TABLE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="padding:32px 40px 0">
    <table style="width:100%;border-collapse:collapse">

      <!-- Table header -->
      <thead>
        <tr style="background:#0a0a0a">
          <th style="padding:13px 16px;text-align:left;font-size:10px;font-weight:700;
                     letter-spacing:1.5px;text-transform:uppercase;color:#ffffff">#</th>
          <th style="padding:13px 16px;text-align:left;font-size:10px;font-weight:700;
                     letter-spacing:1.5px;text-transform:uppercase;color:#ffffff">Description</th>
          <th style="padding:13px 16px;text-align:right;font-size:10px;font-weight:700;
                     letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;width:140px">Amount</th>
        </tr>
      </thead>

      <!-- Line item -->
      <tbody>
        <tr style="border-bottom:1px solid #f0f0f0">
          <td style="padding:18px 16px;font-size:12px;color:#888;vertical-align:top">01</td>
          <td style="padding:18px 16px;vertical-align:top">
            <div style="font-size:14px;font-weight:600;color:#1a1a1a">
              ${p.planName || 'Gym Membership'}</div>
            ${p.note ? `<div style="font-size:11px;color:#888;margin-top:4px">${p.note}</div>` : ''}
            ${p.expiryDate ? `<div style="font-size:11px;color:#888;margin-top:2px">
              ${fmtDate(p.date)} &mdash; ${fmtDate(p.expiryDate)}</div>` : ''}
          </td>
          <td style="padding:18px 16px;text-align:right;font-size:14px;font-weight:600;
                     color:#1a1a1a;vertical-align:top">${INR(planAmt)}</td>
        </tr>
      </tbody>

      <!-- Summary rows -->
      <tfoot>
        <!-- Spacer -->
        <tr><td colspan="3" style="padding:8px 0"></td></tr>

        <!-- Amount Paid -->
        <tr style="border-top:1px solid #eeeeee">
          <td colspan="2" style="padding:12px 16px;text-align:right;
                font-size:12px;font-weight:600;color:#555">Amount Paid</td>
          <td style="padding:12px 16px;text-align:right;
                font-size:16px;font-weight:800;color:#16a34a">${INR(paid)}</td>
        </tr>

        <!-- Balance Due (only if > 0) -->
        ${due > 0 ? `
        <tr style="background:#fff5f5;border-top:1px solid #ffd5d5">
          <td colspan="2" style="padding:12px 16px;text-align:right;
                font-size:12px;font-weight:600;color:#E31E24">Balance Due</td>
          <td style="padding:12px 16px;text-align:right;
                font-size:16px;font-weight:800;color:#E31E24">${INR(due)}</td>
        </tr>` : ''}

        <!-- Total Plan Value -->
        <tr style="background:#E31E24">
          <td colspan="2" style="padding:16px;text-align:right;
                font-size:11px;font-weight:700;letter-spacing:1px;
                text-transform:uppercase;color:rgba(255,255,255,0.85)">Total Plan Value</td>
          <td style="padding:16px;text-align:right;
                font-size:24px;font-weight:900;color:#ffffff">${INR(planAmt)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="padding:28px 40px;display:flex;justify-content:space-between;
              align-items:flex-end;flex-wrap:wrap;gap:20px">

    <!-- Left: thank you + generated stamp -->
    <div>
      <div style="font-size:15px;font-weight:700;color:#0a0a0a;margin-bottom:4px">
        Thank you for your membership!</div>
      <div style="font-size:11px;color:#aaa;font-style:italic">
        ${gs.tagline || 'Stay strong. Stay consistent.'}</div>
      <div style="font-size:9.5px;color:#ccc;margin-top:8px">
        Generated by ${gymName} &nbsp;&middot;&nbsp; ${new Date().toLocaleString('en-IN')}</div>
    </div>

    <!-- Right: signature block -->
    <div style="text-align:center;min-width:160px">
      <div style="height:44px;border-bottom:1.5px solid #cccccc;margin-bottom:6px">
        ${gs.signature ? `<div style="font-size:14px;font-style:italic;font-weight:600;
          color:#1a1a1a;padding-top:16px">${gs.signature}</div>` : ''}
      </div>
      <div style="font-size:10px;font-weight:600;letter-spacing:0.5px;color:#888">
        AUTHORIZED SIGNATORY</div>
    </div>
  </div>

  <!-- â•â• BOTTOM ACCENT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div style="height:5px;background:linear-gradient(to right,#0a0a0a 0%,#E31E24 50%,#0a0a0a 100%)"></div>

</div>`;
}

function printInvoice() {
  const content = document.getElementById('invoiceContent');
  if (!content) return;
  const pa = document.getElementById('invoicePrintArea');
  pa.innerHTML = content.outerHTML;
  pa.style.display = 'block';
  window.print();
  pa.style.display = 'none';
}

async function downloadInvoiceImage() {
  const el = document.getElementById('invoiceContent');
  if (!el) return;
  if (typeof html2canvas === 'undefined') { toast('Image library not loaded yet, try again','warning'); return; }
  showLoader(true);
  try {
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const link = document.createElement('a');
    const p = S.payments.find(x => x.id === _invoicePayId);
    link.download = `receipt_${p ? p.receiptNo : 'invoice'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast('Invoice image downloaded!', 'success');
  } catch(e) {
    toast('Download failed: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

async function downloadInvoicePDF() {
  const el = document.getElementById('invoiceContent');
  if (!el) return;
  if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
    toast('PDF library not loaded yet, try again', 'warning'); return;
  }
  showLoader(true);
  try {
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    // A4 width 210mm; calculate height proportionally
    const pdfW = 210;
    const pdfH = Math.round((canvas.height / canvas.width) * pdfW);
    const pdf = new jsPDF({ orientation: pdfH > pdfW ? 'p' : 'l', unit: 'mm', format: [pdfW, pdfH] });
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    const p = S.payments.find(x => x.id === _invoicePayId);
    pdf.save(`receipt_${p ? p.receiptNo : 'invoice'}.pdf`);
    toast('PDF downloaded!', 'success');
  } catch(e) {
    toast('PDF export failed: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

async function shareInvoiceWA() {
  if (!_invoicePayId) return;
  const p = S.payments.find(x => x.id === _invoicePayId);
  if (!p) return;
  const m = getMember(p.memberId);
  const el = document.getElementById('invoiceContent');

  // Try image share via Web Share API (works on mobile Chrome/Safari)
  if (el && typeof html2canvas !== 'undefined' && navigator.share && navigator.canShare) {
    showLoader(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      canvas.toBlob(async blob => {
        const file = new File([blob], `receipt_${p.receiptNo}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `Receipt ${p.receiptNo}`, text: `Receipt from ${getGymName()}` });
          toast('Invoice shared!', 'success');
        } else {
          // Fallback: download + open WA
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `receipt_${p.receiptNo}.png`;
          link.click();
          setTimeout(() => sendWA_receipt(p.id), 600);
          toast('Image downloaded. Opening WhatsAppâ€¦', 'info');
        }
        showLoader(false);
      }, 'image/png');
      return;
    } catch(e) {
      showLoader(false);
    }
  }

  // Desktop fallback: formatted text via WhatsApp
  const rx  = S.receivables.find(r => r.relatedPayId === p.id && r.status === 'pending');
  const due = rx ? rx.amount : 0;
  const msg =
    `ðŸ§¾ *RECEIPT â€” ${getGymName()}*\n` +
    `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n` +
    `Receipt No: *${p.receiptNo}*\n` +
    `Date: ${fmtDate(p.date)}\n` +
    `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n` +
    `*Member:* ${m ? m.name : p.memberName}\n` +
    (m ? `*ID:* ${m.id} | *Phone:* ${m.phone}\n` : '') +
    `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n` +
    (p.planName ? `*Plan:* ${p.planName}\n` : '') +
    (p.expiryDate ? `*Valid Till:* ${fmtDate(p.expiryDate)}\n` : '') +
    `*Mode:* ${p.mode}\n` +
    `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n` +
    `*Amount Paid:* â‚¹${Number(p.amount).toLocaleString('en-IN')}\n` +
    (due > 0 ? `*Balance Due:* â‚¹${Number(due).toLocaleString('en-IN')}\n` : '') +
    `â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n` +
    `${S.gymSettings.tagline || 'Thank you for choosing us!'}\n` +
    `ðŸ“ž ${getGymPhone()}`;

  const phone = m ? m.phone : '';
  if (phone) openWA(phone, msg);
  else window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  WHATSAPP
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getGymPhone() { return S.gymSettings.phone || localStorage.getItem('mlg_gym_phone') || '9876543210'; }
function getGymName()  { return S.gymSettings.name  || localStorage.getItem('mlg_gym_name')  || 'MuscleLab Gym'; }

function openWA(phone, msg) {
  const clean = phone.replace(/\D/g,'');
  const full  = clean.length===10 ? '91'+clean : clean;
  window.open(`https://wa.me/${full}?text=${encodeURIComponent(msg)}`, '_blank');
}

function sendWA_expiry(memberId) {
  const m = getMember(memberId);
  if (!m) return;
  openWA(m.phone,
    `Hi ${m.name}! Your MuscleLab membership expires on ${fmtDate(m.expiryDate)}. Renew now to continue your fitness journey! Contact us: ${getGymPhone()} â€” ${getGymName()}`
  );
}

function sendWA_receipt(payId) {
  const p = S.payments.find(x=>x.id===payId);
  if (!p) return;
  const m = getMember(p.memberId);
  if (!m) return;
  openWA(m.phone,
    `Hi ${m.name}! Payment of â‚¹${p.amount} received for ${p.planName||'membership'}. Valid till ${fmtDate(p.expiryDate)}. Thank you! â€” ${getGymName()} (â˜Žï¸ ${getGymPhone()})`
  );
}

function sendWA_enquiry(enqId) {
  const e = S.enquiries.find(x=>x.id===enqId);
  if (!e) return;
  openWA(e.phone,
    `Hi ${e.name}! Thank you for your interest in ${getGymName()}. We'd love to help you start your fitness journey! Please call us at ${getGymPhone()} for more details. â€” ${getGymName()}`
  );
}

function sendWA_due(rxId) {
  const rx = S.receivables.find(r => r.id === rxId);
  if (!rx) return;
  openWA(rx.phone, `Hi ${rx.memberName}! You have a pending due of ${fmtMoney(rx.amount)} for ${rx.description}. Please clear it at your earliest convenience. â€” ${getGymName()} (â˜Žï¸ ${getGymPhone()})`);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  SETTINGS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openSettingsModal() {
  document.getElementById('setGymPhone').value = localStorage.getItem('mlg_gym_phone') || '';
  document.getElementById('setGymName').value  = localStorage.getItem('mlg_gym_name')  || '';
  openModal('settingsModal');
}

function saveSettings() {
  const phone = document.getElementById('setGymPhone').value.trim();
  const name  = document.getElementById('setGymName').value.trim();
  if (phone) localStorage.setItem('mlg_gym_phone', phone);
  if (name)  localStorage.setItem('mlg_gym_name',  name);
  closeModal('settingsModal');
  toast('Settings saved!', 'success');
}

function renderSettings() {
  const gs = S.gymSettings;
  document.getElementById('settingsGymName').value        = gs.name      || '';
  document.getElementById('settingsGymPhone').value       = gs.phone     || '';
  document.getElementById('settingsGymAddress').value     = gs.address   || '';
  document.getElementById('settingsInvoiceTagline').value = gs.tagline   || '';
  document.getElementById('settingsSignature').value      = gs.signature || '';
  if (currentUserRole === 'admin') {
    document.getElementById('userMgmtSection').style.display = '';
    renderUsersAdmin();
  } else {
    document.getElementById('userMgmtSection').style.display = 'none';
  }
}

async function saveGymSettings() {
  const gs = {
    name:      document.getElementById('settingsGymName').value.trim(),
    phone:     document.getElementById('settingsGymPhone').value.trim(),
    address:   document.getElementById('settingsGymAddress').value.trim(),
    tagline:   document.getElementById('settingsInvoiceTagline').value.trim(),
    signature: document.getElementById('settingsSignature').value.trim(),
  };
  showLoader(true);
  try {
    await setDoc(doc(db, 'settings', 'gym'), gs);
    Object.assign(S.gymSettings, gs);
    if (gs.phone) localStorage.setItem('mlg_gym_phone', gs.phone);
    if (gs.name)  localStorage.setItem('mlg_gym_name',  gs.name);
    toast('Settings saved and synced!', 'success');
  } catch(e) {
    toast('Error saving settings: ' + e.message, 'error');
  } finally {
    showLoader(false);
  }
}

async function renderUsersAdmin() {
  const wrap = document.getElementById('usersListAdmin');
  if (!wrap) return;
  wrap.innerHTML = `<div style="color:var(--text2);font-size:13px;padding:8px 0">Loading usersâ€¦</div>`;
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    if (!users.length) {
      wrap.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-icon">ðŸ‘¥</div><div>No users found.</div></div>`;
      return;
    }
    const roleTag = r => {
      const cls = { admin:'user-tag-admin', receptionist:'user-tag-receptionist', trainer:'user-tag-trainer' };
      return `<span class="user-tag ${cls[r]||''}">${r}</span>`;
    };
    wrap.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${users.map(u => `
            <tr>
              <td><strong>${u.name || 'â€”'}</strong></td>
              <td class="td-muted">${u.email || 'â€”'}</td>
              <td>
                ${u.uid === currentUser?.uid
                  ? roleTag(u.role)
                  : `<select class="filter-select" style="padding:4px 8px;font-size:12px" onchange="editUserRole('${u.docId}',this.value)">
                      ${['admin','receptionist','trainer'].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${r}</option>`).join('')}
                    </select>`
                }
              </td>
              <td>${u.active === false
                ? `<span class="badge badge-red">Revoked</span>`
                : `<span class="badge badge-green">Active</span>`
              }</td>
              <td>${u.uid === currentUser?.uid
                ? `<span style="color:var(--text2);font-size:12px">(you)</span>`
                : u.active === false
                  ? `<button class="btn btn-success btn-sm" onclick="restoreUserAccess('${u.docId}')">âœ… Restore</button>`
                  : `<button class="btn btn-danger btn-sm" onclick="deleteAppUser('${u.docId}')">ðŸ”’ Revoke</button>`
              }</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } catch(err) {
    wrap.innerHTML = `<div style="color:var(--danger);font-size:13px">Error: ${err.message}</div>`;
  }
}

async function createAppUser() {
  const name  = document.getElementById('newUserName').value.trim();
  const email = document.getElementById('newUserEmail').value.trim();
  const pass  = document.getElementById('newUserPass').value;
  const role  = document.getElementById('newUserRole').value;
  if (!name)               { toast('Enter full name','error'); return; }
  if (!email)              { toast('Enter email address','error'); return; }
  if (!pass||pass.length<6){ toast('Password must be at least 6 characters','error'); return; }
  showLoader(true);
  try {
    const cred = await createUserWithEmailAndPassword(authAux, email, pass);
    await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, name, email, role, active: true });
    await signOut(authAux);
    toast(`User "${name}" created as ${role}!`, 'success');
    document.getElementById('newUserName').value  = '';
    document.getElementById('newUserEmail').value = '';
    document.getElementById('newUserPass').value  = '';
    document.getElementById('newUserRole').value  = 'receptionist';
    renderUsersAdmin();
  } catch(err) {
    if (err.code === 'auth/email-already-in-use') {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const existing = snap.docs.find(d => d.data().email === email);
        if (existing) {
          // Doc exists â€” just restore/update it
          await updateDoc(doc(db, 'users', existing.id), { active: true, role, name });
          toast(`Access restored for "${name}" as ${role}!`, 'success');
          document.getElementById('newUserName').value  = '';
          document.getElementById('newUserEmail').value = '';
          document.getElementById('newUserPass').value  = '';
          document.getElementById('newUserRole').value  = 'receptionist';
          renderUsersAdmin();
          return;
        }
        // Doc was hard-deleted (old behaviour) but Auth account still exists.
        // Try signing in with the password entered to recover the UID and re-link.
        showLoader(true);
        try {
          const relinked = await signInWithEmailAndPassword(authAux, email, pass);
          await setDoc(doc(db, 'users', relinked.user.uid), { uid: relinked.user.uid, name, email, role, active: true });
          await signOut(authAux);
          toast(`Account re-linked for "${name}" as ${role}!`, 'success');
          document.getElementById('newUserName').value  = '';
          document.getElementById('newUserEmail').value = '';
          document.getElementById('newUserPass').value  = '';
          document.getElementById('newUserRole').value  = 'receptionist';
          renderUsersAdmin();
          return;
        } catch(signInErr) {
          // Password entered doesn't match existing Auth account
          toast('This email already has a Firebase account with a different password. Use "Forgot Password?" on the login page to reset it first, then try again.', 'warning');
        }
      } catch(e2) {
        toast('Error: ' + e2.message, 'error');
      }
    } else {
      toast('Error creating user: ' + err.message, 'error');
    }
  } finally {
    showLoader(false);
  }
}

async function deleteAppUser(docId) {
  if (!docId) return;
  confirm2('Revoke Access', "Revoke this user's access? They won't be able to log in. You can restore it later.", async () => {
    showLoader(true);
    try {
      await updateDoc(doc(db, 'users', docId), { active: false });
      toast('Access revoked', 'success');
      renderUsersAdmin();
    } catch(err) {
      toast('Error: ' + err.message, 'error');
    } finally {
      showLoader(false);
    }
  }, 'ðŸ”’');
}

async function editUserRole(docId, newRole) {
  showLoader(true);
  try {
    await updateDoc(doc(db, 'users', docId), { role: newRole });
    toast('Role updated to ' + newRole, 'success');
  } catch(err) {
    toast('Error updating role: ' + err.message, 'error');
    renderUsersAdmin(); // re-render to reset dropdown
  } finally {
    showLoader(false);
  }
}

async function restoreUserAccess(docId) {
  showLoader(true);
  try {
    await updateDoc(doc(db, 'users', docId), { active: true });
    toast('Access restored', 'success');
    renderUsersAdmin();
  } catch(err) {
    toast('Error: ' + err.message, 'error');
  } finally {
    showLoader(false);
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ─────────────────────────────────────────────────────────────────────────────
//  PERSONAL TRAINING
// ─────────────────────────────────────────────────────────────────────────────
function renderPersonalTraining() {
  const q    = (document.getElementById('ptSearch')?.value || '').toLowerCase();
  const from = document.getElementById('ptFrom')?.value || '';
  const to   = document.getElementById('ptTo')?.value   || '';

  const list = [...S.personalTraining].reverse().filter(pt => {
    const matchQ = !q || pt.memberName.toLowerCase().includes(q) || pt.trainerName.toLowerCase().includes(q);
    const matchF = !from || pt.date >= from;
    const matchT = !to   || pt.date <= to;
    return matchQ && matchF && matchT;
  });

  const thisMonth = (() => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}`; })();
  const monthTotal   = S.personalTraining.filter(pt => pt.date && pt.date.startsWith(thisMonth)).reduce((s,pt)=>s+Number(pt.amount||0),0);
  const overallTotal = S.personalTraining.reduce((s,pt)=>s+Number(pt.amount||0),0);

  document.getElementById('ptSummary').innerHTML = `
    <div class="stat-card blue"><span class="stat-icon">🏋️</span><div class="stat-number blue">${fmtMoney(monthTotal)}</div><div class="stat-label">This Month</div></div>
    <div class="stat-card green"><span class="stat-icon">💰</span><div class="stat-number green">${fmtMoney(overallTotal)}</div><div class="stat-label">Total Revenue</div></div>
    <div class="stat-card"><span class="stat-icon">📋</span><div class="stat-number">${list.length}</div><div class="stat-label">Sessions (filtered)</div></div>`;

  const wrap = document.getElementById('ptTable');
  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">🏋️</div><div class="empty-title">No Personal Training Records</div><button class="btn btn-primary" onclick="openPTModal()">➕ Add Record</button></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Member Name</th><th>Trainer</th><th>Sessions</th><th>Amount</th><th>Note</th><th>Actions</th></tr></thead>
      <tbody>${list.map(pt => `<tr>
        <td class="td-muted">${fmtDate(pt.date)}</td>
        <td><strong>${pt.memberName}</strong></td>
        <td class="td-muted">${pt.trainerName}</td>
        <td class="td-muted" style="text-align:center">${pt.sessions || '—'}</td>
        <td style="color:var(--success);font-weight:700">${fmtMoney(pt.amount)}</td>
        <td class="td-muted" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pt.note || '—'}</td>
        <td>${currentUserRole === 'admin' ? `<button class="btn btn-icon btn-sm" title="Delete" onclick="deletePT('${pt.id}')" style="color:var(--danger)">🗑️</button>` : ''}</td>
      </tr>`).join('')}</tbody>
    </table>`;
}

function openPTModal() {
  document.getElementById('ptMemberName').value  = '';
  document.getElementById('ptTrainerName').value = '';
  document.getElementById('ptAmount').value      = '';
  document.getElementById('ptSessions').value    = '';
  document.getElementById('ptDate').value        = todayStr();
  document.getElementById('ptNote').value        = '';
  const tList = document.getElementById('ptTrainerList');
  if (tList) {
    tList.innerHTML = S.staff.map(s => `<option value="${s.name}">`).join('');
  }
  openModal('ptModal');
}

async function savePT() {
  const memberName  = document.getElementById('ptMemberName').value.trim();
  const trainerName = document.getElementById('ptTrainerName').value.trim();
  const amount      = parseFloat(document.getElementById('ptAmount').value);
  const sessions    = parseInt(document.getElementById('ptSessions').value) || 0;
  const date        = document.getElementById('ptDate').value;
  const note        = document.getElementById('ptNote').value.trim();

  if (!memberName)            { toast('Enter member name', 'error'); return; }
  if (!trainerName)           { toast('Enter trainer name', 'error'); return; }
  if (!amount || amount <= 0) { toast('Enter valid amount', 'error'); return; }
  if (!date)                  { toast('Select date', 'error'); return; }

  const record = {
    id: uid('pt'), memberName, trainerName, amount, sessions, date, note,
    addedBy: currentUserName, createdAt: todayStr(),
  };
  showLoader(true);
  try {
    S.personalTraining.push(record);
    await fsSet('personalTraining', record.id, record);
    closeModal('ptModal');
    toast('Personal training record saved!', 'success');
    renderPersonalTraining();
  } catch(e) {
    toast('Error saving record: ' + e.message, 'error');
    S.personalTraining = S.personalTraining.filter(p => p.id !== record.id);
  } finally {
    showLoader(false);
  }
}

function deletePT(id) {
  confirm2('Delete Record', 'Remove this personal training record?', async () => {
    showLoader(true);
    try {
      await fsDelete('personalTraining', id);
      S.personalTraining = S.personalTraining.filter(p => p.id !== id);
      toast('Record deleted', 'success');
      renderPersonalTraining();
    } catch(e) {
      toast('Error deleting: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPENSES
// ─────────────────────────────────────────────────────────────────────────────
function renderExpenses() {
  const q    = (document.getElementById('expSearch')?.value || '').toLowerCase();
  const from = document.getElementById('expFrom')?.value || '';
  const to   = document.getElementById('expTo')?.value   || '';

  const list = [...S.expenses].reverse().filter(ex => {
    const matchQ = !q || ex.description.toLowerCase().includes(q) || (ex.addedBy||'').toLowerCase().includes(q);
    const matchF = !from || ex.date >= from;
    const matchT = !to   || ex.date <= to;
    return matchQ && matchF && matchT;
  });

  const thisMonth = (() => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}`; })();
  const monthExp  = S.expenses.filter(ex => ex.date && ex.date.startsWith(thisMonth)).reduce((s,ex)=>s+Number(ex.amount||0),0);
  const totalExp  = S.expenses.reduce((s,ex)=>s+Number(ex.amount||0),0);

  document.getElementById('expSummary').innerHTML = `
    <div class="stat-card orange"><span class="stat-icon">📅</span><div class="stat-number orange">${fmtMoney(monthExp)}</div><div class="stat-label">This Month</div></div>
    <div class="stat-card" style="border-color:var(--danger)"><span class="stat-icon">💸</span><div class="stat-number" style="color:var(--danger)">${fmtMoney(totalExp)}</div><div class="stat-label">Total Expenses</div></div>
    <div class="stat-card"><span class="stat-icon">📋</span><div class="stat-number">${list.length}</div><div class="stat-label">Records (filtered)</div></div>`;

  const wrap = document.getElementById('expTable');
  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">💸</div><div class="empty-title">No Expense Records</div><button class="btn btn-primary" onclick="openExpenseModal()">➕ Add Expense</button></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Added By</th><th>Actions</th></tr></thead>
      <tbody>${list.map(ex => `<tr>
        <td class="td-muted">${fmtDate(ex.date)}</td>
        <td><strong>${ex.description}</strong></td>
        <td style="color:var(--danger);font-weight:700">${fmtMoney(ex.amount)}</td>
        <td class="td-muted">${ex.addedBy || '—'}</td>
        <td>${currentUserRole === 'admin' ? `<button class="btn btn-icon btn-sm" title="Delete" onclick="deleteExpense('${ex.id}')" style="color:var(--danger)">🗑️</button>` : ''}</td>
      </tr>`).join('')}</tbody>
    </table>`;
}

function openExpenseModal() {
  document.getElementById('expDescription').value = '';
  document.getElementById('expAmount').value      = '';
  document.getElementById('expDate').value        = todayStr();
  openModal('expenseModal');
}

async function saveExpense() {
  const description = document.getElementById('expDescription').value.trim();
  const amount      = parseFloat(document.getElementById('expAmount').value);
  const date        = document.getElementById('expDate').value;

  if (!description)           { toast('Enter expense description', 'error'); return; }
  if (!amount || amount <= 0) { toast('Enter valid amount', 'error'); return; }
  if (!date)                  { toast('Select date', 'error'); return; }

  const record = {
    id: uid('exp'), description, amount, date,
    addedBy: currentUserName, createdAt: todayStr(),
  };
  showLoader(true);
  try {
    S.expenses.push(record);
    await fsSet('expenses', record.id, record);
    closeModal('expenseModal');
    toast('Expense recorded!', 'success');
    renderExpenses();
  } catch(e) {
    toast('Error saving expense: ' + e.message, 'error');
    S.expenses = S.expenses.filter(ex => ex.id !== record.id);
  } finally {
    showLoader(false);
  }
}

function deleteExpense(id) {
  confirm2('Delete Expense', 'Remove this expense record?', async () => {
    showLoader(true);
    try {
      await fsDelete('expenses', id);
      S.expenses = S.expenses.filter(ex => ex.id !== id);
      toast('Expense deleted', 'success');
      renderExpenses();
    } catch(e) {
      toast('Error deleting: ' + e.message, 'error');
    } finally {
      showLoader(false);
    }
  });
}


//  WINDOW EXPORTS (required for ES module onclick handlers)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Object.assign(window, {
  handleLogin, doLogout, showApp, setupAdmin,
  navigate, toggleSidebar, closeSidebar,
  openModal, closeModal,
  openMemberModal, saveMember, deleteMember, openProfile, onMemberPlanChange, updateMemberDue, updatePayDue, previewPhoto,
  openPlanModal, savePlan, deletePlan,
  openPaymentModal, savePayment, deletePayment, openRenewalModal, onPayMemberChange, onPayPlanChange, exportCSV,
  renderReceivables, renderDuesPage, openCollectModal, saveCollect, deleteReceivable,
  renderReports, setReportTab, renderReport, exportReport, rptPrevMonth, rptNextMonth, rptThisMonth,
  openInvoiceModal, printInvoice, downloadInvoiceImage, downloadInvoicePDF, shareInvoiceWA,
  openEnquiryModal, saveEnquiry, updateEnqStatus, deleteEnquiry,
  openStaffModal, saveStaff, deleteStaff,
  renderMembers, renderPayments, renderEnquiries,
  sendWA_expiry, sendWA_receipt, sendWA_enquiry, sendWA_due,
  openSettingsModal, saveSettings, saveGymSettings, createAppUser, deleteAppUser, renderUsersAdmin,
  editUserRole, restoreUserAccess,
  showForgotPassword, hideForgotPassword, sendResetEmail,
  renderPersonalTraining, openPTModal, savePT, deletePT,
  renderExpenses, openExpenseModal, saveExpense, deleteExpense,
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  INIT
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
showLoader(true);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await fetchUserRole(user.uid);
    showApp();
    load().then(async () => {
      await initDefaults();
      await syncMissingDues();
      setupDashboardListeners();
      showLoader(false);
    }).catch(e => {
      toast('Connection failed: ' + e.message, 'error');
      console.error('Firebase init error:', e);
      showLoader(false);
    });
  } else {
    currentUser     = null;
    currentUserRole = null;
    currentUserName = 'User';
    showLoader(false);
    try {
      const isFirstRun = await checkFirstRun();
      if (isFirstRun) showSetupPage();
      else showLoginPage();
    } catch(e) {
      showLoginPage();
    }
  }
});

