import { defineField, defineType } from "sanity"

export const menuSettings = defineType({
  name: "menuSettings",
  title: "Menu principale",
  type: "object",
  fields: [
    defineField({
      name: "headerTagline",
      title: "Tagline barra (desktop)",
      type: "localizedText",
    }),
    defineField({
      name: "payoff",
      title: "Payoff",
      type: "localizedText",
    }),
  ],
})
