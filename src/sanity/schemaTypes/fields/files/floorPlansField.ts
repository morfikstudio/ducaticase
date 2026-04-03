import { defineArrayMember, defineField } from "sanity"

import { apiVersion } from "../../../env"
import { MAX_FLOOR_PLAN_PDF_BYTES } from "../../../lib/constants"
import { FIELD_REQUIRED_IT } from "../../../lib/validationMessages"

export type FloorPlansFieldOptions = {
  required?: boolean
  group?: string
}

const maxMb = MAX_FLOOR_PLAN_PDF_BYTES / (1024 * 1024)

export function floorPlansField(options?: FloorPlansFieldOptions) {
  const required = options?.required ?? false

  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "floorPlans",
    title: "Planimetrie",
    description: `Carica una o più planimetrie in PDF (massimo ${maxMb} MB per file)`,
    type: "array",
    of: [
      defineArrayMember({
        type: "file",
        options: {
          accept: "application/pdf",
        },
      }),
    ],
    validation: (Rule) =>
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
          if (typeof size === "number" && size > MAX_FLOOR_PLAN_PDF_BYTES) {
            return `Ogni PDF non può superare ${maxMb} MB. Riduci il file o dividi le planimetrie.`
          }
        }

        return true
      }),
  })
}
