# Typewriter Animation Spec

The chat response uses a typewriter animation that reveals text character-by-character with variable timing. These pauses are critical to making the dialogue feel natural and human-like, rather than mechanical or robotic.

## Timing

| Type | Delay | Range | Examples |
|------|-------|-------|----------|
| Regular character | 35–80ms | random | 任何文字 |
| Comma-like punctuation | 140–185ms | random | `，` `,` `、` |
| Period-like punctuation | 290–335ms | random | `。` `.` `；` `;` `：` `:` `！` `!` `？` `?` `…` `—` `–` |
| Line break | 480–525ms | random | `\n` |

All delays include a 45ms random variation to avoid a robotic cadence.

## Buffering Strategy

The animation does not wait for the full API response. Instead:

1. **Streaming**: Tokens arrive from the Anthropic API via SSE streaming.
2. **Chunk detection**: Incoming text is buffered. A "deliverable chunk" is identified when the buffer contains a delimiter (any punctuation or newline).
3. **Typewriter**: Once a deliverable chunk is ready, it is revealed character-by-character with the timing above.
4. **Jumping dots**: While waiting for either the first token or the next deliverable chunk, animated jumping dots appear inline at the end of the message bubble.
5. **Completion**: When the stream ends, any remaining buffered text is flushed through the typewriter, then the dots are removed.

## Why This Matters

- The graduated pauses at punctuation mimic natural reading rhythm and breath.
- Random variation in character timing avoids the uncanny "ticker tape" feel.
- Streaming with chunk buffering ensures the user sees progress quickly, without jarring bursts of text.
- The jumping dots provide feedback that the system is still working, reducing perceived latency.
