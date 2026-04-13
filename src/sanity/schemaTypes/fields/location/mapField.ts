import { defineField } from "sanity"

import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type MapFieldOptions = {
  required?: boolean
  group?: string
}

type GeoPointValue =
  | {
      lat?: number
      lng?: number
    }
  | undefined
  | null

export function mapField(options?: MapFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "map",
    title: "Mappa",
    description: "Seleziona la posizione su Google Maps",
    type: "geopoint",
    validation: (Rule) =>
      Rule.custom((value: GeoPointValue) => {
        if (!required) {
          return true
        }

        if (
          value == null ||
          typeof value.lat !== "number" ||
          typeof value.lng !== "number"
        ) {
          return FIELD_REQUIRED_IT
        }

        return true
      }),
  })
}
