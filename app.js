/**
 * SIAKAD POLINELA FIKTIF - APPLICATION LOGIC & VULNERABILITY LAB (M5 KSI)
 * Features:
 *  - 3 Roles (Mahasiswa, Dosen, Admin)
 *  - 4 Intentional Vulnerabilities (SQLi, IDOR, Stored XSS, Weak File Upload)
 *  - Persistence via localStorage
 */

// ================= 1. SEED DATA & STATE =================
const STORAGE_PREFIX = 'siakad_fiktif_m5_';

const DEFAULT_USERS = [
    { id: 'M001', username: 'nyken', password: 'mhs123', role: 'mahasiswa', name: 'Nyken Sekar Ayu', nomor: '24781020', status: 'Aktif' },
    { id: 'M002', username: 'budi', password: 'mhs123', role: 'mahasiswa', name: 'Budi Santoso', nomor: '24781001', status: 'Aktif' },
    { id: 'M003', username: 'siti', password: 'mhs123', role: 'mahasiswa', name: 'Siti Rahmawati', nomor: '24781015', status: 'Aktif' },
    { id: 'M004', username: 'ahmad', password: 'mhs123', role: 'mahasiswa', name: 'Ahmad Dahlan', nomor: '24781033', status: 'Aktif' },
    { id: 'D001', username: 'pak_redo', password: 'dosen123', role: 'dosen', name: 'M. Reza Redo Islami, S.Kom., M.T.I.', nomor: '198805202015041002', status: 'Aktif' },
    { id: 'A001', username: 'admin', password: 'admin123', role: 'admin', name: 'Super Administrator Kampus', nomor: 'ADM-001', status: 'Aktif' }
];

