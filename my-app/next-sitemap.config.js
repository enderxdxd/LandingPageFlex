/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.flexfitnesscenter.com.br',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/_next', '/404', '/500'],
      },
    ],
    additionalSitemaps: [
      'https://www.flexfitnesscenter.com.br/sitemap.xml',
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
  ],
  generateIndexSitemap: true,
  outDir: 'public',
};