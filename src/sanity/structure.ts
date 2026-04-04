import { DesktopIcon, HomeIcon } from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import { LISTING_DOCUMENT_SPECS } from "./schemaTypes/listingTypes"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenuto")
    .items([
      S.documentTypeListItem("siteContent")
        .title("Contenuti Sito")
        .icon(DesktopIcon)
        .id("siteContent"),
      S.divider(),
      S.listItem()
        .title("Annunci immobiliari")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Annunci immobiliari")
            .items(
              LISTING_DOCUMENT_SPECS.map((spec) =>
                S.listItem()
                  .title(spec.title)
                  .icon(spec.icon)
                  .id(spec.name)
                  .schemaType(spec.name)
                  .child(
                    S.documentTypeList(spec.name)
                      .title(spec.title)
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" },
                      ]),
                  ),
              ),
            ),
        ),
    ])
