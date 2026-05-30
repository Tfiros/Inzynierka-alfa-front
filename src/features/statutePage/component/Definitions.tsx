type DefinitionsProps = {
  items: [string, string][]
}

const Definitions = ({ items }: DefinitionsProps) => {
  return (
    <dl className="space-y-3">
      {items.map(([term, def]) => (
        <div
          key={term}
          className="grid grid-cols-[140px_1fr] gap-3 max-sm:grid-cols-1"
        >
          <dt className="font-medium">{term}</dt>
          <dd className="text-muted-foreground">{def}</dd>
        </div>
      ))}
    </dl>
  )
}

export default Definitions
