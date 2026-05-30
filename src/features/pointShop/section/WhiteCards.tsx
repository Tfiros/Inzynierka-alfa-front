import { Check, Star } from "lucide-react"
import CardInfo from "../component/CardInfo"

const WhiteCards = () => {
  return (
    <CardInfo
      title="Korzyści Premium"
      subtitle="Co otrzymujesz z CT Coins"
      icon={<Star className="h-5 w-5 text-amber-400" />}
      items={[
        {
          icon: <Check className="h-4 w-4" />,
          text: "Priorytetowe wyświetlanie ofert",
        },
        {
          icon: <Check className="h-4 w-4" />,
          text: "Większa ilość ofert",
        },
        {
          icon: <Check className="h-4 w-4" />,
          text: "Brak limitów czasowych",
        },
        {
          icon: <Check className="h-4 w-4" />,
          text: "Wsparcie premium 24/7",
        },
      ]}
    />
  )
}

export default WhiteCards
