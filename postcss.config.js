module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      '@fullhuman/postcss-purgecss': {
        content: ['./src/**/*.html', './src/**/*.ts'],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: ['html', 'body', /^mat-/, /^cdk-/, /^ng-/]
      }
    } : {})
  },
};
