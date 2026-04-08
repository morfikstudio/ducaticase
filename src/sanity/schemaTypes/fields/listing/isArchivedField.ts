import { defineField } from "sanity"

export type IsArchivedFieldOptions = {
  group?: string
}

export function isArchivedField(options?: IsArchivedFieldOptions) {
  return defineField({
    ...(options?.group ? { group: options.group } : {}),
    name: "isArchived",
    title: "Archiviato",
    description: "Se attivo, l'annuncio non viene mostrato all'utente.",
    type: "boolean",
    initialValue: false,
  })
}
