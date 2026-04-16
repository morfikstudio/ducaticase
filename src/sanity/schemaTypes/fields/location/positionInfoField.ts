import { defineField } from "sanity"

export type PositionInfoFieldOptions = {
  group?: string
}

export function positionInfoField(options?: PositionInfoFieldOptions) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "positionInfo",
    title: "Posizione",
    description:
      "Testo facoltativo visibile nella scheda immobile sopra mappa e indirizzo.",
    type: "localizedText",
  })
}