const DEFAULT_GRADES = {
    'M001': [
        { kode: 'PMI 1522', mk: 'Keamanan Sistem Informasi', sks: 3, dosen: 'M. Reza Redo Islami, S.Kom., M.T.I.', angka: 95, huruf: 'A' },
        { kode: 'PMI 1523', mk: 'Pemrograman Web Lanjut', sks: 3, dosen: 'Akhmad Jayadi, M.Cs.', angka: 92, huruf: 'A' },
        { kode: 'PMI 1524', mk: 'Manajemen Basis Data', sks: 3, dosen: 'Dr. Eng. Irwan, M.T.', angka: 88, huruf: 'A-' },
        { kode: 'PMI 1525', mk: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Eka Lestari, M.Kom.', angka: 90, huruf: 'A' }
    ],
    'M002': [
        { kode: 'PMI 1522', mk: 'Keamanan Sistem Informasi', sks: 3, dosen: 'M. Reza Redo Islami, S.Kom., M.T.I.', angka: 65, huruf: 'C' },
        { kode: 'PMI 1523', mk: 'Pemrograman Web Lanjut', sks: 3, dosen: 'Akhmad Jayadi, M.Cs.', angka: 70, huruf: 'B-' },
        { kode: 'PMI 1524', mk: 'Manajemen Basis Data', sks: 3, dosen: 'Dr. Eng. Irwan, M.T.', angka: 58, huruf: 'D' },
        { kode: 'PMI 1525', mk: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Eka Lestari, M.Kom.', angka: 62, huruf: 'C' }
    ],
    'M003': [
        { kode: 'PMI 1522', mk: 'Keamanan Sistem Informasi', sks: 3, dosen: 'M. Reza Redo Islami, S.Kom., M.T.I.', angka: 85, huruf: 'A-' },
        { kode: 'PMI 1523', mk: 'Pemrograman Web Lanjut', sks: 3, dosen: 'Akhmad Jayadi, M.Cs.', angka: 87, huruf: 'A' },
        { kode: 'PMI 1524', mk: 'Manajemen Basis Data', sks: 3, dosen: 'Dr. Eng. Irwan, M.T.', angka: 82, huruf: 'B+' },
        { kode: 'PMI 1525', mk: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Eka Lestari, M.Kom.', angka: 89, huruf: 'A' }
    ],
    'M004': [
        { kode: 'PMI 1522', mk: 'Keamanan Sistem Informasi', sks: 3, dosen: 'M. Reza Redo Islami, S.Kom., M.T.I.', angka: 45, huruf: 'E' },
        { kode: 'PMI 1523', mk: 'Pemrograman Web Lanjut', sks: 3, dosen: 'Akhmad Jayadi, M.Cs.', angka: 50, huruf: 'D' },
        { kode: 'PMI 1524', mk: 'Manajemen Basis Data', sks: 3, dosen: 'Dr. Eng. Irwan, M.T.', angka: 55, huruf: 'D+' },
        { kode: 'PMI 1525', mk: 'Rekayasa Perangkat Lunak', sks: 3, dosen: 'Eka Lestari, M.Kom.', angka: 60, huruf: 'C' }
    ]
};

const DEFAULT_POSTS = [
    {
        id: 1,
        author: 'M. Reza Redo Islami, S.Kom., M.T.I.',
        role: 'dosen',
        time: 'Kemarin, 09:30',
        content: 'Pengumuman: Mahasiswa yang belum mengumpulkan tugas praktikum analisis celah OWASP Top 10 harap segera mengunggah sebelum batas waktu.'
    },
    {
        id: 2,
        author: 'Nyken Sekar Ayu',
        role: 'mahasiswa',
        time: 'Kemarin, 10:15',
        content: 'Izin bertanya Pak, apakah tugasnya dalam format PDF atau menyertakan file kode HTML/JS sumbernya juga?'
    }
];

const DEFAULT_SUBMISSIONS = [
    {
        id: 1,
        mhsId: 'M001',
        mhsName: 'Nyken Sekar Ayu',
        nim: '24781020',
        title: 'Tugas Praktikum M5 - Analisis OWASP Top 10',
        fileName: '24781020_Laporan_OWASP_M5.pdf',
        time: '16 Okt 2026, 14:20',
        isDangerous: false
    },
    {
        id: 2,
        mhsId: 'M002',
        mhsName: 'Budi Santoso',
        nim: '24781001',
        title: 'Tugas Analisis Keamanan Aplikasi',
        fileName: 'tugas_budi_final.docx',
        time: '16 Okt 2026, 15:10',
        isDangerous: false
    }
];

// Helper to get / set localStorage
function getStore(key, defaultVal) {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    if (!val) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(defaultVal));
        return defaultVal;
    }
    try { return JSON.parse(val); } catch (_) { return defaultVal; }
}

function setStore(key, val) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
}

let users = getStore('users', DEFAULT_USERS);
let grades = getStore('grades', DEFAULT_GRADES);
let forumPosts = getStore('forum', DEFAULT_POSTS);
let submissions = getStore('submissions', DEFAULT_SUBMISSIONS);
let currentUser = getStore('current_user', null);

// ================= 2. TOAST NOTIFICATIONS =================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ================= 3. AUTHENTICATION & VIEWS =================
const viewLogin = document.getElementById('view-login');
const viewMahasiswa = document.getElementById('view-mahasiswa');
const viewDosen = document.getElementById('view-dosen');
const viewAdmin = document.getElementById('view-admin');

const navUserChip = document.getElementById('user-chip');
const navUserName = document.getElementById('nav-user-name');
const navUserRole = document.getElementById('nav-user-role');
const navUserAvatar = document.getElementById('nav-user-avatar');
const btnLogout = document.getElementById('btn-logout');

function updateNav() {
    if (currentUser) {
        navUserChip.classList.remove('hidden');
        navUserName.innerText = currentUser.name;
        navUserRole.innerText = currentUser.role;
        navUserAvatar.innerText = currentUser.name.charAt(0).toUpperCase();
    } else {
        navUserChip.classList.add('hidden');
    }
}

function showView(viewId) {
    [viewLogin, viewMahasiswa, viewDosen, viewAdmin].forEach(v => v.classList.remove('active', 'hidden'));
    [viewLogin, viewMahasiswa, viewDosen, viewAdmin].forEach(v => {
        if (v.id === viewId) v.classList.add('active');
        else v.classList.add('hidden');
    });
    updateNav();
}

