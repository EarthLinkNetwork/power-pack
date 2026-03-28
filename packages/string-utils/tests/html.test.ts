import { escapeHtml, unescapeHtml } from '../src';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes less-than sign', () => {
    expect(escapeHtml('a<b')).toBe('a&lt;b');
  });

  it('escapes greater-than sign', () => {
    expect(escapeHtml('a>b')).toBe('a&gt;b');
  });

  it('escapes double quote', () => {
    expect(escapeHtml('a"b')).toBe('a&quot;b');
  });

  it('escapes single quote', () => {
    expect(escapeHtml("a'b")).toBe('a&#39;b');
  });

  it('escapes all special characters in a combined string', () => {
    expect(escapeHtml('<div class="test">&\'hello\'</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;&amp;&#39;hello&#39;&lt;/div&gt;'
    );
  });

  it('returns an already clean string unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('escapes multiple ampersands', () => {
    expect(escapeHtml('a&b&c')).toBe('a&amp;b&amp;c');
  });

  it('escapes adjacent special characters', () => {
    expect(escapeHtml('<>')).toBe('&lt;&gt;');
  });
});

describe('unescapeHtml', () => {
  it('unescapes &amp;', () => {
    expect(unescapeHtml('a&amp;b')).toBe('a&b');
  });

  it('unescapes &lt;', () => {
    expect(unescapeHtml('a&lt;b')).toBe('a<b');
  });

  it('unescapes &gt;', () => {
    expect(unescapeHtml('a&gt;b')).toBe('a>b');
  });

  it('unescapes &quot;', () => {
    expect(unescapeHtml('a&quot;b')).toBe('a"b');
  });

  it('unescapes &#39;', () => {
    expect(unescapeHtml('a&#39;b')).toBe("a'b");
  });

  it('unescapes all entities in a combined string', () => {
    expect(
      unescapeHtml('&lt;div class=&quot;test&quot;&gt;&amp;&#39;hello&#39;&lt;/div&gt;')
    ).toBe('<div class="test">&\'hello\'</div>');
  });

  it('returns an already clean string unchanged', () => {
    expect(unescapeHtml('Hello World 123')).toBe('Hello World 123');
  });

  it('handles empty string', () => {
    expect(unescapeHtml('')).toBe('');
  });

  it('unescapes multiple &amp; entities', () => {
    expect(unescapeHtml('a&amp;b&amp;c')).toBe('a&b&c');
  });

  it('unescapes adjacent entities', () => {
    expect(unescapeHtml('&lt;&gt;')).toBe('<>');
  });
});

describe('roundtrip', () => {
  it('escape then unescape returns original for simple string', () => {
    const original = 'Hello World';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape returns original for special chars', () => {
    const original = '<div class="test">&\'hello\'</div>';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape returns original for all 5 special chars', () => {
    const original = '&<>"\' combined';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape returns original for empty string', () => {
    expect(unescapeHtml(escapeHtml(''))).toBe('');
  });

  it('escape then unescape returns original for clean string', () => {
    const original = 'no special chars here 123';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape returns original for only special chars', () => {
    const original = '&<>"\'';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape preserves multiple ampersands', () => {
    const original = 'a&b&c&d';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('escape then unescape preserves nested-looking HTML', () => {
    const original = '<a href="url">link & text</a>';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });
});
