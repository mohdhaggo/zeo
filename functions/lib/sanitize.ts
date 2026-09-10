/**
 * Input sanitising shared by the public endpoints.
 *
 * Deliberately written as a character-code test rather than a regular
 * expression with escape sequences. The characters being removed are invisible,
 * and a regex literal containing them is exactly the kind of thing an editor,
 * a diff or a copy-paste quietly corrupts without anyone noticing that the
 * guard has stopped guarding.
 */

/**
 * True for C0 control characters, DEL, and the Unicode line and paragraph
 * separators, which some parsers also treat as line breaks.
 */
function isControl(code: number): boolean {
  return code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029;
}

/**
 * Replaces control characters with spaces and collapses the result.
 *
 * Applied to every field before it is stored or put in an email. A name
 * containing a line break is the classic header-injection payload. The current
 * email provider takes JSON over HTTPS, so a raw line break never reaches an
 * SMTP header today - but that is the provider defending us rather than us
 * defending ourselves, and it stops being true the day the provider changes.
 *
 * The message body is exempt: newlines there are meaningful, and it is escaped
 * into HTML rather than into a header.
 */
export function stripControlChars(value: string): string {
  let out = '';
  for (const char of value) {
    out += isControl(char.codePointAt(0) ?? 0) ? ' ' : char;
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

/**
 * Same, but keeps newlines. For free-text fields that are rendered as escaped
 * HTML in a body, never interpolated into a header.
 */
export function stripControlCharsKeepNewlines(value: string): string {
  let out = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 0x0a || code === 0x0d) {
      out += char;
    } else {
      out += isControl(code) ? ' ' : char;
    }
  }
  return out.trim();
}
