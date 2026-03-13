tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#8c25f4",
                "background-light": "#f4f4f9", // A slightly cleaner light background
                "background-dark": "#191022",
                // we will add specific element backgrounds that change automatically
                "card-light": "#ffffff",
                "card-dark": "rgba(15, 23, 42, 0.8)", // slate-900/80 approx
                "card-border-light": "#e2e8f0", // slate-200
                "card-border-dark": "#1e293b", // slate-800
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
}
