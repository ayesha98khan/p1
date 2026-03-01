import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [lineClamp],
};