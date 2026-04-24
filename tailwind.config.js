/** @type {import('tailwindcss').Config} */
export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', '"Noto Sans JP"', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['"Outfit"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
            },
            colors: {
                wacca: {
                    red: '#b4f0b4', // Lime Green (Primary Emission)
                    dark: '#050a05', // Deep Tactical Green-Black
                    darker: '#020502',
                    accent: '#00ff41', // Matrix Green
                    muted: '#6a9c6a', // Desaturated Green
                    surface: '#12121A',
                    border: '#1E1E2E',
                },
            },
        },
    },
    plugins: [],
};
