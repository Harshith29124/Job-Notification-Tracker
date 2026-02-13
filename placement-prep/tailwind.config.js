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
                    DEFAULT: "#8B0000",
                    foreground: "#FFFFFF",
                },
                bone: {
                    DEFAULT: "#F7F6F3",
                    darker: "#EBEAE6",
                },
                success: {
                    DEFAULT: "#2D5016",
                    soft: "#EAF1E6",
                },
                warning: {
                    DEFAULT: "#8B6914",
                    soft: "#F9F4E5",
                },
                technical: {
                    slate: "#111111",
                    border: "#D4D2CC",
                }
            },
        },
    },
    plugins: [],
}
