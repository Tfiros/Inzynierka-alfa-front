import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export type StepProps = {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const Step = ({ title, description, icon }: StepProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
