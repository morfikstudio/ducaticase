import type { Metadata } from "next"

import type { AppLocale } from "@/i18n/routing"
import { cn } from "@/utils/classNames"
import { Container } from "@/components/ui/Container"

import {
  privacyPolicyContent,
  type LegalBlock,
  type LegalListItem,
} from "./content"

const META: Record<AppLocale, { title: string; description: string }> = {
  it: {
    title: "Informativa sulla Privacy",
    description:
      "Informativa sulla privacy e sulla protezione dei dati personali di Ducati Case ai sensi degli artt. 13 e 14 del Regolamento UE 679/2016.",
  },
  en: {
    title: "Privacy Policy",
    description:
      "Ducati Case privacy and personal data protection policy pursuant to articles 13 and 14 of EU Regulation 679/2016.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale
  const meta = META[locale] ?? META.it

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}/privacy-policy`,
      languages: {
        it: "/it/privacy-policy",
        en: "/en/privacy-policy",
      },
    },
  }
}

function renderListItem(item: LegalListItem, key: number) {
  if (typeof item === "string") {
    return <li key={key}>{item}</li>
  }

  return (
    <li key={key}>
      {item.text}
      <ul className="mt-1 flex list-none flex-col gap-1 ps-4">
        {item.items.map((sub, subIndex) => (
          <li key={subIndex}>{sub}</li>
        ))}
      </ul>
    </li>
  )
}

function renderBlock(block: LegalBlock, key: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={key}
          className="type-body-1 md:type-heading-2 mt-10 text-white md:mt-14"
        >
          {block.text}
        </h2>
      )
    case "h3":
      return (
        <h3 key={key} className="type-body-1 mt-6 text-white">
          {block.text}
        </h3>
      )
    case "p":
      return (
        <p key={key} className="type-body-3 md:type-body-2 text-gray">
          {block.text}
        </p>
      )
    case "ul":
      return (
        <ul
          key={key}
          className="type-body-3 md:type-body-2 text-gray flex list-disc flex-col gap-1 ps-6"
        >
          {block.items.map(renderListItem)}
        </ul>
      )
    case "address":
      return (
        <address
          key={key}
          className="type-body-3 md:type-body-2 text-gray flex flex-col not-italic"
        >
          {block.lines.map((line, lineIndex) => (
            <span key={lineIndex}>{line}</span>
          ))}
        </address>
      )
    default:
      return null
  }
}

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam as AppLocale
  const doc = privacyPolicyContent[locale] ?? privacyPolicyContent.it

  return (
    <main
      className={cn(
        "w-full",
        "overflow-x-clip",
        "pt-32 pb-24 md:pt-54 md:pb-40",
      )}
    >
      <Container>
        <div className="flex max-w-3xl flex-col gap-6 md:gap-8">
          <h1 className="type-heading-2 md:type-heading-1 text-balance text-white">
            {doc.title}
          </h1>

          {doc.blocks.map(renderBlock)}
        </div>
      </Container>
    </main>
  )
}
