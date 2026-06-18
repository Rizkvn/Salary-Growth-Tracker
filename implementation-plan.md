# Implementation Plan: Salary Growth Tracker

## 1. System Architecture
Aplikasi menggunakan arsitektur Monolith Klasik yang dipisahkan menjadi komponen Frontend (React) dan Backend (FastAPI) sebagai Decoupled Single-Page Application.
* **Frontend (React):** Berjalan sepenuhnya di sisi browser pengguna, berkomunikasi dengan backend menggunakan REST API dengan format pertukaran data JSON.
* **Backend (FastAPI):** Menyediakan endpoint API, menangani logika bisnis (kalkulasi metrik & forecasting), serta mengelola autentikasi.
* **Database (SQLite):** Berupa satu file lokal untuk menyimpan seluruh data secara persisten.

## 2. Database Design
Database menggunakan SQLite dalam bentuk file tunggal (`salary_tracker.db`). Tidak diperlukan relasi foreign key yang kompleks antar kedua tabel untuk MVP ini demi menjaga kesederhanaan sistem.

### Tabel: `salaries`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID Unik |
| amount | REAL | NOT NULL | Nominal Gaji |
| effective_date | TEXT | NOT NULL | Tanggal berlaku (YYYY-MM-DD) |
| notes | TEXT | NULL | Catatan tambahan perubahan |

### Tabel: `promotions`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | ID Unik |
| title | TEXT | NOT NULL | Nama Jabatan / Promosi Baru |
| promotion_date | TEXT | NOT NULL | Tanggal Promosi (YYYY-MM-DD) |
| notes | TEXT | NULL | Catatan tambahan |

## 3. API Design
Semua endpoint dilindungi oleh Bearer Token (JWT) tunggal, kecuali untuk rute login.

| Method | Endpoint | Description | Payload (Request) | Response (Success) |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Login user tunggal | `{"password": "..."}` | `{"token": "..."}` |
| GET | `/api/dashboard` | Ambil metrik & data grafik | None | `{"metrics": {...}, "chart_data": [...]}` |
| GET | `/api/salaries` | Ambil semua riwayat gaji | None | `[{"id": 1, "amount": ...}, ...]` |
| POST | `/api/salaries` | Tambah riwayat gaji | `{"amount": ..., "effective_date": ...}` | `{"status": "success", "id": 1}` |
| DELETE | `/api/salaries/{id}` | Hapus riwayat gaji | None | `{"status": "deleted"}` |
| GET | `/api/promotions` | Ambil semua riwayat promosi | None | `[{"id": 1, "title": ...}, ...]` |
| POST | `/api/promotions` | Tambah riwayat promosi | `{"title": ..., "promotion_date": ...}` | `{"status": "success", "id": 1}` |
| DELETE | `/api/promotions/{id}` | Hapus riwayat promosi | None | `{"status": "deleted"}` |
| GET | `/api/export/csv` | Unduh data CSV | None | File `salary_growth_data.csv` |

## 4. Frontend Structure
Struktur direktori frontend menggunakan React (Vite) dengan pemisahan komponen dan halaman yang modular.
```
frontend/
├── src/
│   ├── components/      # Navbar, ProtectedRoute, UI Reusable
│   ├── pages/
│   │   ├── Login.jsx     # Halaman Login Single-User
│   │   ├── Dashboard.jsx # Menampilkan grafik & rangkuman angka
│   │   ├── SalaryPage.jsx # CRUD riwayat gaji
│   │   └── PromotionPage.jsx # CRUD riwayat promosi
│   ├── App.jsx          # Konfigurasi routing & state auth
│   ├── main.jsx
│   └── index.css        # Tailwind CSS
├── package.json
└── .env                 # API URL
```

