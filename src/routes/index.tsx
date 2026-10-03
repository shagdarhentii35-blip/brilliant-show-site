import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, BadgeHelp, ChevronRight, CircleAlert, Crown, Diamond, Gamepad2, Gift, Headset, LockKeyhole, ShieldCheck, Sparkles, Star, UserRoundPlus, Wallet } from "lucide-react";
import heroImage from "@/assets/diamond-hero.jpg";
import welcomeImage from "@/assets/welcome-gift.jpg";
import chestImage from "@/assets/daily-chest.jpg";
import missionImage from "@/assets/daily-mission.jpg";
import scratchImage from "@/assets/scratch-card.jpg";
import scratchBanner from "@/assets/scratch-banner.jpg";
import mysteryImage from "@/assets/mystery-box.jpg";
import raceImage from "@/assets/diamond-race.jpg";
import weekendImage from "@/assets/weekend-boost.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Урамшуулал | DIAMOND Promotions" },
      { name: "description", content: "DIAMOND-ийн welcome bonus, өдөр бүрийн бэлэг, даалгавар, азын карт болон бусад урамшууллуудтай танилцаарай." },
      { property: "og:title", content: "DIAMOND Promotions — Урамшуулал" },
      { property: "og:description", content: "DIAMOND-ийн бэлэг, өдөр тутмын урамшуулал, азын карттай танилцаарай." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Promotion = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  action: string;
  detail: string;
  badge: "pink" | "blue" | "green" | "purple" | "gold";
};

const featuredPromos: Promotion[] = [
  { id: "welcome", eyebrow: "ШИНЭ ТОГЛОГЧ", title: "WELCOME BONUS", description: "Шинэ тоглогчийн тусгай урамшуулал", image: welcomeImage, action: "Дэлгэрэнгүй", detail: "DIAMOND-д шинээр нэгдэж буй тоглогчдод зориулсан угтан авах урамшуулал. Идэвхтэй санал болон эрхийн нөхцөлийг бүртгэлдээ нэвтэрсний дараа шалгана уу.", badge: "pink" },
  { id: "daily", eyebrow: "ӨДӨР БҮРИЙН", title: "DAILY BONUS", description: "Өдөр бүр нээ, шагналаа аваарай", image: chestImage, action: "Дэлгэрэнгүй", detail: "Өдөр тутмын урамшууллын санал өөрчлөгдөж болно. Тухайн өдрийн боломжит бэлэг болон оролцох нөхцөлийг бүртгэлдээ нэвтрэн харна уу.", badge: "blue" },
  { id: "mission", eyebrow: "ДААЛГАВАР", title: "DAILY MISSION", description: "Даалгавраа биелүүлж, бонус аваарай", image: missionImage, action: "Дэлгэрэнгүй", detail: "Өдөр бүрийн даалгавруудыг биелүүлж урамшуулал авах боломжтой. Боломжит даалгавар, хугацаа болон шаардлагыг бүртгэлдээ нэвтэрч шалгана уу.", badge: "green" },
  { id: "scratch", eyebrow: "АЗЫН КАРТ", title: "SCRATCH CARD", description: "Картаа зурж, нууц шагналаа нээ!", image: scratchImage, action: "Оролцох", detail: "Азын картыг зурж нууц бэлгээ нээх боломжтой. Оролцох эрх, давтамж болон боломжит шагналын мэдээллийг бүртгэлдээ нэвтэрч шалгана уу.", badge: "purple" },
];

const morePromos: Promotion[] = [
  { id: "mystery", eyebrow: "НУУЦ ХАЙРЦАГ", title: "MYSTERY BOX", description: "Тусгай шагнал, гэнэтийн бэлэг", image: mysteryImage, action: "Нээх", detail: "Нууц хайрцагт гэнэтийн урамшуулал хүлээж байж болно. Нээх боломж болон холбогдох нөхцөлийг бүртгэлдээ нэвтэрч үзнэ үү.", badge: "gold" },
  { id: "race", eyebrow: "РАНКИНГ ЭВЕНТ", title: "DIAMOND RACE", description: "Өрсөлдөж, байр эзлээрэй", image: raceImage, action: "Ранк үзэх", detail: "DIAMOND RACE нь тоглогчдын эрэмбийн эвент. Идэвхтэй хугацаа, оноо тооцох болон шагналын нөхцөлийг бүртгэлдээ нэвтэрч үзнэ үү.", badge: "blue" },
  { id: "weekend", eyebrow: "АМРАЛТЫН БОНУС", title: "WEEKEND BOOST", description: "Амралтын өдрийн нэмэлт боломж", image: weekendImage, action: "Дэлгэрэнгүй", detail: "Амралтын өдрүүдийн тусгай санал. Хүчинтэй хугацаа болон оролцох нөхцөлийг бүртгэлдээ нэвтэрч шалгана уу.", badge: "gold" },
];


