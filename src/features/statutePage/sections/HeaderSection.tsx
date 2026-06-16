const updatedAt = "2026-06-8"

const HeaderSection = () => {
  return (
    <section>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Regulamin serwisu <span className="text-primary">CrossTrade</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ostatnia aktualizacja: <time dateTime={updatedAt}>{updatedAt}</time>
        </p>
      </header>
    </section>
  )
}

export default HeaderSection
