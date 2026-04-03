"use client"

import { Grid, Stack } from "@sanity/ui"
import { MemberField, type ObjectInputProps } from "sanity"

export type SelectWithOtherSchemaOptions = {
  choiceField: string
  otherField: string
  otherValue: string
}

type FieldMember = Extract<
  ObjectInputProps["members"][number],
  { kind: "field" }
>

function getSelectWithOtherOptions(
  schemaType: ObjectInputProps["schemaType"],
): SelectWithOtherSchemaOptions | undefined {
  const raw = schemaType.options as
    | { selectWithOther?: SelectWithOtherSchemaOptions }
    | undefined
  return raw?.selectWithOther
}

/**
 * Oggetto con select + campo testo affiancato solo quando la scelta è `otherValue`.
 */
export function SelectWithOtherObjectInput(props: ObjectInputProps) {
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

  const cfg = getSelectWithOtherOptions(props.schemaType)

  if (groups.length > 0 || !cfg) {
    return renderDefault(props)
  }

  const hasNonFieldMembers = members.some((m) => m.kind !== "field")
  if (hasNonFieldMembers) {
    return renderDefault(props)
  }

  const fieldMembers = members.filter(
    (m): m is FieldMember => m.kind === "field",
  )
  const choiceMember = fieldMembers.find((m) => m.name === cfg.choiceField)
  const otherMember = fieldMembers.find((m) => m.name === cfg.otherField)

  if (!choiceMember || !otherMember) {
    return renderDefault(props)
  }

  const doc = value as Record<string, unknown> | undefined
  const choice = doc?.[cfg.choiceField]
  const showOther = choice === cfg.otherValue

  const gridStyle = {
    gridTemplateColumns: showOther
      ? "minmax(0, 1fr) minmax(0, 1fr)"
      : "minmax(0, 1fr)",
    alignItems: "end" as const,
  }

  return (
    <Stack space={6}>
      <Grid gap={4} marginTop={1} style={gridStyle}>
        <MemberField
          key={choiceMember.key}
          member={choiceMember}
          renderAnnotation={renderAnnotation}
          renderBlock={renderBlock}
          renderField={renderField}
          renderInlineBlock={renderInlineBlock}
          renderInput={renderInput}
          renderItem={renderItem}
          renderPreview={renderPreview}
        />
        {showOther ? (
          <MemberField
            key={otherMember.key}
            member={otherMember}
            renderAnnotation={renderAnnotation}
            renderBlock={renderBlock}
            renderField={renderField}
            renderInlineBlock={renderInlineBlock}
            renderInput={renderInput}
            renderItem={renderItem}
            renderPreview={renderPreview}
          />
        ) : null}
      </Grid>
    </Stack>
  )
}
