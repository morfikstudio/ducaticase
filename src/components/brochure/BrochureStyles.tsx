export function BrochureStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: var(--font-inter), Inter, system-ui, sans-serif; color: #111; }

.brochure { width: 210mm; }

.page {
  width: 210mm;
  height: 297mm;
  padding: 14mm 16mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  page-break-after: always;
  break-after: page;
  position: relative;
  overflow: hidden;
}
.page:last-of-type { page-break-after: auto; break-after: auto; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10mm;
}
.logo { width: 18mm; height: auto; display: block; }
.header-right { font-size: 9pt; color: #444; margin: 0; max-width: 70mm; text-align: right; }

/* COVER */
.cover-body { flex: 1; display: flex; flex-direction: column; gap: 6mm; }
.cover-hero { width: 100%; height: 95mm; object-fit: cover; display: block; }
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8mm;
  margin-top: 4mm;
}
.cover-title { font-size: 22pt; line-height: 1.15; font-weight: 400; margin: 0; max-width: 110mm; }
.cover-price { font-size: 22pt; line-height: 1.15; font-weight: 400; margin: 0; white-space: nowrap; }
.cover-location { margin: 0; font-size: 10.5pt; color: #222; }
.cover-sqm { margin: 0; font-size: 9pt; color: #666; }
.cover-description { margin-top: 4mm; font-size: 10pt; line-height: 1.55; color: #1a1a1a; }
.cover-description p { margin: 0 0 3mm 0; }

/* SPECS */
.specs-body { flex: 1; display: flex; flex-direction: column; gap: 6mm; }
.section-title { font-size: 22pt; font-weight: 400; margin: 0 0 4mm 0; line-height: 1.15; }
.highlights-row { display: flex; align-items: center; gap: 6mm; margin-bottom: 4mm; }
.highlights-label { font-size: 8.5pt; letter-spacing: 0.12em; color: #888; }
.highlights-chips { display: flex; flex-wrap: wrap; gap: 3mm; }
.chip {
  border: 1px solid #444;
  border-radius: 999px;
  padding: 2mm 5mm;
  font-size: 9pt;
  color: #222;
}
.specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10mm; }
.spec-col { display: flex; flex-direction: column; }
.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #d8d8d8;
  padding: 3mm 0;
}
.spec-label { font-size: 9.5pt; color: #555; }
.spec-value { font-size: 10pt; color: #111; }

.energy-block { margin-top: 6mm; }
.energy-bar { display: flex; align-items: center; gap: 2mm; margin-top: 4mm; }

.position-block { margin-top: auto; }
.position-label { font-size: 8.5pt; letter-spacing: 0.12em; color: #888; margin: 0 0 2mm 0; }
.position-text { font-size: 9.5pt; line-height: 1.55; color: #222; margin: 0; max-width: 130mm; }

/* GALLERY — fixed 2x3 grid */
.gallery-body { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.gallery-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 4mm;
  min-height: 0;
}
.gallery-item { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 0; }

/* FLOOR PLAN */
.plan-body { flex: 1; display: flex; align-items: center; justify-content: center; }
.plan-image { max-width: 100%; max-height: 100%; object-fit: contain; }

/* BACK COVER */
.back-cover { padding: 0; }
.back-cover-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14mm 16mm;
}
.back-logo { width: 50mm; height: auto; margin-top: auto; }
.back-contacts { margin-top: auto; font-size: 10pt; color: #111; line-height: 1.7; }
.back-contacts p { margin: 0; }
.back-website { margin: 8mm 0 12mm 0; font-size: 14pt; color: #111; }
`,
      }}
    />
  )
}