function PromoCard({ promo, compact, onOpen }: { promo: Promotion; compact?: boolean; onOpen: (promo: Promotion) => void }) {
  return (
    <article className={`promo-card relative isolate overflow-hidden rounded-lg border border-primary-foreground/35 card-glow ${compact ? "h-[205px] sm:h-[195px]" : "h-[270px] sm:h-[285px]"}`}>
      <img src={promo.image} alt="" loading="lazy" width={944} height={704} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 promo-shade" />
      <div className="absolute inset-x-0 top-0 flex justify-start p-3">
        <span className={`promo-badge badge-${promo.badge} rounded-full px-3 py-1 text-[10px] font-extrabold text-primary-foreground shadow-sm sm:text-xs`}>{promo.eyebrow}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-3 text-center text-primary-foreground sm:px-4">
        <h3 className={`${compact ? "text-lg sm:text-xl" : "text-xl sm:text-[22px]"} font-display font-black leading-tight display-shadow`}>{promo.title}</h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium sm:text-xs">{promo.description}</p>
        <Button variant={compact ? "gold" : "casino"} size="sm" className="mt-2 h-8 w-full max-w-[220px] rounded-full text-xs" onClick={() => onOpen(promo)}>{promo.action}<ChevronRight aria-hidden="true" /></Button>
      </div>
    </article>
  );
}