function routeUser() {
    if (!currentUser) {
        showView('view-login');
        return;
    }
    if (currentUser.role === 'mahasiswa') {
        showView('view-mahasiswa');
        renderMahasiswaDashboard();
    } else if (currentUser.role === 'dosen') {
        showView('view-dosen');
        renderDosenDashboard();
    } else if (currentUser.role === 'admin') {
        showView('view-admin');
        renderAdminDashboard();
    }
}

// LOGIN FORM SUBMISSION (With SQL Injection Vulnerability)
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value;

    // === CELAH #1: SQL INJECTION SIMULATOR ===
    // Jika input mengandung pola SQLi seperti: ' OR '1'='1 atau ' or 1=1 --
    const sqliRegex = /('|\b)(OR|or)\b.*(=|LIKE).*('1'|1|true)/i;
    if (sqliRegex.test(usernameInput) || usernameInput.includes("' OR '1'='1")) {
        // Eksploit berhasil: Bypass autentikasi sebagai Admin!
        showToast('💥 SQL Injection Berhasil! Autentikasi di-bypass sebagai Administrator.', 'warning');
        currentUser = users.find(u => u.role === 'admin') || users[0];
        setStore('current_user', currentUser);
        routeUser();
        return;
    }

    // Normal Login Check
    const found = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);
    if (found) {
        currentUser = found;
        setStore('current_user', currentUser);
        showToast(`Selamat datang kembali, ${found.name}!`, 'success');
        routeUser();
    } else {
        showToast('Username atau kata sandi salah!', 'error');
    }
});

// QUICK 1-CLICK DEMO LOGIN BUTTONS
document.querySelectorAll('.btn-demo').forEach(btn => {
    btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        const target = users.find(u => u.role === role);
        if (target) {
            currentUser = target;
            setStore('current_user', currentUser);
            showToast(`Login demo sebagai ${target.name} (${target.role})`, 'success');
            routeUser();
        }
    });
});

btnLogout.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_PREFIX + 'current_user');
    showToast('Berhasil keluar dari portal.', 'info');
    showView('view-login');
});

// Tab Switcher for Dashboards
document.querySelectorAll('.sidebar-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
        if (!e.target.classList.contains('menu-item')) return;
        const targetId = e.target.dataset.target;
        menu.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        e.target.classList.add('active');

        const parentPanel = menu.closest('.dashboard-layout').querySelector('.content-panel');
        parentPanel.querySelectorAll('.tab-content').forEach(tc => {
            if (tc.id === targetId) tc.classList.add('active');
            else tc.classList.remove('active');
        });
    });
});

// ================= 4. MAHASISWA ROLE LOGIC =================
function renderMahasiswaDashboard() {
    document.getElementById('mhs-name').innerText = currentUser.name;
    renderGradesTable(currentUser.id);
    renderMhsSubmissions();
    renderForum('forum-feed');
}

// === CELAH #2: IDOR (Insecure Direct Object References) ===
// Nilai ditampilkan berdasarkan ID yang dipilih di dropdown tanpa memeriksa sesi login!
const idorSelect = document.getElementById('idor-mhs-select');
idorSelect.addEventListener('change', () => {
    const selectedId = idorSelect.value;
    renderGradesTable(selectedId);
    if (selectedId !== currentUser.id) {
        showToast(`🚨 IDOR Triggered: Anda melihat nilai milik mahasiswa lain (${selectedId})!`, 'warning');
    }
});

