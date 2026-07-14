"use client";

import Link from "next/link";

export interface Listing {
  id: string;
  title: string;
  type: string;
  company: string;
  ciro: string;
  price: string;
  phone: string;
  desc: string;
  date: string;
  aiApproved: boolean;
  owner: string;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const typeColors: Record<string, string> = {
    "Şirket Ortaklığı": "bg-gold/15 text-gold",
    "Hisse Alımı": "bg-emerald-900/30 text-emerald-400",
    "Hisse Satımı": "bg-red-900/30 text-red-400",
    "Şirket Satışı": "bg-blue-900/30 text-blue-400",
    "Şirket Alımı": "bg-purple-900/30 text-purple-400",
    "Yatırım Ortaklığı": "bg-amber-900/30 text-amber-400",
  };

  return (
    <Link href={`/ilan/${listing.id}`}>
      <div className="royal-frame p-6 bg-cream/50 hover:bg-cream transition-all duration-500 cursor-pointer group h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 text-[10px] tracking-widest uppercase font-cinzel ${typeColors[listing.type] || "bg-gold/10 text-gold"}`}>
            {listing.type}
          </span>
          {listing.aiApproved && (
            <span className="text-[10px] text-gold/50 font-cormorant flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
              Rexai Onaylı
            </span>
          )}
        </div>

        <h3 className="font-playfair text-lg font-semibold text-coffee-dark group-hover:text-gold-dark transition-colors mb-2">
          {listing.title}
        </h3>

        <p className="font-cormorant text-sm text-taupe line-clamp-2 mb-4 flex-1">
          {listing.desc}
        </p>

        <div className="border-t border-gold/10 pt-4 space-y-2">
          <div className="flex justify-between font-cormorant text-xs text-taupe">
            <span>Şirket: <strong className="text-coffee-dark">{listing.company}</strong></span>
            <span>Ciro: <strong className="text-coffee-dark">{listing.ciro}</strong></span>
          </div>
          <div className="flex justify-between font-cormorant text-xs">
            <span className="text-taupe">{listing.date}</span>
            <span className="text-gold-dark font-semibold">{listing.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
