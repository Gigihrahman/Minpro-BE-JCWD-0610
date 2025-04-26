function validateEmptyCode(code: string): string | null {
  if (!code || code.trim() === "") {
    return null;
  }
  return code.trim();
}
