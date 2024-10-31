import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enable dark mode by class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'regal-blue' : '#2D70C7',
        'regal-grey': '#8692A6',
        'input-gray': '#E2E8F0',
        'bg-main': '#F9F6EF',
        'bg-second': '#F4F7FE',
        'input-color': '#F4F7FE',
      },
      boxShadow: {
        'custom-siderbar-shadow': '0px 4px 17px 0px #0000000A',
      },
      backdropBlur: {
        'custom-sidebar-blur':'24px',
      },
      fontFamily:{
        'Ambit': ['Ambit', 'sans-serif'],
        'Jakarta': ['Jakarta', 'sans-serif'],
      },
      width:{
        'prompit-width': '746px',
      },
      height:{
        '104':'440px',
        '112':'550px',
      },
      screens: {
        '3xl':'1791px',
        'laptop': '1300px',
        'pc':'1433px',
      },
      padding:{
        'pb-8rem':'160px',
      }
    },
  },
  plugins: [],
};
export default config;
