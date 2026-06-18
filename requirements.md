# Project Requirements: Salary Growth Tracker

## 1. Project Overview
"Salary Growth Tracker" adalah aplikasi web sederhana yang dirancang sebagai sarana pembelajaran *end-to-end software engineering*. Aplikasi ini memungkinkan pengguna (single-user) untuk melacak riwayat kenaikan gaji dan promosi jabatan mereka dari waktu ke waktu, melihat ringkasan data di dashboard, menganalisis pertumbuhan melalui grafik, serta mengekspor data tersebut. 

## 2. Objectives
- **Pembelajaran Utama:** Memahami seluruh siklus pengembangan aplikasi perangkat lunak (Requirements, Design, Implementation, Testing, Deployment, Maintenance) menggunakan metode *AI-assisted development*.
- **Fokus Tambahan:** Menghasilkan produk yang dapat di-deploy secara nyata (*online/public*), namun tetap menjaga kesederhanaan tanpa *over-engineering*.

## 3. Scope
- **In-Scope:** Input dan manajemen riwayat gaji, input dan manajemen riwayat promosi, visualisasi grafik, dashboard ringkasan, fitur *forecasting* sederhana, dan ekspor data ke CSV.
- **Out-of-Scope (Tidak Termasuk):** Multi-user/Authentication system yang kompleks, arsitektur Microservices, High Availability/Load Balancing, integrasi dengan API eksternal (seperti kurs mata uang/inflasi otomatis).

## 4. User Stories
1. **Sebagai pengguna**, saya ingin menambahkan riwayat gaji saya (tanggal berlaku, nominal, catatan) agar saya dapat melihat histori penghasilan saya.
2. **Sebagai pengguna**, saya ingin menambahkan riwayat promosi (jabatan, tanggal, catatan) agar dapat melacak perkembangan karier saya.
3. **Sebagai pengguna**, saya ingin melihat *dashboard* yang menampilkan gaji saya saat ini, total persentase/nominal kenaikan gaji dari awal, jumlah promosi, dan total masa kerja saya.
4. **Sebagai pengguna**, saya ingin melihat grafik pertumbuhan gaji dari waktu ke waktu agar lebih mudah membayangkan tren kenaikan gaji saya.
5. **Sebagai pengguna**, saya ingin melihat proyeksi/forecast gaji saya di masa depan berdasarkan rata-rata histori kenaikan saya.
6. **Sebagai pengguna**, saya ingin dapat mengekspor data saya ke dalam format CSV untuk keperluan *backup* atau analisis pribadi di Excel.

## 5. Functional Requirements
- **FR1 - Manajemen Gaji (CRUD):** Sistem harus dapat menyimpan, membaca, memperbarui, dan menghapus data riwayat gaji (Nominal, Tanggal Berlaku, Catatan).
- **FR2 - Manajemen Promosi (CRUD):** Sistem harus dapat menyimpan, membaca, memperbarui, dan menghapus data riwayat promosi (Jabatan, Tanggal Berlaku, Catatan).
- **FR3 - Dashboard Data:** Sistem harus mengkalkulasi dan menampilkan metrik utama: Gaji Terakhir, Total Nominal/Persentase Kenaikan (Gaji Terakhir vs Gaji Pertama), Jumlah Promosi, dan Durasi Masa Kerja.
- **FR4 - Visualisasi Grafik:** Sistem harus menggambar grafik garis (*line chart*) yang sumbu X-nya adalah waktu dan sumbu Y-nya adalah nominal gaji.
- **FR5 - Proyeksi (Forecast):** Sistem harus menghitung rata-rata persentase atau nominal kenaikan historis dan menampilkannya sebagai estimasi gaji pada 1-3 tahun ke depan.
- **FR6 - Export CSV:** Sistem harus menyediakan tombol untuk mengunduh seluruh data riwayat gaji dan promosi ke dalam format file `.csv`.

## 6. Non-Functional Requirements
- **NFR1 - Tech Stack:** Frontend harus menggunakan React, Backend harus menggunakan FastAPI (Python), dan Database menggunakan SQLite.
- **NFR2 - Performance:** Waktu respon API harus cepat (< 500ms) karena data sangat ringan.
- **NFR3 - UI/UX:** Antarmuka harus sederhana, bersih (clean design), dan responsif (dapat diakses nyaman melalui desktop maupun mobile).
- **NFR4 - Deployment:** Harus dapat di-deploy dengan biaya rendah atau gratis (contoh: VPS kecil, Vercel untuk Frontend, Render/Railway untuk Backend).

## 7. MVP Definition (Minimum Viable Product)
MVP adalah versi pertama yang fungsional dan siap *deploy*. Fitur wajib untuk MVP:
- Form input riwayat gaji dan promosi.
- Tabel/List untuk melihat data yang sudah diinput (tanpa perlu fitur Update/Delete terlebih dahulu jika ingin dipotong, namun untuk *tracker* sederhana fitur *Delete* minimal harus ada).
- Dashboard metrik dasar.
- Grafik garis pertumbuhan gaji.
- Export CSV.

## 8. Future Enhancements
- Autentikasi dasar pengguna (Username/Password sederhana) jika ingin diakses publik tanpa orang lain bisa melihat data.
- Kalkulasi inflasi (apakah kenaikan gaji mengalahkan inflasi?).
- Multiple currencies (opsi mata uang berbeda untuk yang pernah bekerja di luar negeri).
- *Dark mode* pada UI.

## 9. Success Criteria
- Aplikasi berjalan mulus di *local environment*.
- Aplikasi berhasil di-deploy ke server/cloud dan dapat diakses publik via URL.
- Kode tersusun rapi, memiliki *testing* dasar, dan mudah dipahami.
- Tidak terjadi *bug* yang memblokir fungsionalitas utama.
- Pengembang (Anda) memahami alur data dari Frontend -> Backend -> Database dan proses deployment-nya.
