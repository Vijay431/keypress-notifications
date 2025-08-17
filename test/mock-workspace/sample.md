# Sample Markdown File for Testing

This file contains various markdown elements to test copy/cut/paste operations with the Keypress Notifications extension.

## Headings for Testing

Try selecting and copying different heading levels:

### Subheading Level 3
#### Subheading Level 4
##### Subheading Level 5

## Text Formatting

Test with **bold text** - try copying just the bold part or the entire phrase.
Test with *italic text* - select and copy the italic formatting.
Test with ***bold and italic*** combined formatting.
Test with `inline code` - copy the code snippet.
Test with ~~strikethrough text~~ - try cutting this line.

## Lists for Selection Testing

### Unordered List
- First item - try copying this entire line
- Second item with [a link](https://example.com) - test copying the link
- Third item with `inline code` - copy just the code part
  - Nested item - test with indented content
  - Another nested item with **bold text**

### Ordered List
1. Step one - select and copy
2. Step two with multiple lines
   that continue here - try copying the entire item
3. Step three with code: `npm install package-name`
4. Step four - cut this line and paste it elsewhere

## Code Blocks

Try copying different parts of this JavaScript code block:

```javascript
function testFunction() {
  console.log('Hello from code block');
  return 'test result';
}

const variable = 'test string';
```

And this TypeScript example:

```typescript
interface TestInterface {
  name: string;
  value: number;
}

const testObject: TestInterface = {
  name: 'test',
  value: 42
};
```

## Tables

Try copying rows, columns, or individual cells:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1, Cell 1 | Row 1, Cell 2 | Row 1, Cell 3 |
| Row 2, Cell 1 | Row 2, Cell 2 | Row 2, Cell 3 |
| Row 3, Cell 1 | Row 3, Cell 2 | Row 3, Cell 3 |

## Blockquotes

> This is a blockquote for testing selection.
> Try copying the entire quote or just parts of it.
> 
> Multiple paragraphs in blockquotes can be tested too.

## Links and References

Test copying different types of links:
- Inline link: [VS Code Extension API](https://code.visualstudio.com/api)
- Reference link: [Extension Testing Guide][testing-guide]
- Direct URL: https://github.com/microsoft/vscode

[testing-guide]: https://code.visualstudio.com/api/working-with-extensions/testing-extension

## Special Characters and Symbols

Copy these special characters: © ® ™ § ¶ † ‡ • ◦ ‣ ⁃

Mathematical symbols: ∑ ∏ √ ∞ ≈ ≠ ≤ ≥ ± × ÷

Arrows: ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙

## Long Paragraph for Testing

This is a long paragraph designed to test various selection scenarios. You can try selecting individual words, phrases, sentences, or the entire paragraph. The paragraph contains multiple sentences with different punctuation marks, including commas, periods, semicolons, and exclamation points! This allows you to test how the extension handles different types of text selection and copying operations. Try selecting text that spans multiple lines to see how the extension behaves with multi-line selections.

## Mixed Content

Here's a paragraph with **bold**, *italic*, `code`, and [links](https://example.com) mixed together. Try copying different combinations of these elements to test the extension's behavior with formatted text.

---

**Testing Instructions:**
1. Select any text in this file
2. Use Ctrl+C to copy
3. Use Ctrl+X to cut  
4. Use Ctrl+V to paste
5. Observe the notifications from the Keypress Notifications extension