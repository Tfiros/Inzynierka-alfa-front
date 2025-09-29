import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, RefreshCw, User as UserIcon, Bell, ArrowLeftRight } from "lucide-react";
import type { ReactNode } from "react";

export default function HomeDashboard() {
return (
   <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          icon={<Box className="h-8 w-8" aria-hidden />}
          title="Dodaj przedmioty"
          description="Dodaj przedmioty, które chcesz wymienić"
          ctaLabel="Dodaj przedmiot"
          to="/items/new"
        />
        <ActionCard
          icon={<RefreshCw className="h-8 w-8" aria-hidden />}
          title="Wymieniaj się"
          description="Znajdź idealne przedmioty do wymiany"
          ctaLabel="Zobacz przedmiot"
          to="/exchange"
        />
        <ActionCard
          icon={<UserIcon className="h-8 w-8" aria-hidden />}
          title="Twój profil"
          description="Zarządzaj swoimi przedmiotami i transakcjami"
          ctaLabel="Zobacz profil"
          to="/profile"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ActionCard
          icon={<Bell className="h-8 w-8" aria-hidden />}
          title="Powiadomienia"
          description="Śledź propozycje wymian i wiadomości"
          ctaLabel="Zobacz powiadomienia"
          to="/notifications"
        />
        <ActionCard
          icon={<ArrowLeftRight className="h-8 w-8" aria-hidden />}
          title="Propozycja wymiany"
          description="Zobacz szczegóły aktywnej propozycji"
          ctaLabel="Zobacz propozycję"
          to="/proposals/active"
        />
      </div>
    </>
);
}
function ActionCard({
    icon,
    title,
    description,
    ctaLabel,
    to,
    }: {
    icon: ReactNode;
    title: string;
    description: string;
    ctaLabel: string;
    to: string;
    }) {
return (
<Card className="rounded-2xl border-muted-foreground/20 shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
        <Button asChild className={`w-full bg-black text-white hover:bg-black/90`}>
        <Link to={to}>{ctaLabel}</Link>
        </Button>
    </CardContent>
</Card>
);
}