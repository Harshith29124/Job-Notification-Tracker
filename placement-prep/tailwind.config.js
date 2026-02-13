/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(245, 58%, 51%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
            },
        },
    },
    plugins: [],
}
