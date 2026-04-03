"use client"

import { Grid, Stack } from "@sanity/ui"
import { MemberField, type ObjectInputProps } from "sanity"

import { SPLIT_GRID_THREE_ONE } from "./splitObjectInput"

const gridStyle = {
  gridTemplateColumns: SPLIT_GRID_THREE_ONE,
  alignItems: "end" as const,
}

type FieldMember = Extract<
  ObjectInputProps["members"][number],
  { kind: "field" }
>

function visibleEnergyClassMembers(
  value: Record<string, unknown> | null | undefined,
  fieldMembers: FieldMember[],
): FieldMember[] {
  const scheme = value?.energyClassScheme
  const visible = new Set<string>(["energyClassScheme"])
  if (scheme === "dl192_2005") {
    visible.add("energyClassRatingDl192")
  }
  if (scheme === "law90_2013") {
    visible.add("energyClassRatingLaw90")
  }
  return fieldMembers
    .filter((m) => visible.has(m.name))
    .sort((a, b) => a.index - b.index)
}

/**
 * Stesso pattern di {@link splitObjectInput}: griglia con seconda colonna più stretta.
 * Filtra i campi in base allo schema (i rating condizionali non sono tra i member visibili in UI).
 */
export function EnergyClassObjectInput(props: ObjectInputProps) {
  const {
    members,
    value,
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

  const hasNonFieldMembers = members.some((m) => m.kind !== "field")
  if (hasNonFieldMembers) {
    return renderDefault(props)
  }

  const fieldMembers = members.filter(
    (m): m is FieldMember => m.kind === "field",
  )

  const visible = visibleEnergyClassMembers(
    value as Record<string, unknown> | undefined,
    fieldMembers,
  )

  if (visible.length !== 2) {
    return renderDefault(props)
  }

  return (
    <Stack space={6}>
      <Grid gap={4} marginTop={1} style={gridStyle}>
        {visible.map((member) => (
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