## 5. Backend Structure
Struktur direktori backend menggunakan FastAPI dengan pendekatan arsitektur berlapis (models, schemas, crud).
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # Entry point aplikasi & rute utama
│   ├── config.py        # Pengaturan password & JWT secret (.env)
│   ├── database.py      # Inisialisasi engine SQLAlchemy & Session
│   ├── models.py        # Definisi tabel database (SQLAlchemy)
│   ├── schemas.py       # Validasi request & response (Pydantic)
│   ├── auth.py          # Logika verifikasi password & JWT token
│   └── crud.py          # Operasi database (Query & Insert)
├── requirements.txt
├── .env                 # Secret Key & Admin Password
└── salary_tracker.db    # File SQLite (diabaikan dari git)
```

## 6. Sprint Breakdown
* **Sprint 1: Backend Baseline & Database (1-2 Hari):** Setup Python environment, instalasi pustaka, konfigurasi database SQLite, dan membuat modul autentikasi single-user.
* **Sprint 2: Backend CRUD & Core Logic (2 Hari):** Menyelesaikan endpoints untuk pengelolaan gaji dan promosi, mengimplementasikan logika dashboard, rumus forecasting, dan fungsi eksport ke CSV.
* **Sprint 3: Frontend Setup & UI Dashboard (2-3 Hari):** Inisialisasi React via Vite, integrasi Tailwind CSS, setup chart library (Recharts), pembuatan form login, dan halaman visualisasi dashboard.
* **Sprint 4: Frontend CRUD & Finishing (2 Hari):** Menghubungkan halaman manajemen gaji dan promosi ke REST API backend, menangani state data, serta integrasi tombol download CSV.
* **Sprint 5: Deployment (1 Hari):** Mengunggah dan melakukan konfigurasi rilis agar aplikasi dapat diakses secara publik online.

## 7. Testing Strategy
* **Manual API Testing:** Menguji fungsionalitas backend secara langsung menggunakan Swagger UI bawaan FastAPI yang tersedia di rute `/docs`.
* **Frontend Integration Testing:** Melakukan skenario pengujian manual (End-to-End sederhana) pada browser, seperti melakukan login, menambah/menghapus data, dan memastikan visualisasi grafik langsung diperbarui.

## 8. Deployment Strategy
Deployment difokuskan sepenuhnya menggunakan platform Cloud PaaS (Platform-as-a-Service) untuk kemudahan manajemen tanpa perlu mengelola infrastruktur VPS.
* **Frontend:** Di-deploy ke Render.com atau Railway.app sebagai Static Site (Gratis/Murah).
* **Backend:** Di-deploy sebagai Web Service di Render.com atau Railway.app.
* **Database Persistence:** Wajib memasang Persistent Volume Storage (misal: Mount Path sebesar 1GB) pada Web Service Backend di platform terkait agar file database SQLite (`salary_tracker.db`) tidak hilang ketika aplikasi melakukan restart atau re-deploy.

## 9. Risk Assessment
* **Fitur Forecast:** Penghitungan proyeksi masa depan tidak menggunakan model statistik kompleks ataupun Machine Learning.
* **Solusi Finansial MVP:** Menggunakan rumus Linear Forecasting berbasis rata-rata nilai kenaikan historis.

**Cara Kerja Logika:**
1. Hitung selisih nominal setiap terjadi perubahan kenaikan gaji berurutan.
2. Cari nilai rata-rata dari seluruh kejadian kenaikan tersebut.

*Contoh Simulasi Matematika:*
* 2016: 4 jt
* 2019: 5 jt (Naik 1 jt)
* 2022: 6.5 jt (Naik 1.5 jt)
* 2025: 8 jt (Naik 1.5 jt)

$$	ext{Rata-rata Kenaikan} = rac{1	ext{ jt} + 1.5	ext{ jt} + 1.5	ext{ jt}}{3} = 1.33	ext{ jt}$$

**Proyeksi ke Depan (Forecast Per Tahun):**
* 2026 = 8 jt + 1.33 jt = 9.33 jt
* 2027 = 9.33 jt + 1.33 jt = 10.66 jt

## 10. Technical Debt Strategy

### Accepted Debt (MVP)
1. SQLite digunakan sebagai database utama.
2. Single-user authentication (password tunggal via `.env`).
3. Tidak ada role management.
4. Tidak ada automated testing (Unit/Integration Test lewat kode).
5. Tidak ada CI/CD pipeline otomatis.

### Upgrade Trigger
* **Migrasi ke PostgreSQL jika:** jumlah user > 10 atau membutuhkan multi-user.
* **Tambahkan CI/CD jika:** deployment > 1 kali per minggu.
* **Tambahkan automated testing jika:** bug production mulai sering muncul.

## 11. Future Migration Path
Ketika salah satu Upgrade Trigger di atas terpenuhi, langkah migrasi terstruktur yang akan diambil meliputi:
1. **Migrasi Database:** Mengubah konfigurasi database URL di backend FastAPI (SQLAlchemy) dari driver SQLite ke PostgreSQL, melakukan ekspor data terstruktur dari file `.db` lama, dan mengimpornya ke klaster PostgreSQL baru.
2. **Refaktor Otentikasi:** Mengubah sistem login single-user menjadi tabel `users` yang mendukung registrasi, penyimpanan password ter-hashing (Bcrypt), dan skema hak akses (Role-Based Access Control) jika diperlukan.
3. **Automasi Pipeline & Test:** Menambahkan direktori `/tests` berisi pengujian berbasis Pytest (Backend) dan Vitest (Frontend), dilanjutkan dengan konfigurasi GitHub Actions untuk menjalankan pengetesan otomatis dan proses deploy otomatis ke Render/Railway setiap ada push ke main branch.
