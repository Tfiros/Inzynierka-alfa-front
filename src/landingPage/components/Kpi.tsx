export type KpiProps = {
    value: string;
    label: string;
    hideBorderOnSmall?: boolean;
};

export const Kpi = ({ value, label, hideBorderOnSmall }: KpiProps) => {
  return (
    <div
     className={`flex flex-col items-center justify-center gap-1 px-4 py-6 ${hideBorderOnSmall ? '' : 'border-0 md:border-0'}`}
    >
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-center text-xs text-muted-foreground">{label}</div>
    </div>
  );
};