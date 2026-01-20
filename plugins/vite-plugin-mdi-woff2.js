import postcss from 'postcss';
import fs from 'node:fs';

export default function mdiWoff2OnlyPlugin (options) {
  return {
    name: 'mdi-woff2-only',
    enforce: 'pre',
    async transform (code, id) {
      if (!id.includes('node_modules/@mdi/font/css/materialdesignicons.css')) {
        return null;
      }

      // Load original source map directly from node_modules
      const mapPath = `${id}.map`;
      let previousMap;
      if (fs.existsSync(mapPath)) {
        previousMap = fs.readFileSync(mapPath, 'utf-8');
      }

      const result = await postcss([
        {
          postcssPlugin: 'remove-fonts-except-woff2',
          AtRule: {
            'font-face': (atRule) => {
              atRule.walkDecls('src', (decl) => {
                // Extract the WOFF2 url(...) if present inside the src declaration
                const woff2Match = decl.value.match(/url\((["']?)([^"')]+\.woff2[^"')]*?)\1\)/);

                if (woff2Match) {
                  // Replace the src: ...; declaration to reference WOFF2 only
                  decl.value = `url("${woff2Match[2]}") format("woff2")`;
                } else {
                  // Remove declaration completely if WOFF2 is not present
                  decl.remove();
                }
              });
            }
          }
        }
      ]).process(code, {
        from: id,
        to: id,
        map: {
          inline: false,
          annotation: false,
          prev: previousMap
        }
      });

      return {
        code: result.css,
        map: result.map.toJSON()
      };
    }
  };
}
