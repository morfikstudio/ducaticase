type EnergyClass = {
  energyClassScheme?: string | null
  energyClassRatingDl192?: string | null
  energyClassRatingLaw90?: string | null
} | null

const SEGMENTS = ["A", "B", "C", "D", "E", "F", "G"] as const

const COLORS: Record<(typeof SEGMENTS)[number], string> = {
  A: "#31561E",
  B: "#42A236",
  C: "#FAF447",
  D: "#F6B939",
  E: "#EFA133",
  F: "#EB802C",
  G: "#CC2D1D",
}

function activeIndex(ec: NonNullable<EnergyClass>): number | null {
  const scheme = ec.energyClassScheme
  if (scheme === "notClassifiable" || scheme === "inProgress") return null
  const rating =
    scheme === "dl192_2005"
      ? ec.energyClassRatingDl192
      : ec.energyClassRatingLaw90
  if (!rating) return null
  if (rating.startsWith("A")) return 0
  const idx = SEGMENTS.indexOf(rating as (typeof SEGMENTS)[number])
  return idx >= 0 ? idx : null
}

export function EnergyBar({ energyClass }: { energyClass: EnergyClass }) {
  const indeterminate =
    !energyClass ||
    energyClass.energyClassScheme === "notClassifiable" ||
    energyClass.energyClassScheme === "inProgress"
  const active = energyClass && !indeterminate ? activeIndex(energyClass) : null

  return (
    <div className="energy-bar">
      {SEGMENTS.map((letter, i) => {
        const isActive = active === i
        const style: React.CSSProperties = {
          backgroundColor: COLORS[letter],
          height: "4mm",
          opacity: indeterminate ? 0.4 : isActive ? 1 : 0.4,
          flex: isActive ? 1 : "0 0 12mm",
        }
        return <div key={letter} style={style} />
      })}
    </div>
  )
}
