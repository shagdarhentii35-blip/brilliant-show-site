import { createFileRoute } from "@tanstack/react-router";
import { PromoCard } from "@/components/bonus/PromoCard";
import { ScratchFeatureBanner } from "@/components/bonus/ScratchFeatureBanner";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import { QueryState } from "@/components/bonus/StatusBadge";
import { useBonusCatalog } from "@/hooks/use-bonus";

export const Route = createFileRoute("/bonuses/")({
  head: () => ({
    meta: [
      { title: "Bonuses | DIAMOND Promotions" },
      { name: "description", content: "First deposit, deposit bonus, cashback, VIP, special events, and scratch cards." },
    ],
  }),
  component: BonusesIndex,
});

function BonusesIndex() {
  const catalog = useBonusCatalog();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main className="mx-auto max-w-[1320px] px-3 pb-10 pt-3 sm:px-6 sm:pt-4">
        <ScratchFeatureBanner />
        <QueryState isLoading={catalog.isLoading} isError={catalog.isError} error={catalog.error}>
          <section className="mt-3 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-3">
            {catalog.data
              ?.filter((promo) => promo.kind !== "interactive")
              .map((promo) => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
          </section>
        </QueryState>
        <SiteFooter />
      </main>
    </div>
  );
}