function Index() {
  const [selected, setSelected] = useState<Promotion | null>(null);
  const [accountAction, setAccountAction] = useState<"Нэвтрэх" | "Бүртгүүлэх" | null>(null);

  const steps = [
    { icon: UserRoundPlus, title: "1. Бүртгүүлэх", copy: "DIAMOND-д бүртгүүлнэ" },
    { icon: Wallet, title: "2. Цэнэглэх", copy: "Дансаа цэнэглэнэ" },
    { icon: Gift, title: "3. Эвент сонгох", copy: "Хүссэн урамшуулалдаа оролцоно" },
    { icon: Gamepad2, title: "4. Тоглож шагнал авах", copy: "Азаа сорьж, илүү их хожоорой!" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="relative z-10 section-glass">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:py-2">
          <a href="#top" aria-label="DIAMOND нүүр" className="flex min-w-0 items-center gap-2 text-foreground">
            <Diamond className="size-7 shrink-0 fill-ice text-primary sm:size-8" strokeWidth={1.8} />
            <span className="truncate font-display text-2xl font-black leading-none sm:text-[29px]">DIAMOND</span>
          </a>
          <div className="hidden h-8 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary lg:flex">Welcome! Have a wonderful day at DIAMOND</div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="casino" size="sm" className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm" onClick={() => setAccountAction("Нэвтрэх")}><LockKeyhole aria-hidden="true" className="hidden min-[420px]:inline" /> Нэвтрэх</Button>
            <Button variant="casino" size="sm" className="rounded-full px-3.5 text-xs sm:px-5 sm:text-sm" onClick={() => setAccountAction("Бүртгүүлэх")}><UserRoundPlus aria-hidden="true" className="hidden min-[420px]:inline" /> Бүртгүүлэх</Button>
          </div>
        </div>
      </header>

      <main id="top">
        <section aria-labelledby="hero-title" className="relative isolate h-[335px] overflow-hidden bg-primary sm:h-[395px] lg:h-[380px]">
          <img src={heroImage} alt="DIAMOND урамшууллын зураглал" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 hero-mask" />
          <div className="relative mx-auto flex h-full max-w-[1320px] flex-col items-center justify-center px-4 pb-5 text-center sm:pb-0">
            <Crown className="mb-1 size-8 fill-gold text-gold drop-shadow-lg sm:size-11" aria-hidden="true" />
            <h1 id="hero-title" className="font-display text-[38px] font-black leading-[.9] text-primary-foreground display-shadow sm:text-[60px] lg:text-[78px]"><span className="block text-gold">DIAMOND</span><span className="block">PROMOTIONS</span></h1>
            <p className="mt-3 rounded-md border border-gold/70 bg-gold px-4 py-1 text-[10px] font-extrabold text-gold-foreground shadow-lg sm:text-sm">ТОГЛОНО • ОНОНО • ИЛҮҮ ИХ УРАМШУУЛАЛ АВААРАЙ</p>
            <div className="mt-4 grid grid-cols-4 gap-3 text-primary-foreground sm:gap-7">
              {[{ icon: UserRoundPlus, label: "ШИНЭ ТОГЛОГЧ" }, { icon: Gift, label: "ӨДӨР БҮР" }, { icon: Crown, label: "VIP УРАМШУУЛАЛ" }, { icon: Star, label: "ОНЦГОЙ ЭВЕНТ" }].map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col items-center gap-1"><span className="grid size-8 place-items-center rounded-full border border-gold/70 bg-deep-sea/75 sm:size-10"><Icon className="size-4 text-gold sm:size-5" aria-hidden="true" /></span><span className="text-[8px] font-extrabold sm:text-[10px]">{label}</span></div>)}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1320px] px-3 pb-10 pt-3 sm:px-6 sm:pt-4">
          <section id="promotions" aria-label="Урамшууллууд" className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {featuredPromos.map((promo) => <PromoCard key={promo.id} promo={promo} onOpen={setSelected} />)}
          </section>

          <section aria-labelledby="scratch-title" className="relative isolate mt-3 flex min-h-[215px] overflow-hidden rounded-lg border border-primary-foreground/35 card-glow sm:min-h-[185px] lg:min-h-[205px]">
            <img src={scratchBanner} alt="" loading="lazy" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-deep-sea/20" />
            <div className="relative mx-auto flex w-full max-w-[850px] flex-col items-center justify-center px-4 py-5 text-center text-primary-foreground lg:flex-row lg:justify-center lg:gap-12">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-extrabold uppercase text-gold sm:text-xs">АЗАА СОРЬЖ, НУУЦ ШАГНАЛАА НЭЭ</p>
                <h2 id="scratch-title" className="font-display text-4xl font-black leading-none display-shadow sm:text-5xl lg:text-6xl">SCRATCH <span className="text-gold">CARD</span></h2>
                <p className="mt-2 text-xs font-bold sm:text-sm">Картаа зурж, өөртөө зориулсан бэлгийг нээгээрэй!</p>
              </div>
              <Button variant="gold" className="mt-4 h-11 shrink-0 rounded-lg px-7 text-sm lg:mt-0" onClick={() => { const scratch = featuredPromos.find((promo) => promo.id === "scratch"); if (scratch) setSelected(scratch); }}>АЗАА СОРИХ <ArrowRight aria-hidden="true" /></Button>
            </div>
          </section>

          <section aria-label="Бусад урамшуулал" className="mt-3 grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
            {morePromos.map((promo) => <PromoCard key={promo.id} promo={promo} compact onOpen={setSelected} />)}
          </section>

          <section id="how-it-works" aria-labelledby="steps-title" className="section-glass mt-4 rounded-lg p-3 sm:p-4">
            <h2 id="steps-title" className="mb-3 text-center font-display text-lg font-black text-foreground sm:text-xl">Яаж оролцох вэ?</h2>
            <div className="grid grid-cols-2 gap-2 rounded-lg pale-surface p-2 shadow-sm lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, copy }) => <div key={title} className="flex min-w-0 items-center gap-2 border-border/65 px-1 py-2 sm:gap-3 sm:px-3 lg:border-r last:border-r-0"><span className="grid size-10 shrink-0 place-items-center rounded-full nav-surface text-primary-foreground sm:size-12"><Icon className="size-5 sm:size-6" aria-hidden="true" /></span><div className="min-w-0"><h3 className="text-xs font-extrabold leading-tight sm:text-sm">{title}</h3><p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-xs">{copy}</p></div></div>)}
            </div>
          </section>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.05fr_1fr]">
            <section aria-labelledby="terms-title" className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2"><CircleAlert className="size-5 shrink-0 fill-gold text-gold-foreground" aria-hidden="true" /><h2 id="terms-title" className="font-display text-base font-black sm:text-lg">Анхаарах зүйлс</h2></div>
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="eligibility"><AccordionTrigger className="py-2 text-xs sm:text-sm">Оролцох нөхцөл</AccordionTrigger><AccordionContent className="text-xs leading-relaxed text-muted-foreground">Урамшуулал бүрийн оролцох эрх, хугацаа болон шаардлага өөр байж болно. Зөвхөн насанд хүрсэн хэрэглэгч оролцоно.</AccordionContent></AccordionItem>
                <AccordionItem value="reward"><AccordionTrigger className="py-2 text-xs sm:text-sm">Шагнал ба урамшуулал</AccordionTrigger><AccordionContent className="text-xs leading-relaxed text-muted-foreground">Шагнал, бонусын хэмжээ болон ашиглах нөхцөл нь тухайн идэвхтэй саналын дүрмээс хамаарна. Урамшуулал бүрийн дэлгэрэнгүй мэдээллийг шалгана уу.</AccordionContent></AccordionItem>
                <AccordionItem value="play"><AccordionTrigger className="py-2 text-xs sm:text-sm">Хариуцлагатай тоглолт</AccordionTrigger><AccordionContent className="text-xs leading-relaxed text-muted-foreground">Боломжоо харгалзан хариуцлагатай тоглоорой. Тоглох нь санхүүгийн орлогын эх үүсвэр биш.</AccordionContent></AccordionItem>
              </Accordion>
            </section>
            <section id="support" aria-labelledby="support-title" className="relative isolate flex min-h-[215px] overflow-hidden rounded-lg nav-surface p-5 text-primary-foreground sm:p-6">
              <div className="absolute -right-5 -bottom-10 text-primary-foreground/10"><Diamond size={210} strokeWidth={1} aria-hidden="true" /></div>
              <div className="relative flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/15"><Headset className="size-7" aria-hidden="true" /></span><div><h2 id="support-title" className="font-display text-lg font-black">Тусламж</h2><p className="mt-2 max-w-[330px] text-xs leading-relaxed text-primary-foreground/90">Урамшуулал болон оролцох нөхцөлийн талаар асуулт байна уу?</p><Button variant="gold" size="sm" className="mt-4 rounded-full px-6" onClick={() => document.getElementById("terms-title")?.scrollIntoView({ behavior: "smooth" })}>Нөхцөлийг үзэх <ArrowRight aria-hidden="true" /></Button></div></div>
            </section>
          </div>
          <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground sm:flex-row"><span className="flex items-center gap-1 font-display font-black text-primary"><Diamond className="size-4" aria-hidden="true" /> DIAMOND</span><span>© 2026 DIAMOND. Хариуцлагатай тоглоорой. 18+</span><span className="flex items-center gap-1"><ShieldCheck className="size-4" aria-hidden="true" /> 18+ насны хэрэглэгчдэд</span></footer>
        </div>
      </main>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-md overflow-hidden rounded-lg border-border p-0">
          {selected && <><div className="relative h-44 overflow-hidden"><img src={selected.image} alt="" width={944} height={704} className="h-full w-full object-cover" /><div className="absolute inset-0 promo-shade" /><span className="absolute bottom-3 left-5 font-display text-2xl font-black text-primary-foreground display-shadow">{selected.title}</span></div><div className="p-5"><DialogHeader><DialogTitle className="text-left font-display text-xl">{selected.title}</DialogTitle><DialogDescription className="pt-2 text-left leading-relaxed">{selected.detail}</DialogDescription></DialogHeader><p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground"><BadgeHelp className="size-4 shrink-0 text-primary" aria-hidden="true" /> Тухайн урамшууллын хүчинтэй нөхцөлийг заавал шалгаарай.</p><Button variant="casino" className="mt-5 w-full rounded-full" onClick={() => { setSelected(null); setAccountAction("Бүртгүүлэх"); }}>Бүртгүүлэх <ChevronRight aria-hidden="true" /></Button></div></>}
        </DialogContent>
      </Dialog>

      <Dialog open={accountAction !== null} onOpenChange={(open) => { if (!open) setAccountAction(null); }}>
        <DialogContent className="max-w-sm rounded-lg p-6"><DialogHeader><div className="mb-2 flex justify-center"><Sparkles className="size-9 text-primary" aria-hidden="true" /></div><DialogTitle className="text-center font-display text-xl">{accountAction}</DialogTitle><DialogDescription className="pt-2 text-center leading-relaxed">Энэ нь DIAMOND урамшууллын танилцуулга хуудас юм. Бүртгэл болон нэвтрэх үйлчилгээ одоогоор холбогдоогүй байна.</DialogDescription></DialogHeader><Button variant="casino" className="mt-3 w-full rounded-full" onClick={() => setAccountAction(null)}>Ойлголоо</Button></DialogContent>
      </Dialog>
    </div>
  );
}