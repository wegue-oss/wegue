export default function mdiWoff2OnlyPlugin (options) {
  return {
    name: 'mdi-woff2-only',
    enforce: 'pre',
    transform (code, id) {
      if (!id.includes('node_modules/@mdi/font/css/materialdesignicons.css')) {
        return null;
      }

      // Extract the WOFF2 url(...) format("woff2")
      const woff2Match = code.match(
        /url\((["'])\.\.\/fonts\/materialdesignicons-webfont\.woff2[^"']*\1\)\s+format\((["'])woff2\2\)/
      )
      if (woff2Match) {
        // Replace the src: ...; lines to reference WOFF2 only
        // But keep their number consistent to impact source map as less as possible
        const woff2 = woff2Match[0];

        const newCode = code.replace(
          /@font-face\s*{([\s\S]*?)}/,
          (match, inner) => {
            const cleanedInner = inner
              .split('\n')
              .map((line) => {
                if (!line.trim().startsWith('src:')) {
                  return line;
                }
                if (!line.includes('woff2')) {
                  return '';
                } else {
                  const indent = line.match(/^\s*/)[0];
                  return `${indent}src: ${woff2};`;
                }
              }).join('\n');

            return `@font-face {${cleanedInner}}`;
          }
        );

        return {
          code: newCode,
          map: null
        };
      }
      return null;
    }
  };
};
