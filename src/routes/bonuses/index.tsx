import { createFileRoute } from "@tanstack/react-router";
import { PromoCard } from "@/components/bonus/PromoCard";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import { QueryState } from "@/components/bonus/StatusBadge";
import { useBonusCatalog } from "@/hooks/use-bonus";

export const Route = createFileRoute("/bonuses/")({
  head: () => ({
    meta: [
      { title: "Bonuses | DIAMOND Promotions" },
      { name: "description", content: "Welcome, daily, missions, scratch cards, mystery boxes, Diamond Race, and Weekend Boost." },
    ],
  }),
  component: BonusesIndex,
});

function BonusesIndex() {
  const catalog = useBonusCatalog();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main className="mx-auto max-w-[1320px] px-3 pb-10 pt-4 sm:px-6">
        <p className="text-[10px] font-extrabold uppercase text-primary">DIAMOND</p>
        <h1 className="font-display text-4xl font-black sm:text-5xl">BONUSES</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Claim, progress, and rankings are loaded through the bonus service. Reward amounts are never decided in this page.
        </p>
        <QueryState isLoading={catalog.isLoading} isError={catalog.isError} error={catalog.error}>
          <section className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalog.data?.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </section>
        </QueryState>
        <SiteFooter />
      </main>
    </div>
  );
}
