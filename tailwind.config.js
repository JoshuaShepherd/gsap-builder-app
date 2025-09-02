/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#ffffff',
  			foreground: '#2c2c2c', /* Warm dark gray instead of pure black */
  			surface: '#fefefe', /* Pure white for clean reading */
  			surface2: '#f8f6f3', /* Warm off-white like aged paper */
  			border: '#e8e5e0', /* Subtle warm gray borders */
  			gray: {
  				'50': '#fafaf9',
  				'100': '#f4f4f5',
  				'200': '#e4e4e7',
  				'300': '#d4d4d8',
  				'400': '#a1a1aa',
  				'500': '#71717a',
  				'600': '#52525b',
  				'700': '#3f3f46',
  				'800': '#27272a',
  				'900': '#18181b',
  				'950': '#111112'
  			},
  			accent: '#8b4513', /* Warm brown for literary feel */
  			accentHover: '#a0522d', /* Slightly lighter brown */
  			code: '#18181b',
  			codeBg: '#232326',
  			literary: {
  				'charcoal': '#2c2c2c',
  				'parchment': '#f8f6f3',
  				'sepia': '#8b4513',
  				'cream': '#fefefe',
  				'warm-border': '#e8e5e0'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		spacing: {
  			prose: '65ch', /* Optimal reading line length */
  			'reading-width': '75ch', /* Wider for certain content */
  			'narrow': '45ch' /* Narrower for captions, etc. */
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI"',
  				'Roboto',
  				'Helvetica Neue"',
  				'Arial',
  				'sans-serif'
  			],
  			serif: [
  				'Crimson Text',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'Fira Mono',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono"',
  				'Courier New"',
  				'monospace'
  			],
  			body: [
  				'Crimson Text', /* Primary reading font */
  				'Georgia',
  				'Times New Roman',
  				'serif'
  			],
  			heading: [
  				'Inter', /* Clean sans-serif for headings */
  				'Segoe UI',
  				'Helvetica Neue',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.875rem', /* Smaller for annotations */
  				{
  					lineHeight: '1.4'
  				}
  			],
  			sm: [
  				'1rem', /* Standard small text */
  				{
  					lineHeight: '1.5'
  				}
  			],
  			base: [
  				'1.125rem', /* Optimized for reading */
  				{
  					lineHeight: '1.7'
  				}
  			],
  			lg: [
  				'1.25rem', /* Slightly larger */
  				{
  					lineHeight: '1.6'
  				}
  			],
  			xl: [
  				'1.5rem',
  				{
  					lineHeight: '1.25'
  				}
  			],
  			'2xl': [
  				'2rem',
  				{
  					lineHeight: '1.12'
  				}
  			],
  			'3xl': [
  				'2.5rem',
  				{
  					lineHeight: '1.07'
  				}
  			],
  			'4xl': [
  				'3rem',
  				{
  					lineHeight: '1.05'
  				}
  			],
  			h1: [
  				'2.25rem',
  				{
  					lineHeight: '1.1'
  				}
  			],
  			h2: [
  				'1.6rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			h3: [
  				'1.25rem',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			h4: [
  				'1.1rem',
  				{
  					lineHeight: '1.3'
  				}
  			]
  		},
  		typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            backgroundColor: theme("colors.background"),
            fontFamily: theme("fontFamily.serif").join(", "),
            fontSize: theme("fontSize.base")[0],
            lineHeight: theme("fontSize.base")[1].lineHeight,
            maxWidth: theme("spacing.prose"),
            h1: {
              fontFamily: theme("fontFamily.sans").join(", "),
              fontWeight: "700",
              fontSize: theme("fontSize.3xl")[0],
              lineHeight: theme("fontSize.3xl")[1].lineHeight,
              color: theme("colors.foreground"),
              marginTop: "2.5rem",
              marginBottom: "1.25rem",
              letterSpacing: "-0.01em",
            },
            h2: {
              fontFamily: theme("fontFamily.sans").join(", "),
              fontWeight: "700",
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1].lineHeight,
              color: theme("colors.foreground"),
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h3: {
              fontFamily: theme("fontFamily.sans").join(", "),
              fontWeight: "600",
              fontSize: theme("fontSize.xl")[0],
              lineHeight: theme("fontSize.xl")[1].lineHeight,
              color: theme("colors.foreground"),
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },
            h4: {
              fontFamily: theme("fontFamily.sans").join(", "),
              fontWeight: "600",
              fontSize: theme("fontSize.lg")[0],
              lineHeight: theme("fontSize.lg")[1].lineHeight,
              color: theme("colors.gray.200"),
              marginTop: "1.25rem",
              marginBottom: "0.5rem",
            },
            p: {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontSize: theme("fontSize.base")[0],
              lineHeight: theme("fontSize.base")[1].lineHeight,
              color: theme("colors.foreground"),
              marginBottom: "1.25em",
              letterSpacing: "0",
            },
            a: {
              color: theme("colors.accent"),
              transition: "color 0.2s",
              '&:hover': {
                color: theme("colors.accentHover"),
              },
            },
            blockquote: {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontStyle: "italic",
              borderLeft: `3px solid ${theme("colors.gray.700")}`,
              color: theme("colors.gray.200"),
              backgroundColor: theme("colors.gray.900"),
              paddingLeft: "1.25em",
              marginTop: "1.25em",
              marginBottom: "1.25em",
              opacity: "0.92",
            },
            mark: {
              backgroundColor: "#27272a",
              color: "#fff",
              padding: "0.15em 0.25em",
            },
            ul: {
              paddingLeft: "1.25em",
              marginBottom: "1em",
              color: theme("colors.foreground"),
            },
            ol: {
              paddingLeft: "1.5em",
              marginBottom: "1em",
              color: theme("colors.foreground"),
            },
            code: {
              fontFamily: theme("fontFamily.mono").join(", "),
              color: "#a78bfa",
              backgroundColor: "#232326",
              fontSize: theme("fontSize.sm")[0],
              borderRadius: "4px",
              padding: "0.18em 0.38em",
            },
            pre: {
              fontFamily: theme("fontFamily.mono").join(", "),
              backgroundColor: "#232326",
              color: "#f4f4f5",
              fontSize: theme("fontSize.sm")[0],
              borderRadius: "6px",
              padding: "1em",
              marginBottom: "1.5em",
              overflowX: "auto",
            },
            strong: {
              color: "#fff",
              fontWeight: "bold",
            },
            hr: {
              borderColor: theme("colors.gray.700"),
              margin: "2em 0",
            },
            table: {
              width: "100%",
              marginBottom: "2em",
              fontSize: theme("fontSize.sm")[0],
            },
            th: {
              fontWeight: "bold",
              borderBottom: `2px solid ${theme("colors.gray.700")}`,
            },
            td: {
              borderBottom: `1px solid ${theme("colors.gray.800")}`,
            },
            img: {
              borderRadius: "12px",
              margin: "1.5em 0",
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.foreground"),
            backgroundColor: theme("colors.background"),
            h1: { color: theme("colors.foreground") },
            h2: { color: theme("colors.foreground") },
            h3: { color: theme("colors.foreground") },
            h4: { color: theme("colors.gray.200") },
            p: {
              fontFamily: theme("fontFamily.serif").join(", "),
              color: theme("colors.foreground"),
            },
            blockquote: {
              fontFamily: theme("fontFamily.serif").join(", "),
              color: theme("colors.gray.200"),
              backgroundColor: theme("colors.gray.900"),
              borderLeft: `3px solid ${theme("colors.gray.700")}`,
            },
            code: {
              color: "#a78bfa",
              backgroundColor: "#232326",
            },
            pre: {
              backgroundColor: "#232326",
              color: "#f4f4f5",
            },
            a: {
              color: theme("colors.accent"),
              '&:hover': {
                color: theme("colors.accentHover"),
              },
            },
            mark: {
              backgroundColor: "#27272a",
              color: "#fff",
            },
          },
        },
      })
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities }) {
      addUtilities({
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
        /* Literary typography utilities */
        '.text-literary': {
          'font-family': 'Crimson Text, Georgia, Times New Roman, serif',
          'line-height': '1.7',
          'color': '#2c2c2c',
        },
        '.heading-literary': {
          'font-family': 'Inter, Segoe UI, Helvetica Neue, sans-serif',
          'font-weight': '700',
          'color': '#1a1a1a',
          'letter-spacing': '-0.025em',
        },
        '.reading-width': {
          'max-width': '65ch',
        },
        '.drop-cap': {
          '&::first-letter': {
            'float': 'left',
            'font-size': '3.5em',
            'line-height': '0.8',
            'margin': '0.1em 0.1em 0 0',
            'font-weight': 'bold',
            'color': '#8b4513',
          },
        },
        '.text-justify': {
          'text-align': 'justify',
          'hyphens': 'auto',
        },
        '.quote-marks': {
          'position': 'relative',
          '&::before': {
            'content': '"',
            'font-size': '4em',
            'color': '#8b4513',
            'position': 'absolute',
            'top': '-0.5em',
            'left': '-0.25em',
            'opacity': '0.3',
          },
        },
      })
    },
  ],
};