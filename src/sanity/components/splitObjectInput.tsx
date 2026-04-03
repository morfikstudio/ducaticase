"use client"

import { type ComponentType } from "react"

import { Grid, Stack } from "@sanity/ui"
import { MemberField, type ObjectInputProps } from "sanity"

/** Due colonne ~⅔ / ~⅓ (es. nome via + civico). */
export const SPLIT_GRID_TWO_ONE = "minmax(0, 2fr) minmax(0, 1fr)"

/** Prima colonna più larga, seconda ~¼ (es. importo + valuta compatta). */
export const SPLIT_GRID_THREE_ONE = "minmax(0, 3fr) minmax(0, 1fr)"

export function createSplitObjectInput(
  gridTemplateColumns: string = SPLIT_GRID_TWO_ONE,
): ComponentType<ObjectInputProps> {
  const gridStyle = {
    gridTemplateColumns,
    alignItems: "end" as const,
  }

  function SplitObjectInput(props: ObjectInputProps) {
    const {
      members,
      groups,
      renderAnnotation,
      renderBlock,
      renderField,
      renderInlineBlock,
      renderInput,
      renderItem,
      renderPreview,
      renderDefault,
    } = props

    if (groups.length > 0) {
      return renderDefault(props)
    }

    const fieldMembers = members.filter((m) => m.kind === "field")
    const hasNonFieldMembers = members.some((m) => m.kind !== "field")

    if (hasNonFieldMembers || fieldMembers.length !== 2) {
      return renderDefault(props)
    }

    return (
      <Stack space={6}>
        <Grid gap={4} marginTop={1} style={gridStyle}>
          {fieldMembers.map((member) => (
            <MemberField
              key={member.key}
              member={member}
              renderAnnotation={renderAnnotation}
              renderBlock={renderBlock}
              renderField={renderField}
              renderInlineBlock={renderInlineBlock}
              renderInput={renderInput}
              renderItem={renderItem}
              renderPreview={renderPreview}
            />
          ))}
        </Grid>
      </Stack>
    )
  }

  SplitObjectInput.displayName = "SplitObjectInput"

  return SplitObjectInput
}

/** Layout 2:1 (stesso schema dell’indirizzo). */
export const AddressObjectInput = createSplitObjectInput(SPLIT_GRID_TWO_ONE)

/** Importo largo, valuta ~¼ larghezza. */
export const CondoFeesObjectInput = createSplitObjectInput(SPLIT_GRID_THREE_ONE)
