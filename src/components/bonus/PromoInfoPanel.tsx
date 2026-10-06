import { getCatalogItem } from "@/lib/bonus/admin-config";
import type { BonusId } from "@/lib/bonus/types";

export function PromoInfoPanel({ bonusId }: { bonusId: BonusId }) {
  const promo = getCatalogItem(bonusId);
  const comingSoon = promo.kind === "comingSoon";

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
      {comingSoon ? (
        <p className="mb-3 inline-flex rounded-full border border-gold/70 bg-gold px-3 py-1 text-[10px] font-extrabold text-gold-foreground">
          COMING SOON · ТУН УДАХГҮЙ
        </p>
      ) : null}
      <p className="font-display text-2xl font-black text-primary sm:text-3xl">{promo.highlight}</p>
      <ul className="mt-4 space-y-2 text-sm font-medium">
        {promo.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{promo.detail}</p>
    </div>
  );
}
