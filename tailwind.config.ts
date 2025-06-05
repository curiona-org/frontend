import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: "var(--font-satoshi)",
      },
      fontSize: {
        "display-1": [
          "61px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "display-2": [
          "49px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-1": [
          "39px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "heading-1-bold": [
          "39px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-2": [
          "31px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "heading-2-bold": [
          "31px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-3": [
          "25px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "heading-4-regular": [
          "20px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "heading-4-bold": [
          "20px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "body-1-regular": [
          "16px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "body-1-medium": [
          "16px",
          {
            lineHeight: "120%",
            fontWeight: "500",
          },
        ],
        "body-1-bold": [
          "16px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "body-2": [
          "13px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        caption: [
          "10px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-display-1": [
          "36px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-display-2": [
          "34px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-heading-1": [
          "27px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-heading-1-bold": [
          "27px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-heading-2": [
          "22px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-heading-2-bold": [
          "22px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-heading-3": [
          "18px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-heading-4-regular": [
          "14px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-heading-4-bold": [
          "14px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-body-1-regular": [
          "11px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-body-1-medium": [
          "11px",
          {
            lineHeight: "120%",
            fontWeight: "500",
          },
        ],
        "mobile-body-1-bold": [
          "11px",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "mobile-body-2": [
          "9px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
        "mobile-caption": [
          "7px",
          {
            lineHeight: "120%",
            fontWeight: "400",
          },
        ],
      },
      colors: {
        transparent: "transparent",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        black: {
          "50": "var(--black-50)",
          "100": "var(--black-100)",
          "200": "var(--black-200)",
          "300": "var(--black-300)",
          "400": "var(--black-400)",
          "500": "var(--black-500)",
          "600": "var(--black-600)",
          "700": "var(--black-700)",
          "800": "var(--black-800)",
          "900": "var(--black-900)",
        },
        white: {
          "50": "var(--white-50)",
          "100": "var(--white-100)",
          "200": "var(--white-200)",
          "300": "var(--white-300)",
          "400": "var(--white-400)",
          "500": "var(--white-500)",
          "600": "var(--white-600)",
          "700": "var(--white-700)",
          "800": "var(--white-800)",
          "900": "var(--white-900)",
        },
        red: {
          "50": "var(--red-50)",
          "100": "var(--red-100)",
          "200": "var(--red-200)",
          "300": "var(--red-300)",
          "400": "var(--red-400)",
          "500": "var(--red-500)",
          "600": "var(--red-600)",
          "700": "var(--red-700)",
          "800": "var(--red-800)",
          "900": "var(--red-900)",
        },
        green: {
          "50": "var(--green-50)",
          "100": "var(--green-100)",
          "200": "var(--green-200)",
          "300": "var(--green-300)",
          "400": "var(--green-400)",
          "500": "var(--green-500)",
          "600": "var(--green-600)",
          "700": "var(--green-700)",
          "800": "var(--green-800)",
          "900": "var(--green-900)",
        },
        blue: {
          "50": "var(--blue-50)",
          "100": "var(--blue-100)",
          "200": "var(--blue-200)",
          "300": "var(--blue-300)",
          "400": "var(--blue-400)",
          "500": "var(--blue-500)",
          "600": "var(--blue-600)",
          "700": "var(--blue-700)",
          "800": "var(--blue-800)",
          "900": "var(--blue-900)",
        },
        yellow: {
          "50": "var(--yellow-50)",
          "100": "var(--yellow-100)",
          "200": "var(--yellow-200)",
          "300": "var(--yellow-300)",
          "400": "var(--yellow-400)",
          "500": "var(--yellow-500)",
          "600": "var(--yellow-600)",
          "700": "var(--yellow-700)",
          "800": "var(--yellow-800)",
          "900": "var(--yellow-900)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        hide: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        swipeOut: {
          from: {
            transform: "translateX(var(--radix-toast-swipe-end-x))",
          },
          to: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
        },
        "background-position-spin": {
          "0%": {
            backgroundPosition: "top center",
          },
          "100%": {
            backgroundPosition: "bottom center",
          },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        fadeIn: "fadeIn 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
        "background-position-spin":
          "background-position-spin 3000ms infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
