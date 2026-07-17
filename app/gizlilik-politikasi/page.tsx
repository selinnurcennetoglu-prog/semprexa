"use client";

import Link from "next/link";
import { useTheme } from "../lib/useTheme";
import { LilySmall } from "../components/Decorations";

export default function GizlilikPolitikasiPage() {
  const { bg } = useTheme();

  return (
    <main style={{ background: bg, minHeight: "100vh" }} className="pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <LilySmall className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 style={{ fontFamily: "var(--font-fuzzy)", fontSize: "2rem" }} className="neon-text-pink">Gizlilik Politikası</h1>
          <div className="royal-divider mt-3"><span style={{ color: "#00F0FF" }}>✦</span></div>
          <p style={{ fontFamily: "var(--font-cormorant)", color: "#BC6CFF", marginTop: "8px", fontSize: "0.9rem" }}>
            Son güncelleme: 17 Temmuz 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. TANIMLAMALAR */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">1. Tanımlamalar</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Bu Gizlilik Politikası, <strong>Semprexa</strong> (&quot;Platform&quot;) tarafından sunulan hizmetlerde kişisel verilerinizin
              nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklar. Platformu kullanarak bu politikanın
              şartlarını kabul etmiş sayılırsınız. Bu politika 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
              ve ilgili mevzuata uygun olarak hazırlanmıştır.
            </p>
          </section>

          {/* 2. VERİ SORUMLUSU */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">2. Veri Sorumlusu</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              6698 sayılı KVKK kapsamında veri sorumlusu: <strong>Semprexa</strong>.<br />
              E-posta: <a href="mailto:semprexaa@gmail.com" style={{ color: "#00F0FF", textDecoration: "underline" }}>semprexaa@gmail.com</a>
            </p>
          </section>

          {/* 3. TOPLANAN KİŞİSEL VERİLER */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">3. Toplanan Kişisel Veriler</h2>

            <div className="space-y-4">
              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "6px" }}>A) KAYIT SIRASINDA TOPLANANLAR</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
                  Ad-soyad, e-posta adresi, telefon numarası, cinsiyet (opsiyonel), şifre (şifrelenmiş olarak saklanır).
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "6px" }}>B) SİPARİŞ SIRASINDA TOPLANANLAR</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
                  Teslimat adresi (il, ilçe, mahalle, açık adres), telefon numarası, sipariş notu, ödeme yöntemi (banka/kart adı —
                  kart numarası sunucuda saklanmaz), sipariş geçmişi.
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "6px" }}>C) OTOMATİK TOPLANANLAR</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
                  IP adresi (sadece rate-limiting amacıyla kullanılır, kalıcı olarak saklanmaz), tarayıcı türü, cihaz bilgisi.
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: "var(--font-cinzel)", color: "#00F0FF", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "6px" }}>D) YEREL DEPOLAMA (TARAYICINIZDA SAKLANANLAR)</h3>
                <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
                  Oturum bilgileri (giriş tokenları), sepet içeriği, tema tercihi, reklam ayarları. Bu veriler tarayıcınızda
                  saklanır ve sunucuya gönderilmez.
                </p>
              </div>
            </div>
          </section>

          {/* 4. VERİLERİN KULLANIM AMACI */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">4. Verilerin Kullanım Amacı</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Toplanan kişisel veriler aşağıdaki amaçlarla kullanılır:
            </p>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li>Üyelik hesabı oluşturmak ve yönetmek</li>
              <li>Siparişlerinizi işlemek ve teslim etmek</li>
              <li>Kargo takibi sağlamak</li>
              <li>Müşteri hizmetleri ve iletişimi yürütmek</li>
              <li>Yasal yükümlülükleri yerine getirmek (fatura, muhasebe)</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Platform iyileştirmesi ve analiz</li>
            </ul>
          </section>

          {/* 5. KREDİ/KART BİLGİLERİ */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">5. Ödeme ve Kart Bilgileri</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              <strong>Kredi kartı numaranız, son kullanma tarihiniz ve CVV&apos;niz asla sunucularımızda saklanmaz.</strong>
              Bu bilgiler yalnızca tarayıcınızda işlenir ve ödeme onayı sırasında kullanılır. Sadece kartınızın son 4 hanesi
              referans amacıyla oturumDepolamasına kaydedilir. Ödeme işlemleri SSL ile şifreli olarak gerçekleştirilir.
            </p>
          </section>

          {/* 6. ÜÇÜNCÜ TARAFLARLA PAYLAŞIM */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">6. Üçüncü Taraflarla Paylaşım</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
            </p>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li><strong>Kargo firmaları:</strong> Siparişinizin teslimatı için adınız, adresiniz ve telefon numaranız kargo firmasıyla paylaşılır.</li>
              <li><strong>Altyapı sağlayıcıları:</strong> Verileriniz Supabase (bulut veritabanı) üzerinde güvenli şekilde saklanır.</li>
              <li><strong>Yasal zorunluluk:</strong> Mahkeme kararı veya yasal talep doğrultusunda yetkili mercilerle paylaşılabilir.</li>
            </ul>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8, marginTop: "8px" }}>
              Verileriniz reklam amaçlı üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.
            </p>
          </section>

          {/* 7. ÇEREZLER VE TEKNOLOJİLER */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">7. Çerezler ve Yerel Depolama</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Platformumuz <strong>çerez (cookie) kullanmamaktadır.</strong> Bunun yerine tarayıcınızın yerel depolama
              (localStorage) ve oturum depolama (sessionStorage) özellikleri kullanılır:
            </p>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li><strong>Oturum bilgileri:</strong> Giriş yapmanızı sağlamak için (sunucuya gönderilmez)</li>
              <li><strong>Sepet:</strong> Alışveriş sepetinizin saklanması için</li>
              <li><strong>Tema tercihi:</strong> Görünüm ayarlarınızın hatırlanması için</li>
            </ul>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8, marginTop: "8px" }}>
              Reklam hizmeti sunulması durumunda, reklamcılık ortaklarımız tarafından çerezler kullanılabilir.
              Bu durumda ilave bir onay istenecektir.
            </p>
          </section>

          {/* 8. VERİ GÜVENLİĞİ */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">8. Veri Güvenliği</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Kişisel verilerinizin güvenliği için aşağıdaki önlemler alınmıştır:
            </p>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li>SSL/TLS şifreleme (HTTPS)</li>
              <li>Şifreler tek taraflı olarak şifrelenerek (hash) saklanır — geri dönüşümsüz</li>
              <li>Supabase Row Level Security (RLS) ile veri erişim kontrolü</li>
              <li>Rate-limiting ile brute-force saldırı koruması</li>
              <li>API anahtarı ve servis anahtarı sunucu tarafında saklanır, istemciye gönderilmez</li>
              <li>Yalnızca yetkili personel (admin) verilere erişebilir</li>
            </ul>
          </section>

          {/* 9. HAKLARINIZ */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">9. Haklarınız (KVKK Madde 11)</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz varsa bunlara ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>İşleme faaliyetine itiraz etme</li>
            </ul>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8, marginTop: "8px" }}>
              Haklarınızı kullanmak için <a href="mailto:semprexaa@gmail.com" style={{ color: "#00F0FF", textDecoration: "underline" }}>semprexaa@gmail.com</a> adresine
              e-posta gönderebilirsiniz. Talebiniz en geç 30 gün içinde yanıtlanır.
            </p>
          </section>

          {/* 10. SAKLAMA SÜRESİ */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">10. Veri Saklama Süresi</h2>
            <ul style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 2, paddingLeft: "20px", listStyleType: "disc" }}>
              <li><strong>Hesap bilgileri:</strong> Hesabınız aktif olduğu sürece</li>
              <li><strong>Sipariş verileri:</strong> Son siparişten itibaren 10 yıl (yasal muhasebe yükümlülüğü)</li>
              <li><strong>Oturum tokenları:</strong> Oturum kapatıldığında veya süresi dolduğunda</li>
              <li><strong>Rate-limit verileri:</strong> Sunucu yeniden başlatıldığında silinir</li>
            </ul>
          </section>

          {/* 11. ÇOCUKLARIN GİZLİLİĞİ */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">11. 18 Yaş Altındaki Kullanıcılar</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Platformumuz 18 yaşından küçük kullanıcılar için değildir. 18 yaşından küçük kişilerden bilerek
              kişisel veri toplamıyoruz. Bu durumun farkına varmamız hâlinde ilgili veriler derhal silinir.
            </p>
          </section>

          {/* 12. DEĞİŞİKLİKLER */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">12. Politika Değişiklikleri</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Bu Gizlilik Politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlandığı anda
              yürürlüğe girer. Önemli değişiklikler size e-posta ile bildirilir. Politikanın güncel halini bu
              sayfadan takip edebilirsiniz.
            </p>
          </section>

          {/* 13. İLETİŞİM */}
          <section className="p-6 rounded-sm" style={{ background: "#111535", border: "1px solid #BC6CFF20" }}>
            <h2 style={{ fontFamily: "var(--font-fuzzy)", color: "#FF5CA8", fontSize: "1.2rem" }} className="mb-3">13. İletişim</h2>
            <p style={{ fontFamily: "var(--font-cormorant)", color: "#E9CFE8", lineHeight: 1.8 }}>
              Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için:<br />
              E-posta: <a href="mailto:semprexaa@gmail.com" style={{ color: "#00F0FF", textDecoration: "underline" }}>semprexaa@gmail.com</a>
            </p>
          </section>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="inline-block px-6 py-3 rounded-sm" style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "0.15em", border: "1px solid #BC6CFF40", color: "#BC6CFF" }}>
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
