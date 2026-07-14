"use client";

import { useEffect, useState } from "react";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`royal-divider text-gold text-xs ${className}`}>
      <span className="font-cinzel tracking-widest">◆</span>
    </div>
  );
}

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative bg-cream">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col vintage-noise overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/95 via-coffee-dark/90 to-royal/95" />

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gold/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/3 rounded-full blur-[120px]" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-8">
          <FadeIn delay={200}>
            <span className="font-cinzel text-xl md:text-2xl font-bold tracking-[0.2em] text-gold">
              SEMPREXA
            </span>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="hidden md:flex items-center gap-10">
              <a href="#rexai" className="font-cormorant text-sm tracking-[0.15em] uppercase text-sand/70 hover:text-gold transition-colors duration-300">
                Rexai
              </a>
              <a href="#ozellikler" className="font-cormorant text-sm tracking-[0.15em] uppercase text-sand/70 hover:text-gold transition-colors duration-300">
                Özellikler
              </a>
              <a href="#kayit" className="font-cormorant text-sm tracking-[0.15em] uppercase text-sand/70 hover:text-gold transition-colors duration-300">
                Kayıt
              </a>
              <a
                href="#kayit"
                className="ml-4 px-6 py-2.5 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase hover:bg-gold/10 hover:border-gold transition-all duration-500"
              >
                Başla
              </a>
            </div>
          </FadeIn>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
          <FadeIn delay={600}>
            <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold/60 mb-6 block">
              ✦ Zarafet ve Zekanın Buluşma Noktası ✦
            </span>
          </FadeIn>

          <FadeIn delay={800}>
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-[6.5rem] font-bold leading-[0.95] text-cream mb-6">
              Gücün
              <br />
              <span className="gold-shimmer font-cinzel">Rengini</span>
              <br />
              Keşfet
            </h1>
          </FadeIn>

          <FadeIn delay={1000}>
            <p className="font-cormorant text-lg md:text-xl text-sand/60 max-w-lg leading-relaxed font-light mb-10">
              Yüzyıllık zarafeti modern zekayla buluşturuyoruz.
              <br />
              Her satırında iktidarın dilini konuşan tasarımlar.
            </p>
          </FadeIn>

          <FadeIn delay={1200}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#kayit"
                className="group relative px-12 py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold overflow-hidden hover:bg-gold-light transition-all duration-500"
              >
                <span className="relative z-10">Hemen Keşfet</span>
              </a>
              <a
                href="#rexai"
                className="px-12 py-4 border border-gold/20 text-gold/70 font-cinzel text-xs tracking-[0.25em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-500"
              >
                Rexai ile Tanış
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={1600} className="mt-16">
            <div className="flex flex-col items-center gap-3 text-gold/30">
              <span className="text-[10px] tracking-[0.3em] uppercase font-cormorant">Aşağı Kaydır</span>
              <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent" />
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ═══════════════════ REXAİ ═══════════════════ */}
      <section id="rexai" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream-dark to-cream" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <FadeIn>
            <Ornament className="mb-16" />
          </FadeIn>

          <div className="text-center mb-20">
            <FadeIn delay={200}>
              <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold-dark/60 mb-4 block">
                Yapay Zeka Devrimi
              </span>
            </FadeIn>
            <FadeIn delay={400}>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold text-coffee-dark mb-6">
                Tanışın: <span className="text-gold">Rexai</span>
              </h2>
            </FadeIn>
            <FadeIn delay={600}>
              <p className="font-cormorant text-lg md:text-xl text-taupe max-w-2xl mx-auto leading-relaxed font-light">
                Ekonomi piyasalarını satır satır okuyan, hisse senetlerinin nabzını tutan
                ve size kraliyet ailesi titizliğinde analizler sunan yapay zeka asistanınız.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚜",
                title: "Piyasa Analizi",
                desc: "Hisse senetleri, kripto paralar ve küresel piyasalar hakkında gerçek zamanlı, derinlemesine analizler.",
              },
              {
                icon: "♛",
                title: "Strateji Raporları",
                desc: "Kraliyet hazinesi titizliğinde hazırlanmış, yatırım stratejileri ve raporlama sistemleri.",
              },
              {
                icon: "⚜",
                title: "Tahmin Motoru",
                desc: "Gelişmiş algoritmalarla beslenen piyasa tahminleri ve risk değerlendirme modülleri.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={300 + i * 200}>
                <div className="royal-frame p-8 md:p-10 bg-cream/50 backdrop-blur-sm hover:bg-cream transition-all duration-500 group">
                  <div className="text-gold text-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-coffee-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="font-cormorant text-base text-taupe leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={1000} className="mt-16">
            <div className="royal-frame p-8 md:p-12 bg-espresso/95 backdrop-blur-sm text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-gold/60">
                  Rexai Performansı
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                {[
                  { val: "%94", label: "Doğruluk Oranı" },
                  { val: "50K+", label: "Analiz / Gün" },
                  { val: "< 0.3s", label: "Yanıt Süresi" },
                  { val: "24/7", label: "Kesintisiz Hizmet" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-cinzel text-2xl md:text-3xl font-bold text-gold mb-1">
                      {s.val}
                    </div>
                    <div className="font-cormorant text-xs tracking-widest uppercase text-sand/40">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ ÖZELLİKLER ═══════════════════ */}
      <section id="ozellikler" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-espresso via-coffee-dark to-espresso" />
        <div className="absolute inset-0 vintage-noise" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <FadeIn>
            <Ornament className="mb-16" />
          </FadeIn>

          <div className="text-center mb-20">
            <FadeIn delay={200}>
              <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold/50 mb-4 block">
                Neden Biz?
              </span>
            </FadeIn>
            <FadeIn delay={400}>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold text-cream mb-6">
                Kraliyet <span className="text-gold">Ayrıcalığı</span>
              </h2>
            </FadeIn>
            <FadeIn delay={600}>
              <p className="font-cormorant text-lg md:text-xl text-sand/50 max-w-2xl mx-auto leading-relaxed font-light">
                Yüzyılların birikimini teknolojiyle harmanlayan, her detayında zarafeti
                hissettiren bir deneyim sunuyoruz.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: "I",
                title: "Kraliyet Güvenliği",
                desc: "Verileriniz tahtın hazineleri kadar değerli. En üst düzey şifreleme ve güvenlik protokolleriyle korunur.",
              },
              {
                num: "II",
                title: "Zarif Arayüz",
                desc: "Her pikseli özenle tasarlanmış, göz yormayan ve ihtişamı hissettiren bir kullanıcı deneyimi.",
              },
              {
                num: "III",
                title: "Akıllı Borsa Takibi",
                desc: "BIST, NASDAQ, NYSE ve dünya borsalarını Rexai ile anlık takip edin, yapay zeka destekli öneriler alın.",
              },
              {
                num: "IV",
                title: "Kişisel Danışman",
                desc: "Rexai, size özel yatırım stratejileri geliştirir; tıpkı kraliyet ailelerinin özel danışmanları gibi.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={300 + i * 200}>
                <div className="group flex gap-6 p-8 border border-gold/10 hover:border-gold/25 transition-all duration-500 bg-espresso/30 backdrop-blur-sm">
                  <div className="font-cinzel text-3xl font-bold text-gold/20 group-hover:text-gold/40 transition-colors duration-500 shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold text-cream mb-3 group-hover:text-gold transition-colors duration-500">
                      {item.title}
                    </h3>
                    <p className="font-cormorant text-base text-sand/40 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ REXAI DETAY ═══════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-beige to-cream" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <FadeIn>
            <Ornament className="mb-16" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn delay={200}>
              <div className="royal-frame p-1 bg-gold/10">
                <div className="bg-espresso p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-gold/60">
                      Rexai Aktif
                    </span>
                  </div>

                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-4 bg-royal/50 border border-gold/10">
                      <span className="text-gold/50 text-xs">Rexai &gt;</span>
                      <p className="text-cream/80 mt-1">
                        BIST-100 bugün %2.3 yükseliş gösterdi.
                        Bankacılık sektörü öncülük ediyor.
                      </p>
                    </div>
                    <div className="p-4 bg-royal/50 border border-gold/10">
                      <span className="text-gold/50 text-xs">Rexai &gt;</span>
                      <p className="text-cream/80 mt-1">
                        THYAO hissesi için alım sinyali tespit edildi.
                        Hedef fiyat: ₺342. Potansiyel: %18.
                      </p>
                    </div>
                    <div className="p-4 bg-royal/50 border border-gold/10">
                      <span className="text-gold/50 text-xs">Rexai &gt;</span>
                      <p className="text-cream/80 mt-1">
                        Portföy risk analizi tamamlandı.
                        Skorunuz: 87/100 — Mükemmel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={400}>
                <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold-dark/60 mb-4 block">
                  Yapay Zeka Asistanı
                </span>
              </FadeIn>
              <FadeIn delay={600}>
                <h2 className="font-playfair text-3xl md:text-5xl font-bold text-coffee-dark mb-6">
                  Rexai ile
                  <br />
                  <span className="text-gold">Piyasaları</span> Okuyun
                </h2>
              </FadeIn>
              <FadeIn delay={800}>
                <p className="font-cormorant text-lg text-taupe leading-relaxed font-light mb-8">
                  Rexai, ekonomi dünyasının karmaşık verilerini size özel,
                  anlaşılır ve aksiyona geçirilebilir raporlara dönüştürür.
                  Borsa, kripto, forex ve emtia piyasalarında yapay zeka
                  gücünü keşfedin.
                </p>
              </FadeIn>
              <FadeIn delay={1000}>
                <div className="space-y-3">
                  {[
                    "Gerçek zamanlı piyasa verileri ve alertler",
                    "Kişiselleştirilmiş yatırım önerileri",
                    "Teknik ve temel analiz raporları",
                    "Risk yönetimi ve portföy optimizasyonu",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-gold/60 rotate-45 shrink-0" />
                      <span className="font-cormorant text-base text-coffee">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ KAYIT ═══════════════════ */}
      <section id="kayit" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-espresso via-royal to-espresso" />
        <div className="absolute inset-0 vintage-noise" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <Ornament className="mb-12" />
          </FadeIn>

          <FadeIn delay={200}>
            <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold/50 mb-4 block">
              Kraliyet Davetiyesi
            </span>
          </FadeIn>

          <FadeIn delay={400}>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-cream mb-6">
              Tahta <span className="text-gold">Adımınızı</span> Atın
            </h2>
          </FadeIn>

          <FadeIn delay={600}>
            <p className="font-cormorant text-lg text-sand/50 leading-relaxed font-light mb-12">
              Rexai&apos;nin gücünü keşfetmek için ilk adımı atın.
              Kraliyet ailesine yakışır bir deneyim sizi bekliyor.
            </p>
          </FadeIn>

          <FadeIn delay={800}>
            {!registered ? (
              <div className="royal-frame p-1 bg-gold/10">
                <div className="bg-espresso/80 backdrop-blur-sm p-8 md:p-10">
                  <h3 className="font-playfair text-xl text-cream mb-2">
                    Ücretsiz Kayıt Olun
                  </h3>
                  <p className="font-cormorant text-sm text-sand/40 mb-8">
                    Rexai&apos;ye erişim için bilgilerinizi bırakın
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (email.trim()) setRegistered(true);
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Adınız Soyadınız"
                      className="w-full px-6 py-4 bg-royal/60 border border-gold/15 text-cream font-cormorant text-base placeholder:text-sand/30 focus:outline-none focus:border-gold/40 transition-colors duration-300"
                    />
                    <input
                      type="email"
                      placeholder="E-posta Adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-royal/60 border border-gold/15 text-cream font-cormorant text-base placeholder:text-sand/30 focus:outline-none focus:border-gold/40 transition-colors duration-300"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Telefon Numaranız (isteğe bağlı)"
                      className="w-full px-6 py-4 bg-royal/60 border border-gold/15 text-cream font-cormorant text-base placeholder:text-sand/30 focus:outline-none focus:border-gold/40 transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      className="w-full py-4 bg-gold text-espresso font-cinzel text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-all duration-500 mt-2"
                    >
                      Kayıt Ol ve Keşfet
                    </button>
                  </form>

                  <p className="font-cormorant text-[11px] text-sand/25 mt-6">
                    Kayıt olarak Gizlilik Politikamızı ve Kullanım Şartlarımızı kabul etmiş olursunuz.
                  </p>
                </div>
              </div>
            ) : (
              <div className="royal-frame p-1 bg-gold/15">
                <div className="bg-espresso/80 backdrop-blur-sm p-12 text-center">
                  <div className="text-gold text-4xl mb-4">♛</div>
                  <h3 className="font-playfair text-2xl text-gold mb-3">
                    Hoş Geldiniz, Hükümdar
                  </h3>
                  <p className="font-cormorant text-base text-sand/50 leading-relaxed">
                    Rexai artık hizmetinizde. Kraliyet deneyiminiz başlıyor.
                  </p>
                  <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-espresso" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="font-cinzel text-lg tracking-[0.2em] text-gold">
                SEMPREXA
              </span>
              <p className="font-cormorant text-sm text-sand/30 mt-1">
                Zarafet ve teknolojinin buluşma noktası.
              </p>
            </div>

            <div className="flex items-center gap-8">
              {["Instagram", "LinkedIn", "Twitter"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-cormorant text-xs tracking-widest uppercase text-sand/30 hover:text-gold transition-colors duration-300"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gold/10 text-center">
            <p className="font-cormorant text-[11px] text-sand/20 tracking-widest">
              © 2026 Semprexa. Tüm hakları saklıdır. ₜ
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
