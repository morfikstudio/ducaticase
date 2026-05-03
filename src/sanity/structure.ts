import {
  AddDocumentIcon,
  ArchiveIcon,
  CaseIcon,
  EnvelopeIcon,
  HomeIcon,
  LaunchIcon,
  LinkIcon,
  MenuIcon,
  SearchIcon,
  UsersIcon,
} from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import { LISTING_DOCUMENT_SPECS } from "./schemaTypes/listingTypes"

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ducati Case")
    .items([
      S.listItem()
        .title("Contenuti Sito")
        .icon(LaunchIcon)
        .id("siteContentRoot")
        .child(
          S.list()
            .title("Contenuti Sito")
            .items([
              S.listItem()
                .title("Menu")
                .icon(MenuIcon)
                .id("siteContentMenu")
                .child(
                  S.documentList()
                    .title("Menu")
                    .schemaType("siteContent")
                    .filter('_type == "siteContent" && sectionType == "menu"')
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Footer")
                .icon(LinkIcon)
                .id("siteContentFooter")
                .child(
                  S.documentList()
                    .title("Footer")
                    .schemaType("siteContent")
                    .filter('_type == "siteContent" && sectionType == "footer"')
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Home")
                .icon(HomeIcon)
                .id("siteContentHomePage")
                .child(
                  S.documentList()
                    .title("Home")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "homePage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem("siteContent-homePage"),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Affidaci il tuo immobile")
                .icon(AddDocumentIcon)
                .id("siteContentListYourPropertyPage")
                .child(
                  S.documentList()
                    .title("Affidaci il tuo immobile")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "listYourPropertyPage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem(
                        "siteContent-listYourPropertyPage",
                      ),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Ricerca su misura")
                .icon(SearchIcon)
                .id("siteContentTailoredSearchPage")
                .child(
                  S.documentList()
                    .title("Ricerca su misura")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "tailoredSearchPage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem(
                        "siteContent-tailoredSearchPage",
                      ),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Ducati per le aziende")
                .icon(CaseIcon)
                .id("siteContentBusinessPage")
                .child(
                  S.documentList()
                    .title("Ducati per le aziende")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "businessPage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem("siteContent-businessPage"),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Chi siamo")
                .icon(UsersIcon)
                .id("siteContentAboutPage")
                .child(
                  S.documentList()
                    .title("Chi siamo")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "aboutPage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem("siteContent-aboutPage"),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Contatti")
                .icon(EnvelopeIcon)
                .id("siteContentContactPage")
                .child(
                  S.documentList()
                    .title("Contatti")
                    .schemaType("siteContent")
                    .filter(
                      '_type == "siteContent" && sectionType == "contactPage"',
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem("siteContent-contactPage"),
                    ])
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ]),
                ),
            ]),
        ),
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
                    S.documentList()
                      .title(spec.title)
                      .schemaType(spec.name)
                      .filter(
                        "_type == $schemaType && coalesce(isArchived, false) != true",
                      )
                      .params({ schemaType: spec.name })
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" },
                      ]),
                  ),
              ),
            ),
        ),
      S.listItem()
        .title("Archivio annunci")
        .icon(ArchiveIcon)
        .child(
          S.documentList()
            .title("Archivio annunci")
            .filter(
              "_type in $listingTypes && coalesce(isArchived, false) == true",
            )
            .params({
              listingTypes: LISTING_DOCUMENT_SPECS.map((spec) => spec.name),
            })
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
    ])
