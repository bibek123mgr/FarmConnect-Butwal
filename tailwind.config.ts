import type { Config } from 'tailwindcss'

const config: Config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    extend: {
        keyframes: {
            marquee: {
                "0%": { transform: "translateX(0%)" },
                "100%": { transform: "translateX(-50%)" },
            },
        },
        animation: {
            marquee: "marquee 20s linear infinite",
        },
    },
    plugins: [],
}

export default config
