# SubTracker - Abonelik Yönetim Sistemi

> *Kapsamlı, modern ve kullanıcı odaklı bir abonelik ve harcama takip uygulaması.*

SubTracker, kullanıcıların dijital aboneliklerini (Netflix, Spotify, yazılım lisansları vb.) tek bir platform üzerinden takip edebilmesini, faturalandırma geçmişlerini görebilmesini ve ödeme süreçlerini kolayca yönetebilmesini sağlayan tam kapsamlı bir web uygulamasıdır. MVP sürümü Node.js, Express, React, Vite ve Prisma gibi modern web teknolojileri kullanılarak inşa edilmiştir.

---

## 📋 Table of Contents / İçindekiler

1. [Features / Özellikler](#-features--özellikler)
2. [Installation and Setup / Kurulum ve Başlangıç](#-installation-and-setup--kurulum-ve-başlangıç)
3. [Usage / Kullanım](#-usage--kullanım)
4. [Configuration and Environment Variables / Konfigürasyon](#-configuration-and-environment-variables--konfigürasyon)
5. [Architecture and Design Decisions / Mimari ve Tasarım](#-architecture-and-design-decisions--mimari-ve-tasarım)
6. [API Reference / API Dokümantasyonu](#-api-reference--api-dokümantasyonu)
7. [Testing / Testler](#-testing--testler)
8. [Deployment / Dağıtım](#-deployment--dağıtım)
9. [Contributing Guidelines / Katkıda Bulunma](#-contributing-guidelines--katkıda-bulunma)
10. [License / Lisans](#-license--lisans)
11. [Credits and Acknowledgments / Teşekkürler](#-credits-and-acknowledgments--teşekkürler)
12. [Personal Details / Öğrenci Bilgileri](#-personal-details--öğrenci-bilgileri)
13. [Changelog and Versioning / Sürüm Notları](#-changelog-and-versioning--sürüm-notları)

---

## ✨ Features / Özellikler

- **Gelişmiş Kullanıcı Yönetimi:** JWT tabanlı güvenli kimlik doğrulama, kullanıcı kayıt ve giriş sistemleri.
- **Abonelik Takibi:** Abonelik ekleme, listeleme, güncelleme ve iptal etme (CRUD işlemleri).
- **Ödeme Geçmişi:** Yapılan ödemelerin tutulması ve listelenmesi.
- **Görsel Veri Analizi:** Chart.js ve react-chartjs-2 kullanılarak gelir/gider trendlerinin, kategori bazlı harcama dağılımlarının grafiksel gösterimi.
- **Dışa Aktarma:** Abonelik ve ödeme geçmişini CSV formatında indirebilme.
- **Modern UI/UX:** Glassmorphism tasarımı, Framer Motion animasyonları ve tam uyumlu Dark/Light tema desteği.

---

## 🚀 Installation and Setup / Kurulum ve Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- npm (v9 veya üzeri)
- Git

### Adım 1: Projeyi Klonlayın
```bash
git clone <your_github_url>
cd subtrack
```

### Adım 2: Backend Kurulumu
```bash
cd backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
```

### Adım 3: Frontend Kurulumu
```bash
cd ../frontend
npm install
```

---

## 💻 Usage / Kullanım

Projeyi çalıştırmak için kök dizinde bulunan `index.js` dosyasını kullanabilirsiniz. Bu script, hem frontend hem de backend sunucusunu eşzamanlı olarak başlatır.

```bash
# Kök dizindeyken (subtrack klasörü)
npm start
# Veya alternatif olarak: node index.js
```

Sunucular başlatıldığında:
- **Frontend Uygulaması:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** `http://localhost:3001`

**Demo Giriş Bilgileri (Seed verileri ile test için):**
- **E-posta:** `demo@subtracker.com`
- **Şifre:** `password123`

---

## ⚙️ Configuration and Environment Variables / Konfigürasyon

Projeyi çalıştırmak için gerekli olan ortam değişkenleri `.env` dosyaları içerisinde tutulmaktadır. 

**Backend (`backend/.env` örneği):**
```env
# Uygulama Portu
PORT=3001
# Veritabanı URL'si (MVP için SQLite kullanılmıştır)
DATABASE_URL="file:./dev.db"
# JWT Gizli Anahtarı
JWT_SECRET="super-secret-jwt-key-change-in-production"
```

*(Not: Prodüksiyon ortamında `JWT_SECRET` gibi değerlerin mutlaka güvenli ve karmaşık stringlerle değiştirilmesi gerekmektedir.)*

---

## 🏗️ Architecture and Design Decisions / Mimari ve Tasarım

Proje "Monorepo" mantığına benzer şekilde, frontend ve backend olarak iki ayrı klasöre ayrılmış ancak tek bir kök dizinden yönetilebilir şekilde tasarlanmıştır.

- **Backend:** Express.js kullanılarak Service-Controller-Route (Clean Architecture prensiplerine uygun) katmanlı mimarisiyle yapılandırılmıştır. Veritabanı işlemleri için Prisma ORM kullanılarak tip güvenliği (Type Safety) sağlanmıştır. Hatalar merkezi bir Error Middleware üzerinden yönetilmektedir. Zod ile gelen isteklerin doğrulaması (Validation) yapılmaktadır.
- **Frontend:** React 18 ve Vite kullanılmıştır. Bileşen tabanlı yapı benimsenmiş, global state yönetimi Context API ile sağlanmıştır. Tasarımda Tailwind CSS kullanılarak hızlı ve tutarlı bir UI oluşturulmuş, Framer Motion ile mikro animasyonlar eklenmiştir.

---

## 🔌 API Reference / API Dokümantasyonu

Aşağıda backend üzerinde sunulan temel API endpoint'lerinden bazıları yer almaktadır:

| Endpoint | Metot | Açıklama |
|----------|-------|----------|
| `/api/auth/register` | `POST` | Yeni kullanıcı kaydı. |
| `/api/auth/login` | `POST` | Kullanıcı girişi ve JWT token alınması. |
| `/api/subscriptions` | `GET` | Kullanıcının aktif aboneliklerini listeler. |
| `/api/subscriptions` | `POST` | Yeni abonelik oluşturur. |
| `/api/reports/revenue` | `GET` | Gelir/gider trend grafikleri için verileri döner. |

*(Tüm route'lar kimlik doğrulama gerektirir (Auth Middleware), `auth/` route'ları hariç.)*

---

## 🧪 Testing / Testler

*(Gelecek Faz Planlaması)*
Şu anki MVP sürümünde otomatik test senaryoları bulunmamaktadır. Gelecek sürümlerde:
- **Backend:** `Jest` ve `Supertest` ile entegrasyon ve birim testleri.
- **Frontend:** `Vitest` ve `React Testing Library` ile UI testleri eklenecektir.

---

## 🌍 Deployment / Dağıtım

*(Projenin dağıtımı için önerilen yapı)*
- **Veritabanı:** PostgreSQL (Render veya Supabase).
- **Backend:** Render, Railway veya Heroku.
- **Frontend:** Vercel veya Netlify.

Dağıtım için backend `DATABASE_URL` ortam değişkeni üretim (production) veritabanına işaret edecek şekilde güncellenmeli ve Prisma SQLite'dan PostgreSQL'e çevrilmelidir (`prisma/schema.prisma` içerisinde `provider = "postgresql"`).

---

## 🤝 Contributing Guidelines / Katkıda Bulunma

Bu proje açık kaynaklı geliştirilmeye uygundur. Katkıda bulunmak isterseniz lütfen aşağıdaki adımları izleyin:

1. Bu depoyu (repository) Fork'layın.
2. Yeni bir dal (branch) oluşturun (`git checkout -b feature/YeniOzellik`).
3. Değişikliklerinizi Commit'leyin (`git commit -m 'Yeni özellik eklendi'`).
4. Dalınıza Push'layın (`git push origin feature/YeniOzellik`).
5. Bir Pull Request (PR) açın.

Lütfen kod standartlarına ve Commit mesajı kurallarına uymaya özen gösterin.

---

## 📄 License / Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz. Kodu dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz.

---

## 👏 Credits and Acknowledgments / Teşekkürler

Bu uygulamanın geliştirilmesi sürecinde yararlanılan açık kaynak kütüphaneler ve topluluklar:
- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/)
- İkonlar için [Lucide Icons](https://lucide.dev/)

---

## 🎓 Personal Details / Öğrenci Bilgileri

Bu proje, akademik gereksinimler kapsamında veya kişisel portfolyo amacıyla geliştirilmiştir.

- **Full Name (Ad Soyad):** Semih Yılmaz
- **Student Number (Öğrenci Numarası):** 24010501128
- **GitHub Repository:** https://github.com/canyurtgun/SubTrack---Abonelik-Takip-Sistemi

---

## 🔄 Changelog and Versioning / Sürüm Notları

### v1.0.0 (MVP)
- **Eklenenler:**
  - JWT tabanlı Login & Register mekanizması.
  - Abonelik oluşturma, listeleme, düzenleme ve iptal etme özellikleri (CRUD).
  - Aylık harcama istatistikleri ve Chart.js entegrasyonu.
  - CSV dışa aktarma (Abonelikler ve Ödemeler).
  - Dark/Light tema desteği ve glassmorphism UI tasarımı.
- **Planlanan (v1.1.0):**
  - Gerçek ödeme ağ geçidi entegrasyonu (Stripe).
  - E-posta ile ödeme yaklaşma uyarıları.
  - Kapsamlı otomatik test senaryoları.
