import Kpi from "../components/Kpi"

const KPIsSection = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="mt-12 rounded-xl border bg-card text-card-foreground">
        <div className="grid grid-cols-2 divide-x md:grid-cols-4">
          <Kpi label="Aktywnych użytkowników" value="10k+" />
          <Kpi label="Itemków wymienionych" value="50k+" />
          <Kpi label="Zadowolonych użytkowników" value="98%" />
          <Kpi label="Wsparcie techniczne" value="24/7" hideBorderOnSmall />
        </div>
      </div>
    </section>
  )
}

export default KPIsSection
