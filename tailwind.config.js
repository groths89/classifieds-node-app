module.exports = {
  purge: ["./src/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        100: "25rem",
      },
      borderWidth: {
        3: "3px",
        14: "14px",
      },
      width: {
        mc: "max-content",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
