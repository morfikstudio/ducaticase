import type { AppLocale } from "@/i18n/routing"
import type { LISTING_BY_ID_QUERY_RESULT } from "@/sanity/types"
import { getPrintImageUrl } from "@/lib/brochure/printImage"
import {
  pickLocalizedPortableTextPlain,
  pickLocalizedString,
} from "@/sanity/lib/locale"
import { parseListingLocationCountryCode } from "@/sanity/lib/constants"
import { buildListingLocationText } from "@/lib/buildListingLocationText"
import { formatListingPrice } from "@/lib/formatListingPrice"
import { Icon } from "@/components/ui/Icon"

import { BrochureStyles } from "./BrochureStyles"
import { EnergyBar } from "./EnergyBar"

export type FormattedSpecRow = { label: string; value: string }

type Listing = NonNullable<LISTING_BY_ID_QUERY_RESULT>

type Messages = {
  tagline: string
  features: string
  highlights: string
  energyEfficiency: string
  energyNotClassifiable: string
  energyInProgress: string
  position: string
  squareMeters: string
  rentPriceLabel: string
  followUsPrefix: string
  followUsSuffix: string
  energyDisclaimer: string
  countries: Record<string, string>
}

type BrochureProps = {
  listing: Listing
  locale: AppLocale
  messages: Messages
  specRows: FormattedSpecRow[]
  highlights: string[]
}

