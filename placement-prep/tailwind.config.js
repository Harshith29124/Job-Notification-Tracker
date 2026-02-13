/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F7F6F3",
                "text-primary": "#111111",
                accent: "#8B0000",
                success: "#2D5016",
                warning: "#8B6914",
                border: "#D4D2CC",
            },
            fontFamily: {
                serif: ['"Crimson Pro"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '4px',
                'none': '0',
            },
            boxShadow: {
                none: 'none',
            },
        },
    },
    plugins: [],
}