function renderGradesTable(mhsId) {
    const tbody = document.getElementById('tbody-nilai');
    const userGrades = grades[mhsId] || [];
    if (!userGrades.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-muted" style="text-align:center;">Tidak ada data nilai untuk ID: ${mhsId}</td></tr>`;
        return;
    }
    tbody.innerHTML = userGrades.map(g => `
        <tr>
            <td><code>${g.kode}</code></td>
            <td><strong>${g.mk}</strong></td>
            <td>${g.sks}</td>
            <td>${g.dosen}</td>
            <td><strong>${g.angka}</strong></td>
            <td><span class="badge ${g.angka >= 80 ? 'badge-success' : g.angka >= 65 ? 'badge-warning' : 'badge-danger'}">${g.huruf}</span></td>
        </tr>
    `).join('');
}

// === CELAH #3: WEAK FILE VALIDATION (Unrestricted Upload) ===
const formUploadTugas = document.getElementById('form-upload-tugas');
formUploadTugas.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('tugas-title').value.trim();
    const fileInput = document.getElementById('tugas-file');
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const dangerousExtensions = ['.php', '.exe', '.sh', '.html', '.js', '.phtml', '.py'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isDangerous = dangerousExtensions.includes(ext);

    const newSub = {
        id: Date.now(),
        mhsId: currentUser.id,
        mhsName: currentUser.name,
        nim: currentUser.nomor,
        title: title,
        fileName: file.name,
        time: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        isDangerous: isDangerous
    };

    submissions.unshift(newSub);
    setStore('submissions', submissions);

    if (isDangerous) {
        showToast(`💥 Celah Validasi Berkas Lemah: File eksekutabel (${ext}) berhasil diunggah tanpa penolakan!`, 'error');
    } else {
        showToast(`Tugas "${file.name}" berhasil diunggah!`, 'success');
    }

    formUploadTugas.reset();
    renderMhsSubmissions();
});

document.getElementById('btn-demo-payload-file').addEventListener('click', () => {
    // Inject mock dangerous web shell file
    const newSub = {
        id: Date.now(),
        mhsId: currentUser.id,
        mhsName: currentUser.name,
        nim: currentUser.nomor,
        title: 'Exploit Web Shell Praktikum (Simulasi)',
        fileName: 'c99_webshell_exploit.php',
        time: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        isDangerous: true
    };
    submissions.unshift(newSub);
    setStore('submissions', submissions);
    showToast('💥 Simulasi file bahaya (c99_webshell_exploit.php) diunggah!', 'warning');
    renderMhsSubmissions();
});

function renderMhsSubmissions() {
    const list = document.getElementById('mhs-tugas-list');
    const mySubs = submissions.filter(s => s.mhsId === currentUser.id);
    if (!mySubs.length) {
        list.innerHTML = `<p class="text-muted">Belum ada tugas yang diunggah.</p>`;
        return;
    }
    list.innerHTML = mySubs.map(s => `
        <div class="file-item-card">
            <div class="file-info">
                <span class="file-icon">${s.isDangerous ? '⚠️' : '📄'}</span>
                <div>
                    <div class="file-name">
                        ${s.title}
                        ${s.isDangerous ? '<span class="file-danger-tag">CELAH: UNRESTRICTED EXTENSION</span>' : ''}
                    </div>
                    <div class="file-meta">Nama Berkas: <code>${s.fileName}</code> · Waktu: ${s.time}</div>
                </div>
            </div>
            <span class="badge ${s.isDangerous ? 'badge-danger' : 'badge-success'}">${s.isDangerous ? 'Bahaya' : 'Terkirim'}</span>
        </div>
    `).join('');
}

// === CELAH #4: STORED XSS (Cross-Site Scripting) ===
const formForumPost = document.getElementById('form-forum-post');
formForumPost.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('forum-msg').value;
    if (!msg.trim()) return;

    const newPost = {
        id: Date.now(),
        author: currentUser.name,
        role: currentUser.role,
        time: 'Baru saja',
        content: msg // Disimpan mentah tanpa sanitasi HTML!
    };

    forumPosts.unshift(newPost);
    setStore('forum', forumPosts);
    document.getElementById('forum-msg').value = '';
    showToast('Pesan berhasil dikirim ke forum!', 'info');
    renderForum('forum-feed');
});

