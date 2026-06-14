import { useCallback, useEffect, useRef, useState } from "react"
import { Card, Flex, Spinner, Text } from "@sanity/ui"
import type { InputProps } from "sanity"

import { maybeCompressImage } from "../lib/imageCompression"

/**
 * Compression interceptor registered at the document form root level
 * (see `form.components.input` in sanity.config.ts).
 *
 * Sanity 5 does not expose an official `onBeforeUpload` hook. The strategy is
 * purely DOM-based: during the *capture* phase we intercept `change` (file input)
 * and `drop` (drag & drop) events anywhere in the form, compress images with
 * `browser-image-compression` (Web Worker), and re-dispatch the event with the
 * compressed files, letting Sanity's native uploader handle assets, preview,
 * hotspot, and crop.
 *
 * By covering the entire form from a single point, we also intercept batch
 * drops on galleries (which happen at the array field level, not the individual
 * image input). Floor-plan PDFs and non-compressible formats pass through
 * unchanged.
 *
 * Note: image paste is not intercepted (edge case); pasted files are uploaded
 * as-is.
 */

/** Marks an event as already processed to avoid re-dispatch loops. */
const HANDLED_FLAG = "__compressedUpload"

function filesFrom(list: FileList | null | undefined): File[] {
  return list ? Array.from(list) : []
}

function isHandled(event: Event): boolean {
  return (event as Event & { [HANDLED_FLAG]?: boolean })[HANDLED_FLAG] === true
}

function markHandled(event: Event): void {
  ;(event as Event & { [HANDLED_FLAG]?: boolean })[HANDLED_FLAG] = true
}

/** Intercepts only when there is at least one raster image to compress. */
function hasCompressibleImage(files: File[]): boolean {
  return files.some((file) => file.type.startsWith("image/"))
}

function toDataTransfer(files: File[]): DataTransfer {
  const dataTransfer = new DataTransfer()
  files.forEach((file) => dataTransfer.items.add(file))
  return dataTransfer
}

export function CompressedUploadInput(props: InputProps) {
  // Apply the interceptor only once, around the entire document form.
  const isDocumentRoot =
    props.id === "root" && props.schemaType.type?.name === "document"

  if (!isDocumentRoot) {
    return props.renderDefault(props)
  }

  return <DocumentUploadInterceptor {...props} />
}

function DocumentUploadInterceptor(props: InputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState(0)

  const compressAll = useCallback(async (files: File[]): Promise<File[]> => {
    return Promise.all(files.map((file) => maybeCompressImage(file)))
  }, [])

  useEffect(() => {
    const root = containerRef.current
    if (!root) {
      return
    }

    let cancelled = false

    const track = (delta: number) => {
      if (!cancelled) {
        setPending((count) => Math.max(0, count + delta))
      }
    }

    const onChangeCapture = (event: Event) => {
      if (isHandled(event)) {
        return
      }

      const target = event.target as HTMLInputElement | null
      if (!target || target.type !== "file") {
        return
      }

      const files = filesFrom(target.files)
      if (files.length === 0 || !hasCompressibleImage(files)) {
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
      track(1)

      void compressAll(files)
        .then((result) => {
          if (cancelled) {
            return
          }
          target.files = toDataTransfer(result).files
          const next = new Event("change", { bubbles: true })
          markHandled(next)
          target.dispatchEvent(next)
        })
        .finally(() => track(-1))
    }

    const onDropCapture = (event: DragEvent) => {
      if (isHandled(event)) {
        return
      }

      const files = filesFrom(event.dataTransfer?.files)
      if (files.length === 0 || !hasCompressibleImage(files)) {
        return
      }

      const dropTarget = event.target as HTMLElement | null
      if (!dropTarget) {
        return
      }

      const { clientX, clientY } = event

      event.preventDefault()
      event.stopImmediatePropagation()
      track(1)

      void compressAll(files)
        .then((result) => {
          if (cancelled) {
            return
          }
          const next = new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: toDataTransfer(result),
            clientX,
            clientY,
          })
          markHandled(next)
          dropTarget.dispatchEvent(next)
        })
        .finally(() => track(-1))
    }

    root.addEventListener("change", onChangeCapture, true)
    root.addEventListener("drop", onDropCapture, true)

    return () => {
      cancelled = true
      root.removeEventListener("change", onChangeCapture, true)
      root.removeEventListener("drop", onDropCapture, true)
    }
  }, [compressAll])

  return (
    <div ref={containerRef}>
      {props.renderDefault(props)}
      {pending > 0 && (
        <Card
          padding={3}
          radius={3}
          shadow={3}
          tone="primary"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 1000,
          }}
        >
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text size={1}>Ottimizzazione immagini in corso…</Text>
          </Flex>
        </Card>
      )}
    </div>
  )
}
