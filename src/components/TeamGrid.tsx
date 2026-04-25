"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import type { AppLocale } from "@/i18n/routing"
import { pickLocalizedString } from "@/sanity/lib/locale"
import type { LocalizedString, LocalizedText } from "@/sanity/types"

import { useGsapReveal } from "@/hooks/useGsapReveal"

import { cn } from "@/utils/classNames"

import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { SanityImage } from "@/components/ui/SanityImage"

type TeamMemberItem = {
  _key?: string
  title?: LocalizedText | null
  text?: LocalizedText | null
  image?: SanityImageSource | null
  roles?: Array<LocalizedString | null> | null
}

type TeamGridProps = {
  title?: string
  subtitle?: string
  text?: string
  ctaLabel?: string
  ctaHref?: string
  locale: AppLocale
  members: TeamMemberItem[]
}

type MemberCardProps = {
  member: TeamMemberItem
  locale: AppLocale
}

function getMemberContent(member: TeamMemberItem, locale: AppLocale) {
  const title = pickLocalizedString(member.title ?? undefined, locale) ?? ""
  const description =
    pickLocalizedString(member.text ?? undefined, locale) ?? ""
  const roleItems = (member.roles ?? [])
    .map(
      (role: LocalizedString | null) =>
        pickLocalizedString(role ?? undefined, locale)?.trim() ?? "",
    )
    .filter((role: string) => role !== "")

  return {
    title,
    description,
    roles: roleItems.slice(0, -1).join(" | "),
    lastRole: roleItems.slice(-1)[0] ?? "",
  }
}

export function TeamGrid({
  title,
  subtitle,
  text,
  ctaLabel,
  ctaHref,
  locale,
  members,
}: TeamGridProps) {
  const { ref: wrapRef } = useGsapReveal()

  return (
    <div
      className={cn(
        "w-full",
        "bg-light-gray text-accent",
        "py-24 md:py-[192px]",
      )}
    >
      <div ref={wrapRef} style={{ opacity: 0 }}>
        <Container>
          {/* HEADER */}
          <div
            className={cn(
              "flex flex-col gap-8 items-center",
              "text-center",
              "md:max-w-[700px] mx-auto",
            )}
          >
            {title && (
              <div
                className={cn(
                  "type-heading-3 md:type-body-2 md:font-medium",
                  "text-dark-gray",
                )}
              >
                {title}
              </div>
            )}

            {subtitle && (
              <div className="type-body-1 md:type-heading-2">{subtitle}</div>
            )}
          </div>

          {/* TEAM CARDS */}
          <div
            className={cn(
              "mt-16 md:mt-32 space-y-12 md:space-y-0",
              "md:mx-auto md:max-w-[1024px]",
              "md:flex md:flex-wrap md:justify-between md:gap-y-12",
            )}
          >
            {members.map((member, index) => (
              <div
                key={member._key ?? `${index}`}
                className="w-full md:w-[400px]"
              >
                <div className="md:hidden">
                  <MemberCardMobile member={member} locale={locale} />
                </div>

                <div className="hidden md:block">
                  <MemberCardDesktop member={member} locale={locale} />
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            className={cn(
              "flex flex-col gap-8 items-center",
              "text-center",
              "md:max-w-[500px] mx-auto",
              "mt-16 md:mt-32",
            )}
          >
            {text && <div className="type-body-1">{text}</div>}
            {ctaLabel && ctaHref && (
              <Button href={ctaHref} variant="dark">
                {ctaLabel}
              </Button>
            )}
          </div>
        </Container>
      </div>
    </div>
  )
}

function MemberCardDesktop({ member, locale }: MemberCardProps) {
  const { title, description, roles, lastRole } = getMemberContent(
    member,
    locale,
  )

  return (
    <article className="w-full max-w-[400px]">
      {description.trim() !== "" ? (
        <p className="type-body-2 mb-8 whitespace-pre-line text-accent">
          {description}
        </p>
      ) : null}

      <div className="relative aspect-5/7 w-full overflow-hidden bg-gray/15">
        {member.image ? (
          <SanityImage
            image={member.image}
            locale={locale}
            altFallback={title}
            params={{
              width: 400,
              height: 560,
              sizes: "30vw",
            }}
            fill
            className="object-cover object-center"
          />
        ) : null}
      </div>

      <div className="mt-5">
        {title.trim() !== "" ? <h3 className="type-body-1">{title}</h3> : null}

        {roles !== "" ? (
          <p className="type-body-2 text-dark-gray uppercase font-medium mt-2">
            {roles}
          </p>
        ) : null}
        {lastRole !== "" ? (
          <p className="type-body-2 text-dark-gray uppercase font-medium">
            {lastRole}
          </p>
        ) : null}
      </div>
    </article>
  )
}

function MemberCardMobile({ member, locale }: MemberCardProps) {
  const t = useTranslations("teamGrid")
  const [isOpen, setIsOpen] = useState(false)

  const { title, description, roles, lastRole } = getMemberContent(
    member,
    locale,
  )

  return (
    <article className="w-full">
      <div className="relative aspect-5/7 w-full overflow-hidden bg-gray/15">
        {member.image ? (
          <SanityImage
            image={member.image}
            locale={locale}
            altFallback={title}
            params={{
              width: 720,
              height: 1008,
              sizes: "100vw",
            }}
            fill
            className="object-cover object-center"
          />
        ) : null}

        {description.trim() !== "" ? (
          <div
            className={cn(
              "absolute inset-x-4 bottom-2",
              "flex flex-col-reverse gap-2 items-end",
            )}
          >
            <div
              className={cn(
                "w-full overflow-hidden rounded-[4px] bg-light-gray",
                "transition-all duration-500 ease-in-out",
                isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              <p className="type-body-2 whitespace-pre-line p-6 text-accent">
                {description}
              </p>
            </div>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={
                isOpen
                  ? t("closeMemberDescription")
                  : t("openMemberDescription")
              }
              className={cn(
                "relative z-10",
                "grid h-14 w-14 shrink-0 place-items-center rounded-[4px]",
                "bg-light-gray text-accent",
                "transition-colors",
              )}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span
                className={cn(
                  "relative block h-6 w-6",
                  "transition-transform duration-400 ease-in-out",
                  isOpen ? "rotate-180" : "rotate-0",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1/2 left-0 h-[2px] w-6 -translate-y-1/2",
                    "transition-transform duration-300 ease-in-out",
                  )}
                  style={{ backgroundColor: "var(--color-black)" }}
                />
                <span
                  className={cn(
                    "absolute top-0 left-1/2 h-6 w-[2px] -translate-x-1/2 origin-center",
                    "transition-transform duration-300 ease-in-out",
                    isOpen ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100",
                  )}
                  style={{ backgroundColor: "var(--color-black)" }}
                />
              </span>
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        {title.trim() !== "" ? <h3 className="type-body-1">{title}</h3> : null}
        {roles !== "" ? (
          <p className="type-body-2 text-dark-gray uppercase font-medium mt-2">
            {roles}
          </p>
        ) : null}
        {lastRole !== "" ? (
          <p className="type-body-2 text-dark-gray uppercase font-medium">
            {lastRole}
          </p>
        ) : null}
      </div>
    </article>
  )
}
