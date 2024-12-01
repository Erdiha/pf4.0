// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft-blue': 'rgb(71, 149, 212)',
        'vibrant-orange': 'rgb(255, 135, 44)',
        'off-white': 'rgb(245, 245, 240)',
        'fresh-green': 'rgb(65, 189, 122)',
        'deep-magenta': 'rgb(193, 53, 132)',
        'cool-grey': 'rgb(99, 110, 114)',
        'rich-teal': 'rgb(15, 118, 110)',
        'warm-coral': 'rgb(252, 157, 154)',
        'creamy-beige': 'rgb(240, 235, 223)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