// Demo XSS Payload 1: Image onerror Alert
document.getElementById('btn-demo-xss-img').addEventListener('click', () => {
    const payload = `<img src="nonexistent.jpg" onerror="alert('💥 STORED XSS DIEKSEKUSI! Pesan forum ini berhasil menjalankan script arbitrary di browser korban.')">`;
    document.getElementById('forum-msg').value = payload;
    showToast('Payload XSS siap di kolom input. Klik "Kirim Pesan" untuk mengeksekusi!', 'warning');
});

// Demo XSS Payload 2: Cookie / Session Theft simulation
document.getElementById('btn-demo-xss-cookie').addEventListener('click', () => {
    const payload = `Halo semua! <b style="color:#f43f5e;" onclick="alert('Simulasi Pencurian Token Sesi:\\n' + document.cookie)">[KLIK DI SINI UNTUK LIHAT MATERI]</b>`;
    document.getElementById('forum-msg').value = payload;
    showToast('Payload XSS simulasi link disiapkan.', 'warning');
});

document.getElementById('btn-clear-forum').addEventListener('click', () => {
    forumPosts = [...DEFAULT_POSTS];
    setStore('forum', forumPosts);
    renderForum('forum-feed');
    showToast('Forum dikembalikan ke pesan awal.', 'info');
});

function renderForum(targetElemId) {
    const container = document.getElementById(targetElemId);
    if (!container) return;
    if (!forumPosts.length) {
        container.innerHTML = `<p class="text-muted">Belum ada diskusi.</p>`;
        return;
    }
    // RENDER LANGSUNG MENGGUNAKAN innerHTML TANPA ESCAPING -> RENTAN STORED XSS!
    container.innerHTML = forumPosts.map(p => `
        <div class="forum-card">
            <div class="forum-header">
                <span class="forum-author">${p.author} <small class="text-muted">(${p.role.toUpperCase()})</small></span>
                <span class="forum-time">${p.time}</span>
            </div>
            <div class="forum-body">
                ${p.content}
            </div>
        </div>
    `).join('');
}

// ================= 5. DOSEN ROLE LOGIC =================
function renderDosenDashboard() {
    renderDosenGrades();
    renderDosenSubmissions();
    renderForum('dosen-forum-feed');
}

function renderDosenGrades() {
    const tbody = document.getElementById('tbody-dosen-nilai');
    const mhsUsers = users.filter(u => u.role === 'mahasiswa');

    tbody.innerHTML = mhsUsers.map(m => {
        const userGrades = grades[m.id] || [];
        const ksiGrade = userGrades.find(g => g.kode.includes('1522')) || { angka: 80, huruf: 'A-' };
        return `
            <tr>
                <td><code>${m.nomor}</code></td>
                <td><strong>${m.name}</strong></td>
                <td><input type="number" class="form-control-sm grade-input" data-mhs="${m.id}" data-type="tugas" value="85" style="width:70px;"></td>
                <td><input type="number" class="form-control-sm grade-input" data-mhs="${m.id}" data-type="uts" value="88" style="width:70px;"></td>
                <td><input type="number" class="form-control-sm grade-input" data-mhs="${m.id}" data-type="uas" value="${ksiGrade.angka}" style="width:70px;"></td>
                <td><span class="badge badge-success">${ksiGrade.huruf}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="simpanNilaiDosen('${m.id}')">💾 Simpan</button>
                </td>
            </tr>
        `;
    }).join('');
}

window.simpanNilaiDosen = function(mhsId) {
    showToast(`Nilai mahasiswa ${mhsId} berhasil diperbarui di database!`, 'success');
};

