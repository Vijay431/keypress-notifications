# public/

Extension assets for the VS Code Marketplace and Open VSX listings.

## Recording `demo.gif`

The main README references `public/demo.gif`. Record it yourself and drop it here — the listing renders immediately once the file exists.

### What to capture

1. Open any file in VS Code with the extension enabled.
2. Trigger 4–6 shortcuts in sequence, pausing briefly on each toast so it's readable:
   - `Ctrl+S` → "You've pressed Ctrl+S"
   - `Ctrl+Shift+P` → "You've pressed Ctrl+Shift+P"
   - `Ctrl+Z` → "You've pressed Ctrl+Z"
   - `Ctrl+D` → "You've pressed Ctrl+D"
   - `Ctrl+\`` → "You've pressed Ctrl+\`"
3. Keep the recording short — 5–10 seconds loops best as a GIF.

### Suggested tools

| Platform | Tool |
|---|---|
| macOS | [Gifox](https://gifox.io), [Kap](https://getkap.co), or QuickTime → ffmpeg → gifsicle |
| Windows | [ScreenToGif](https://www.screentogif.com) |
| Linux | [Peek](https://github.com/phw/peek), `ffmpeg` + `gifski` |

### Size budget

Keep `demo.gif` under **1 MB**. The current `.vsix` is ~21 KB — large media stays outside the package because `public/` assets are referenced by URL in the Marketplace listing, not bundled into the `.vsix`.

- Resize the window to ~900×600 before recording.
- Use `gifsicle --optimize=3` or `gifski` for compression.
