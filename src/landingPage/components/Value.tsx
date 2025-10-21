import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type ValueProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export const Value = ({ icon, title, desc }: ValueProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
};
