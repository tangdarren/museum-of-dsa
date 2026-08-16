import type { ExhibitWingId, Vec3 } from '../navigation/destinations'

export type Exhibit = {
  id: string
  title: string
  category: string
  description: string
  position: Vec3
  wing: ExhibitWingId
}
