/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'zynch-dark': '#312a30',
                'zynch-pink': '#be2e57',
                'zynch-cyan': '#9ead5c',
                'zynch-blue': '#9fd7fb',
                'zynch-red': '#840824',
                'zynch-muted': '#a2bfcc',
                // Keep ks- for backward compatibility if needed, but updated
                'ks-dark': '#312a30',
                'ks-neon-pink': '#be2e57',
                'ks-neon-cyan': '#9ead5c',
            },
        },
    },
    plugins: [],
}
