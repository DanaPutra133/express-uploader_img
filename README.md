# Express Uploader
Layanan sederhana untuk upload gambar menggunakan **Docker** & **Docker Compose**.

---

## Prasyarat
Pastikan server sudah ter-install:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Instalasi & Konfigurasi Awal

### 1. Clone Repositori
```bash
git clone "https://github.com/DanaPutra133/express-uploader_img"
cd "express-uploader_img"
```

### 2. Buat File Environment (.env)
Salin dari file contoh:
```bash
cp env.example .env
```

Lalu buka file `.env` (contoh dengan nano):
```bash
nano .env
```

Isi `INTERNAL_API_KEY` dengan kunci rahasia yang kuat dan sulit ditebak.

### 3. Jalankan Aplikasi
```bash
docker-compose up -d --build
```

✅ Layanan sekarang berjalan dan siap menerima permintaan.
---

## 📖 Dokumentasi API

### Upload Gambar
- **Method**: `POST`  
- **Endpoint**: `/upload`

#### Headers
- `X-Internal-Key: [KUNCI_RAHASIA_ANDA]` (wajib, ambil dari `.env`)

#### Body (form-data)
- `imageFile`: Pilih file gambar dari komputer Anda (tipe: File).

#### ✅ Respons Sukses (201 Created)
```json
{
  "message": "Gambar berhasil di-upload!",
  "url": "https://domain-anda.com/images/uuid-unik.jpeg"
}
```

#### ❌ Respons Gagal (401 Unauthorized)
```json
{
  "error": "Unauthorized: API Key tidak valid atau tidak ada."
}
```

---

## Manajemen Operasional

Menjalankan aplikasi di latar belakang:
```bash
docker-compose up -d
```

Menghentikan & menghapus container:
```bash
docker-compose down
```

Melihat log real-time:
```bash
docker-compose logs -f
```

Membangun ulang setelah ada perubahan kode:
```bash
docker-compose up -d --build
```

Me-restart service tanpa downtime:
```bash
docker-compose restart
```

---

## Backup, Restore, dan Migrasi

### Backup

1. Cari nama volume:
```bash
docker volume ls
```

2. Inspect volume untuk lihat lokasi fisiknya:
```bash
docker volume inspect [NAMA_VOLUME]
```

3. Buat arsip backup:
```bash
sudo tar -czvf /lokasi/backup/backup_$(date +%F).tar.gz -C [MOUNTPOINT_PATH] .
```

File `backup_YYYY-MM-DD.tar.gz` adalah salinan semua gambar Anda.

---

### Restore / Migrasi ke Server Baru

1. **Persiapan di server baru**  
   - Install Docker & Docker Compose  
   - Clone kode proyek  
   - Pindahkan `backup.tar.gz` ke server  

2. **Buat volume & restore data**
```bash
docker volume create express-uploader_img_uploader_data
docker volume inspect express-uploader_img_uploader_data
sudo tar -xzvf /root/backup_YYYY-MM-DD.tar.gz -C [MOUNTPOINT_PATH_BARU]
```

3. **Jalankan aplikasi**
```bash
docker-compose up -d
```

---

## ⚠️ Peringatan & Praktik Terbaik

- **Keamanan API Key**: Jangan bagikan `INTERNAL_API_KEY` atau commit `.env` ke git.  
- **HTTPS & Reverse Proxy**: Wajib gunakan Nginx, Caddy, atau Cloudflare Tunnel untuk SSL/TLS.  
- **Header Forwarding**: Pastikan reverse proxy meneruskan header:
  - `X-Internal-Key`
  - `X-Forwarded-Proto` (agar URL hasil upload menggunakan `https://`).