export function Brochure({
  listing,
  locale,
  messages,
  specRows,
  highlights,
}: BrochureProps) {
  const { content, location, propertySheet, metadata } = listing

  const title = pickLocalizedString(content?.title, locale) ?? ""
  const countryCode = parseListingLocationCountryCode(location?.country)
  const countryLabel = countryCode
    ? (messages.countries[countryCode] ?? null)
    : null
  const locationText = buildListingLocationText(location, countryLabel)

  const price = formatListingPrice(
    propertySheet?.price,
    locale,
    metadata.listingContractType as "sale" | "rent" | null,
  )
  const sqm = propertySheet?.commercialAreaSqm

  // Print-sized image URLs (no Retina dpr, lower quality, dimensions matched
  // to the physical A4 placement at ~200 DPI to keep the PDF light).
  const heroUrl = getPrintImageUrl(content?.mainImage, 1400, 750, 75)
  // Fixed gallery layout: 2 cols x 3 rows = up to 6 images on a single page,
  // each rendered at ~80mm square -> ~700px is plenty.
  const galleryUrls = (content?.gallery ?? [])
    .slice(0, 6)
    .map((img) => getPrintImageUrl(img, 700, 700, 75))
    .filter((u): u is string => Boolean(u))
  const excerptPlain = pickLocalizedPortableTextPlain(
    content?.excerpt,
    locale,
  )
  const descriptionPlain = pickLocalizedPortableTextPlain(
    content?.description,
    locale,
  )
  const positionPlain = location?.positionInfo
    ? location.positionInfo[locale] || location.positionInfo.it || ""
    : ""

  const half = Math.ceil(specRows.length / 2)
  const specLeft = specRows.slice(0, half)
  const specRight = specRows.slice(half)

  const energyClass =
    propertySheet && "energyClass" in propertySheet
      ? propertySheet.energyClass
      : null

  const energyHeading = (() => {
    if (!energyClass?.energyClassScheme) return null
    if (energyClass.energyClassScheme === "notClassifiable")
      return `${messages.energyEfficiency}: ${messages.energyNotClassifiable}`
    if (energyClass.energyClassScheme === "inProgress")
      return `${messages.energyEfficiency}: ${messages.energyInProgress}`
    const rating =
      energyClass.energyClassScheme === "dl192_2005"
        ? energyClass.energyClassRatingDl192
        : energyClass.energyClassRatingLaw90
    return rating
      ? `${messages.energyEfficiency}: ${rating}`
      : messages.energyEfficiency
  })()

  return (
    <article className="brochure">
      <BrochureStyles />

      {/* PAGE 1 — COVER (table layout to repeat header on overflow pages) */}
      <section className="page page-cover">
        <table className="cover-table">
          <thead>
            <tr>
              <th>
                <BrochureHeader rightText={messages.tagline} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="cover-body">
                  {heroUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroUrl} alt="" className="cover-hero" />
                  ) : null}
                  <div className="title-row">
                    <h1 className="cover-title">{title}</h1>
                    {price ? <p className="cover-price">{price}</p> : null}
                  </div>
                  {locationText ? (
                    <p className="cover-location">{locationText}</p>
                  ) : null}
                  {sqm ? (
                    <p className="cover-sqm">
                      {sqm} {messages.squareMeters}
                    </p>
                  ) : null}
                  {excerptPlain ? (
                    <div className="cover-excerpt">
                      {excerptPlain.split(/\n\s*\n/).map((para, i) => (
                        <p key={i}>
                          {para.split("\n").map((line, j, arr) => (
                            <span key={j}>
                              {line}
                              {j < arr.length - 1 ? <br /> : null}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {descriptionPlain ? (
                    <div className="cover-description">
                      {descriptionPlain.split(/\n\s*\n/).map((para, i) => (
                        <p key={i}>
                          {para.split("\n").map((line, j, arr) => (
                            <span key={j}>
                              {line}
                              {j < arr.length - 1 ? <br /> : null}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* PAGE 2 — SPECS + ENERGY */}
      <section className="page">
        <BrochureHeader rightText={title} />
        <div className="specs-body">
          <h2 className="section-title">{messages.features}</h2>

          {highlights.length > 0 ? (
            <div className="highlights-row">
              <span className="highlights-label">{messages.highlights}</span>
              <div className="highlights-chips">
                {highlights.map((h, i) => (
                  <span key={i} className="chip">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="specs-grid">
            <div className="spec-col">
              {specLeft.map((row, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{row.label}</span>
                  <span className="spec-value">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="spec-col">
              {specRight.map((row, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{row.label}</span>
                  <span className="spec-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {energyHeading ? (
            <div className="energy-block">
              <h2 className="section-title">{energyHeading}</h2>
              <EnergyBar energyClass={energyClass} />
            </div>
          ) : null}

          {positionPlain ? (
            <div className="position-block">
              <p className="position-label">{messages.position}</p>
              <p className="position-text">{positionPlain}</p>
            </div>
          ) : null}

          <p className="energy-disclaimer">{messages.energyDisclaimer}</p>
        </div>
      </section>

      {/* GALLERY — single page, fixed 2x3 grid, max 6 images */}
      {galleryUrls.length > 0 ? (
        <section className="page">
          <BrochureHeader rightText={title} />
          <div className="gallery-body">
            <div className="gallery-grid">
              {galleryUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" className="gallery-item" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Floor plans are inserted here in the API route (before the back cover) */}

      {/* LAST PAGE — BACK COVER (contacts) */}
      <section className="page back-cover">
        <div className="back-cover-inner">
          <img
            src="/images/Logo-Ducati.svg"
            alt="Ducati Case"
            className="back-logo"
          />
          <div className="back-contacts">
            <p>V.le Vittorio Veneto, 24 - Milano - 20124</p>
            <p>info@ducaticase.it</p>
            <p>+39 02 6598702</p>
            <p>P. IVA 09854640159</p>
            <p className="back-follow">
              {messages.followUsPrefix}
              <strong>@DucatiCase</strong>
              {messages.followUsSuffix}
              <span className="back-socials" aria-label="Social">
                <a
                  href="https://www.instagram.com/ducaticase"
                  aria-label="Instagram"
                >
                  <Icon type="instagram" size="s" />
                </a>
                <a
                  href="https://it.linkedin.com/company/ducati-case-srl"
                  aria-label="LinkedIn"
                >
                  <Icon type="linkedin" size="s" />
                </a>
                <a
                  href="https://www.facebook.com/ducaticase"
                  aria-label="Facebook"
                >
                  <Icon type="facebook" size="s" />
                </a>
              </span>
            </p>
          </div>
          <p className="back-website">www.ducaticase.it</p>
        </div>
      </section>
    </article>
  )
}

function BrochureHeader({ rightText }: { rightText: string }) {
  return (
    <header className="page-header">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/Logo-Ducati.svg" alt="Ducati Case" className="logo" />
      <p className="header-right">{rightText}</p>
    </header>
  )
}
