type JsonLdProps = {
  data: Record<string, unknown>
}

/**
 * Serializza JSON-LD per schema.org (`<script type="application/ld+json">`).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD richiede inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
