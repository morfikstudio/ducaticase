import { defineArrayMember, defineField } from "sanity"

import { apiVersion } from "../../../env"
import { MAX_FLOOR_PLAN_FILE_BYTES } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type FloorPlansFieldOptions = {
  required?: boolean
  group?: string
}

const maxMb = MAX_FLOOR_PLAN_FILE_BYTES / (1024 * 1024)

export function floorPlansField(options?: FloorPlansFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "floorPlans",
    title: "Planimetria",
    description: `Carica un solo file in PDF, JPG o PNG (massimo ${maxMb} MB)`,
    type: "array",
    of: [
      defineArrayMember({
        type: "file",
        options: {
          accept: "application/pdf,image/jpeg,image/png",
        },
      }),
    ],
    validation: (Rule) => [
      Rule.max(1).error("È consentito un solo file di planimetria."),
      Rule.custom(async (value, context) => {
        const items = Array.isArray(value) ? value : []

        if (required) {
          const hasAsset = items.some(
            (item) => !!(item as { asset?: { _ref?: string } })?.asset?._ref,
          )
          if (items.length === 0 || !hasAsset) {
            return FIELD_REQUIRED_IT
          }
        } else if (items.length === 0) {
          return true
        }

        const client = context.getClient({ apiVersion })

        for (const item of items) {
          const ref = (item as { asset?: { _ref?: string } })?.asset?._ref
          if (!ref) {
            continue
          }
          const size = await client.fetch<number | null>(
            `*[_id == $id][0].size`,
            { id: ref },
          )
          if (typeof size === "number" && size > MAX_FLOOR_PLAN_FILE_BYTES) {
            return `Il file (PDF, JPG, PNG) non può superare ${maxMb} MB. Riduci le dimensioni del file.`
          }
        }

        return true
      }),
    ],
  })
}