function renderDosenSubmissions() {
    const list = document.getElementById('dosen-tugas-list');
    if (!submissions.length) {
        list.innerHTML = `<p class="text-muted">Belum ada mahasiswa yang mengunggah tugas.</p>`;
        return;
    }
    list.innerHTML = submissions.map(s => `
        <div class="file-item-card">
            <div class="file-info">
                <span class="file-icon">${s.isDangerous ? '🚨' : '📄'}</span>
                <div>
                    <div class="file-name">
                        ${s.mhsName} (${s.nim}) - ${s.title}
                        ${s.isDangerous ? '<span class="file-danger-tag">PERINGATAN: BERKAS EKSEKUTABEL</span>' : ''}
                    </div>
                    <div class="file-meta">Berkas: <code>${s.fileName}</code> · Diunggah: ${s.time}</div>
                </div>
            </div>
            <div class="button-row" style="margin:0;">
                <button class="btn btn-secondary btn-sm" onclick="alert('Mengunduh berkas: ${s.fileName}')">⬇️ Unduh Berkas</button>
                ${s.isDangerous ? `<button class="btn btn-danger-soft btn-sm" onclick="alert('Simulasi eksekusi payload berbahaya: Server rentan mengeksekusi ${s.fileName}!')">⚠️ Uji Eksekusi Celah</button>` : ''}
            </div>
        </div>
    `).join('');
}

// ================= 6. ADMIN ROLE LOGIC =================
function renderAdminDashboard() {
    renderAdminUsers();
}

function renderAdminUsers() {
    const tbody = document.getElementById('tbody-admin-users');
    tbody.innerHTML = users.map(u => `
        <tr>
            <td><code>${u.username}</code></td>
            <td><strong>${u.name}</strong></td>
            <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'dosen' ? 'badge-warning' : 'badge-success'}">${u.role.toUpperCase()}</span></td>
            <td>${u.nomor}</td>
            <td><span class="badge badge-success">${u.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="hapusUser('${u.id}')">Hapus</button>
            </td>
        </tr>
    `).join('');
}

window.hapusUser = function(userId) {
    if (confirm('Yakin ingin menghapus akun pengguna ini?')) {
        users = users.filter(u => u.id !== userId);
        setStore('users', users);
        renderAdminUsers();
        showToast('Akun berhasil dihapus!', 'info');
    }
};

// Modal Tambah User
const modalUser = document.getElementById('modal-user');
document.getElementById('btn-tambah-user').addEventListener('click', () => modalUser.classList.remove('hidden'));
document.getElementById('btn-close-user').addEventListener('click', () => modalUser.classList.add('hidden'));
document.getElementById('btn-cancel-user').addEventListener('click', () => modalUser.classList.add('hidden'));

document.getElementById('form-user-admin').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('user-input-username').value.trim();
    const name = document.getElementById('user-input-name').value.trim();
    const role = document.getElementById('user-input-role').value;
    const nomor = document.getElementById('user-input-nomor').value.trim();

    const newUser = {
        id: 'U' + Date.now().toString().slice(-3),
        username: username,
        password: 'password123',
        role: role,
        name: name,
        nomor: nomor,
        status: 'Aktif'
    };

    users.push(newUser);
    setStore('users', users);
    modalUser.classList.add('hidden');
    document.getElementById('form-user-admin').reset();
    renderAdminUsers();
    showToast(`Akun ${name} (${role}) berhasil ditambahkan!`, 'success');
});

// ================= 7. AUDIT MODAL LOGIC =================
const modalAudit = document.getElementById('modal-audit');
document.getElementById('btn-audit-modal').addEventListener('click', () => modalAudit.classList.remove('hidden'));
document.getElementById('btn-close-audit').addEventListener('click', () => modalAudit.classList.add('hidden'));
document.getElementById('btn-modal-close-ok').addEventListener('click', () => modalAudit.classList.add('hidden'));

document.getElementById('btn-modal-reset').addEventListener('click', () => {
    if (confirm('Reset seluruh data pengujian ke konfigurasi awal?')) {
        localStorage.clear();
        users = [...DEFAULT_USERS];
        grades = { ...DEFAULT_GRADES };
        forumPosts = [...DEFAULT_POSTS];
        submissions = [...DEFAULT_SUBMISSIONS];
        currentUser = null;
        modalAudit.classList.add('hidden');
        showToast('Data berhasil di-reset!', 'info');
        routeUser();
    }
});

// INITIALIZE
routeUser();
