import { Box, RefreshCw } from "lucide-react";
import PointsIcon from "@/photos/PointsIcon.svg";
import { ActionCard } from "../ActionCard";

export const HomeDashboardPublic = () => {
  return (
    <>
      <div className="mx-auto mb-10 max-w-5xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-4xl [text-wrap:balance]">
        Czysta wymiana – twoje <br /> przedmioty, twój zysk
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <ActionCard
          icon={<Box className="h-6 w-6" aria-hidden />}
          title="Dodaj przedmioty"
          description="Dodaj przedmioty, które chcesz wymienić"
          ctaLabel="Dodaj przedmiot"
          to="/items/new"
        />
        <ActionCard
          icon={<RefreshCw className="h-6 w-6" aria-hidden />}
          title="Wymieniaj się"
          description="Znajdź idealne przedmioty do wymiany"
          ctaLabel="Zobacz przedmiot"
          to="/exchange"
        />
        
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-1">
        <ActionCard
          className="border border-white/10 bg-black text-white shadow-md"
          iconBg="bg-transparent"
          icon={<img src={PointsIcon} alt="" className="h-8 w-8" aria-hidden />}
          title="CT Coins – Waluta Premium"
          description="Kup CT Coins aby promować oferty, uzyskać dostęp premium i więcej"
          ctaLabel="Kup CT Coins"
          to="/points"
          buttonClass="bg-transparent text-white border border-white/30 hover:bg-white/10"
        />
      </div>
    </>
  );
};
