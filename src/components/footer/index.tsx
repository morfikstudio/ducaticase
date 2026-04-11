import { Fragment } from "react"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/ui/Container"
import { cn } from "@/utils/classNames"

import type { FooterContent } from "@/lib/formatFooterContent"
import { Logo } from "@/components/ui/Logo"

function hrefUsesNativeAnchor(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("inline-block shrink-0", className)}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1 9L9 1M9 1H3M9 1V7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PayoffMultiline({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const lines = text.split(/\n/)
  return (
    <p className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </p>
  )
}

function ContactLines({
  email,
  phone,
  className,
}: {
  email: string
  phone: string
  className?: string
}) {
  const showEmail = email.trim() !== ""
  const showPhone = phone.trim() !== ""
  if (!showEmail && !showPhone) {
    return null
  }
  return (
    <div className={cn("type-body-3 text-primary", className)}>
      {showEmail ? (
        <p>
          <a
            href={`mailto:${email}`}
            className="hover:underline underline-offset-4"
          >
            {email}
          </a>
        </p>
      ) : null}
      {showPhone ? (
        <p>
          <a
            href={`tel:${phone}`}
            className="hover:underline underline-offset-4"
          >
            {phone}
          </a>
        </p>
      ) : null}
    </div>
  )
}

export type { FooterContent }

type FooterProps = {
  content: FooterContent
}

export default function Footer({ content }: FooterProps) {
  const {
    payoff,
    email,
    phone,
    addressLine1,
    addressLine2,
    mapsUrl,
    vat,
    socialLinks,
    privacyPolicyLabel,
    privacyPolicyUrl,
    navLinks,
  } = content

  const hasAddress = addressLine1.trim() !== "" && addressLine2.trim() !== ""
  const showPayoff = payoff.trim() !== ""
  const showVat = vat.trim() !== ""
  const showPrivacy =
    privacyPolicyLabel.trim() !== "" && privacyPolicyUrl !== ""

  return (
    <footer className={cn("mt-auto bg-dark text-primary")} role="contentinfo">
      <Container className="py-16 md:py-24">
        <div
          className={cn(
            "flex flex-col gap-10 md:gap-12 lg:flex-row lg:justify-between",
            "lg:gap-16",
          )}
        >
          <div className="flex max-w-md flex-col lg:max-w-sm">
            <Link href="/" aria-label="Ducati Case — Home">
              <Logo />
            </Link>

            {showPayoff ? (
              <div className="mt-8 md:mt-6">
                <PayoffMultiline
                  text={payoff}
                  className="type-body-1 text-primary"
                />
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-6 md:hidden">
              {hasAddress ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "type-body-3 text-primary",
                    "hover:underline underline-offset-4",
                  )}
                  aria-label={`${addressLine1}, ${addressLine2} — apri in Google Maps`}
                >
                  {addressLine1} - {addressLine2}
                </a>
              ) : null}
              <ContactLines email={email} phone={phone} />
            </div>
          </div>

          <div
            className={cn(
              "hidden flex-1 gap-x-10 gap-y-10 md:grid md:grid-cols-2",
              "lg:max-w-xl lg:justify-self-end",
            )}
          >
            <nav className="flex flex-col gap-2.5" aria-label="Website links">
              {navLinks.map(({ label, href }, index) => {
                const className = cn(
                  "type-body-3 text-primary",
                  "hover:underline underline-offset-4",
                )
                const key = `${href}-${index}`
                return hrefUsesNativeAnchor(href) ? (
                  <a key={key} href={href} className={className}>
                    {label}
                  </a>
                ) : (
                  <Link key={key} href={href} className={className}>
                    {label}
                  </Link>
                )
              })}
            </nav>

            <nav className="flex flex-col gap-2.5" aria-label="Social media">
              {socialLinks.map(({ label, href }, index) => (
                <a
                  key={`${href}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    "type-body-3 text-primary",
                    "hover:underline underline-offset-4",
                  )}
                >
                  <span>{label}</span>
                  <ExternalLinkIcon className="translate-y-px" />
                </a>
              ))}
            </nav>

            {hasAddress ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "type-body-3 text-primary",
                  "inline-block hover:underline underline-offset-4",
                )}
                aria-label={`${addressLine1}, ${addressLine2} — apri in Google Maps`}
              >
                {addressLine1}
                <br />
                {addressLine2}
              </a>
            ) : null}

            <ContactLines email={email} phone={phone} />
          </div>
        </div>

        <div
          className={cn(
            "mt-10 border-t border-primary/20 pt-8 md:mt-14 md:pt-8",
            "flex flex-col gap-4 md:flex-row md:items-center",
            showVat && showPrivacy
              ? "md:justify-between"
              : showPrivacy
                ? "md:justify-end"
                : undefined,
          )}
        >
          {showVat ? <p className="type-body-3 text-primary">{vat}</p> : null}
          {showPrivacy ? (
            hrefUsesNativeAnchor(privacyPolicyUrl) ? (
              <a
                href={privacyPolicyUrl}
                className={cn(
                  "type-body-3 text-primary",
                  "hover:underline underline-offset-4 md:text-right",
                )}
              >
                {privacyPolicyLabel}
              </a>
            ) : (
              <Link
                href={privacyPolicyUrl}
                className={cn(
                  "type-body-3 text-primary",
                  "hover:underline underline-offset-4 md:text-right",
                )}
              >
                {privacyPolicyLabel}
              </Link>
            )
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
