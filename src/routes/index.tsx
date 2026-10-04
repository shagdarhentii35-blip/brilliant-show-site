import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PromoCard } from "@/components/bonus/PromoCard";
import { QueryState } from "@/components/bonus/StatusBadge";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import { useBonusCatalog } from "@/hooks/use-bonus";
import { bonusImages } from "@/lib/bonus/images";
import type { Bonus } from "@/lib/bonus/types";
import {
  ArrowRight,
  BadgeHelp,
  ChevronRight,
  CircleAlert,
  Crown,
  Diamond,
  Gamepad2,
  Gift,
  Headset,
  Star,
  UserRoundPlus,
  Wallet,
} from "lucide-react";
import heroImage from "@/assets/diamond-hero.jpg";
import scratchBanner from "@/assets/scratch-banner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Урамшуулал | DIAMOND Promotions" },
      {
        name: "description",
        content:
          "DIAMOND-ийн welcome bonus, өдөр бүрийн бэлэг, даалгавар, азын карт болон бусад урамшууллуудтай танилцаарай.",
      },
      { property: "og:title", content: "DIAMOND Promotions — Урамшуулал" },
      { property: "og:description", content: "DIAMOND-ийн бэлэг, өдөр тутмын урамшуулал, азын карттай танилцаарай." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const catalog = useBonusCatalog();
  const [selected, setSelected] = useState<Bonus | null>(null);
  const featured = catalog.data?.filter((item) => item.placement === "featured") ?? [];
  const more = catalog.data?.filter((item) => item.placement === "more") ?? [];
  const scratch = catalog.data?.find((item) => item.id === "scratch");

  const steps = [
    { icon: UserRoundPlus, title: "1. Бүртгүүлэх", copy: "DIAMOND-д бүртгүүлнэ" },
    { icon: Wallet, title: "2. Цэнэглэх", copy: "Дансаа цэнэглэнэ" },
    { icon: Gift, title: "3. Эвент сонгох", copy: "Хүссэн урамшуулалдаа оролцоно" },
    { icon: Gamepad2, title: "4. Тоглож шагнал авах", copy: "Азаа сорьж, илүү их хожоорой!" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <main id="top">
        <section aria-labelledby="hero-title" className="relative isolate h-[335px] overflow-hidden bg-primary sm:h-[395px] lg:h-[380px]">
          <img src={heroImage} alt="DIAMOND урамшууллын зураглал" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 hero-mask" />
          <div className="relative mx-auto flex h-full max-w-[1320px] flex-col items-center justify-center px-4 pb-5 text-center sm:pb-0">
            <Crown className="mb-1 size-8 fill-gold text-gold drop-shadow-lg sm:size-11" aria-hidden="true" />
            <h1 id="hero-title" className="font-display text-[38px] font-black leading-[.9] text-primary-foreground display-shadow sm:text-[60px] lg:text-[78px]">
              <span className="block text-gold">DIAMOND</span>
              <span className="block">PROMOTIONS</span>
            </h1>
            <p className="mt-3 rounded-md border border-gold/70 bg-gold px-4 py-1 text-[10px] font-extrabold text-gold-foreground shadow-lg sm:text-sm">
              ТОГЛОНО • ОНОНО • ИЛҮҮ ИХ УРАМШУУЛАЛ АВААРАЙ
            </p>
            <div className="mt-4 grid grid-cols-4 gap-3 text-primary-foreground sm:gap-7">
              {[
                { icon: UserRoundPlus, label: "ШИНЭ ТОГЛОГЧ" },
                { icon: Gift, label: "ӨДӨР БҮР" },
                { icon: Crown, label: "VIP УРАМШУУЛАЛ" },
                { icon: Star, label: "ОНЦГОЙ ЭВЕНТ" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex min-w-0 flex-col items-center gap-1">
                  <span className="grid size-8 place-items-center rounded-full border border-gold/70 bg-deep-sea/75 sm:size-10">
                    <Icon className="size-4 text-gold sm:size-5" aria-hidden="true" />
                  </span>
                  <span className="text-[8px] font-extrabold sm:text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1320px] px-3 pb-10 pt-3 sm:px-6 sm:pt-4">
          <QueryState isLoading={catalog.isLoading} isError={catalog.isError} error={catalog.error}>
          <section id="promotions" aria-label="Урамшууллууд" className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {featured.map((promo) => (
              <PromoCard key={promo.id} promo={promo} onOpen={setSelected} />
            ))}
          </section>

          <section aria-labelledby="scratch-title" className="relative isolate mt-3 flex min-h-[215px] overflow-hidden rounded-lg border border-primary-foreground/35 card-glow sm:min-h-[185px] lg:min-h-[205px]">
            <img src={scratchBanner} alt="" loading="lazy" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-deep-sea/20" />
            <div className="relative mx-auto flex w-full max-w-[850px] flex-col items-center justify-center px-4 py-5 text-center text-primary-foreground lg:flex-row lg:justify-center lg:gap-12">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-extrabold uppercase text-gold sm:text-xs">АЗАА СОРЬЖ, НУУЦ ШАГНАЛАА НЭЭ</p>
                <h2 id="scratch-title" className="font-display text-4xl font-black leading-none display-shadow sm:text-5xl lg:text-6xl">
                  SCRATCH <span className="text-gold">CARD</span>
                </h2>
                <p className="mt-2 text-xs font-bold sm:text-sm">Картаа зурж, өөртөө зориулсан бэлгийг нээгээрэй!</p>
              </div>
              <Button
                variant="gold"
                className="mt-4 h-11 shrink-0 rounded-lg px-7 text-sm lg:mt-0"
                onClick={() => {
                  if (scratch) setSelected(scratch);
                }}
              >
                АЗАА СОРИХ <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </section>

          <section aria-label="Бусад урамшуулал" className="mt-3 grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
            {more.map((promo) => (
              <PromoCard key={promo.id} promo={promo} compact onOpen={setSelected} />
            ))}
          </section>
          </QueryState>

          <section id="how-it-works" aria-labelledby="steps-title" className="section-glass mt-4 rounded-lg p-3 sm:p-4">
            <h2 id="steps-title" className="mb-3 text-center font-display text-lg font-black text-foreground sm:text-xl">
              Яаж оролцох вэ?
            </h2>
            <div className="grid grid-cols-2 gap-2 rounded-lg pale-surface p-2 shadow-sm lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex min-w-0 items-center gap-2 border-border/65 px-1 py-2 sm:gap-3 sm:px-3 lg:border-r last:border-r-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full nav-surface text-primary-foreground sm:size-12">
                    <Icon className="size-5 sm:size-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold leading-tight sm:text-sm">{title}</h3>
                    <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-xs">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.05fr_1fr]">
            <section aria-labelledby="terms-title" className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2">
                <CircleAlert className="size-5 shrink-0 fill-gold text-gold-foreground" aria-hidden="true" />
                <h2 id="terms-title" className="font-display text-base font-black sm:text-lg">
                  Анхаарах зүйлс
                </h2>
              </div>
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="eligibility">
                  <AccordionTrigger className="py-2 text-xs sm:text-sm">Оролцох нөхцөл</AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                    Урамшуулал бүрийн оролцох эрх, хугацаа болон шаардлага өөр байж болно. Зөвхөн насанд хүрсэн хэрэглэгч оролцоно.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reward">
                  <AccordionTrigger className="py-2 text-xs sm:text-sm">Шагнал ба урамшуулал</AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                    Шагнал, бонусын хэмжээ болон ашиглах нөхцөл нь тухайн идэвхтэй саналын дүрмээс хамаарна. Урамшуулал бүрийн дэлгэрэнгүй мэдээллийг шалгана уу.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="play">
                  <AccordionTrigger className="py-2 text-xs sm:text-sm">Хариуцлагатай тоглолт</AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                    Боломжоо харгалзан хариуцлагатай тоглоорой. Тоглох нь санхүүгийн орлогын эх үүсвэр биш.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            <section id="support" aria-labelledby="support-title" className="relative isolate flex min-h-[215px] overflow-hidden rounded-lg nav-surface p-5 text-primary-foreground sm:p-6">
              <div className="absolute -right-5 -bottom-10 text-primary-foreground/10">
                <Diamond size={210} strokeWidth={1} aria-hidden="true" />
              </div>
              <div className="relative flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                  <Headset className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="support-title" className="font-display text-lg font-black">
                    Тусламж
                  </h2>
                  <p className="mt-2 max-w-[330px] text-xs leading-relaxed text-primary-foreground/90">
                    Урамшуулал болон оролцох нөхцөлийн талаар асуулт байна уу?
                  </p>
                  <Button variant="gold" size="sm" className="mt-4 rounded-full px-6" asChild>
                    <Link to="/bonuses">Бонус хуудас</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
          <SiteFooter />
        </div>
      </main>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-md overflow-hidden rounded-lg border-border p-0">
          {selected ? (
            <>
              <div className="relative h-44 overflow-hidden">
                <img src={bonusImages[selected.imageKey]} alt="" width={944} height={704} className="h-full w-full object-cover" />
                <div className="absolute inset-0 promo-shade" />
                <span className="absolute bottom-3 left-5 font-display text-2xl font-black text-primary-foreground display-shadow">
                  {selected.title}
                </span>
              </div>
              <div className="p-5">
                <DialogHeader>
                  <DialogTitle className="text-left font-display text-xl">{selected.title}</DialogTitle>
                  <DialogDescription className="pt-2 text-left leading-relaxed">{selected.detail}</DialogDescription>
                </DialogHeader>
                <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <BadgeHelp className="size-4 shrink-0 text-primary" aria-hidden="true" /> Тухайн урамшууллын хүчинтэй нөхцөлийг заавал шалгаарай.
                </p>
                <Button variant="casino" className="mt-5 w-full rounded-full" asChild>
                  <Link to="/bonuses/$bonusId" params={{ bonusId: selected.id }} onClick={() => setSelected(null)}>
                    {selected.action} <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
