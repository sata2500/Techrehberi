# Tech Rehberi - Modern Blog & Öğrenme Platformu

Tech Rehberi, Next.js, TypeScript, Tailwind CSS ve Firebase ile oluşturulmuş modern bir blog ve öğrenme platformudur. Blog yazıları, kurslar ve diğer eğitim içeriklerinin oluşturulması ve yönetilmesi için kapsamlı bir içerik yönetim sistemi sunar.

## Özellikler

- 📱 Tüm cihazlar için duyarlı tasarım
- 🌓 Açık ve karanlık mod desteği
- 🔒 Firebase ile kullanıcı kimlik doğrulama
- 👤 Kaydedilen içerik ve okuma geçmişi ile kullanıcı profilleri
- 📝 Blog yazıları için zengin metin düzenleme
- 🖼️ Görsel yükleme ve yönetimi
- 🏷️ İçerik organizasyonu için kategoriler ve etiketler
- 📊 Analitik içeren yönetici paneli
- 🔍 Filtreli arama fonksiyonu

## Teknoloji Yığını

- **Frontend**: Next.js, React, TypeScript
- **Stil**: Tailwind CSS, Lucide React (ikonlar)
- **Durum Yönetimi**: React Context API
- **Kimlik Doğrulama**: Firebase Authentication
- **Veritabanı**: Firebase Firestore
- **Depolama**: Firebase Storage
- **Dağıtım**: Vercel (veya tercih ettiğiniz hosting)

## Başlarken

### Ön Koşullar

- Node.js 16.x veya üstü
- npm veya yarn
- Firestore ve Authentication etkinleştirilmiş Firebase hesabı

### Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/techrehberi.git
   cd techrehberi
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn
   ```

3. Kök dizinde Firebase kimlik bilgilerinizle bir .env.local dosyası oluşturun:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=api-anahtarınız
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth-domaininiz
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=proje-id-niz
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=storage-bucket-adresi
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=measurement-id

   # Firebase Admin SDK için (sunucu tarafı)
   FIREBASE_PROJECT_ID=proje-id-niz
   FIREBASE_CLIENT_EMAIL=client-email-adresiniz
   FIREBASE_PRIVATE_KEY=private-key-değeriniz
   ```

4. Firebase'i başlatın:
   - Gerekli koleksiyonları ve güvenlik kurallarını oluşturmak için dokümantasyondaki Firebase kurulum rehberini izleyin
   - adminUsers koleksiyonuna Firebase Kullanıcı UID'niz ile en az bir admin kullanıcı ekleyin

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

Sonucu görmek için tarayıcınızda http://localhost:3000 adresini açın.

## Proje Yapısı

```
techrehberi/
├── public/          # Statik varlıklar
├── src/
│   ├── components/  # React bileşenleri
│   │   ├── admin/   # Admin panel bileşenleri
│   │   ├── home/    # Ana sayfa bileşenleri
│   │   ├── layout/  # Düzen bileşenleri
│   │   └── ui/      # Yeniden kullanılabilir UI bileşenleri
│   ├── contexts/    # React context'leri
│   ├── data/        # Statik veriler ve veri modelleri
│   ├── lib/         # Yardımcı fonksiyonlar ve servisler
│   │   ├── firebase/# Firebase ile ilgili servisler
│   │   └── utils/   # Yardımcı fonksiyonlar
│   ├── pages/       # Next.js sayfaları
│   │   ├── admin/   # Admin panel sayfaları
│   │   ├── api/     # API rotaları
│   │   ├── auth/    # Kimlik doğrulama sayfaları
│   │   ├── blog/    # Blog sayfaları
│   │   └── profile/ # Kullanıcı profil sayfaları
│   └── styles/      # Global stiller
└── types/           # TypeScript tip tanımları
```

## Admin Paneli

Admin paneline /admin/dashboard adresinden erişilebilir ve şunları içerir:

- Analitik ve hızlı işlemler içeren Dashboard
- Blog yazısı yönetimi (oluşturma, düzenleme, silme)
- Kategori yönetimi
- Medya kütüphanesi
- Kullanıcı yönetimi
- Site ayarları

Yalnızca Firestore'da admin rolüne sahip kullanıcılar admin paneline erişebilir.

## Dağıtım

Bu proje Vercel, Netlify veya Next.js uygulamalarını destekleyen diğer hosting hizmetlerinde dağıtılabilir.

### Vercel'e Dağıtım

1. Kodunuzu bir GitHub deposuna gönderin
2. Deponuzu Vercel'e bağlayın
3. Vercel dashboard'da ortam değişkenlerinizi ekleyin
4. Dağıtın!

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir Pull Request göndermekten çekinmeyin.

1. Depoyu forklayın
2. Feature branch'inizi oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika bir özellik ekle'`)
4. Branch'inize push yapın (`git push origin feature/harika-ozellik`)
5. Bir Pull Request açın

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - ayrıntılar için LICENSE dosyasına bakın.

## Teşekkürler

- Next.js
- React
- Tailwind CSS
- Firebase
- Lucide Icons