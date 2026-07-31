export function isSeoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
}
