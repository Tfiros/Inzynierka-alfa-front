import { Shield, Star, Trophy, Zap } from 'lucide-react'
import { CardInfo } from '../component/CardInfo'

export const BlackCards = () => {
  return (
    <CardInfo
      title="Jak używać CT Coins?"
      icon={<Trophy className="h-5 w-5 text-sky-300" />}
      items={[
        {
          icon: <Zap className="h-4 w-4" />,
          text: 'Promuj oferty – 10 CT / 7 dni',
        },
        {
          icon: <Star className="h-4 w-4" />,
          text: 'Wyróżnij profil – 5 CT / 30 dni',
        },
        {
          icon: <Shield className="h-4 w-4" />,
          text: 'Premium – 20 CT / miesiąc',
        },
      ]}
    />
  )
}
