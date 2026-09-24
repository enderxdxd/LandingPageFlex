/**
 * Cabeçalhos de segurança aplicados a todas as rotas.
 *
 * Não há `Content-Security-Policy` aqui de propósito: o site carrega RD
 * Station, Google Analytics, Meta Pixel (os três só depois do aceite de
 * cookies), Firebase e mapas do Google. Uma CSP escrita no escuro quebraria o
 * pixel e o rastreamento de lead sem ninguém perceber até a campanha sair
 * errada. Ela merece uma passada própria, com os domínios de cada script
 * levantados um a um e testada em preview antes de produção.
 */
const securityHeaders = [
  // força HTTPS nas visitas seguintes, inclusive antes do primeiro redirect
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // impede o navegador de "adivinhar" um tipo diferente do declarado
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // ninguém embute o site num iframe de terceiro (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // o referer sai completo dentro do domínio e só como origem para fora
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // nenhuma página do site pede câmera ou microfone
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
]

const nextConfig = {
  images: {
    /**
     * `domains` está depreciado desde o Next 13 em favor de `remotePatterns`,
     * que é explícito sobre protocolo e caminho.
     */
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
    /**
     * AVIF antes de WebP: pesa ~30% menos no mesmo nível de qualidade e o
     * Next devolve WebP para quem não suporta. Num site de fotografia em tela
     * cheia, com 98% de acesso por celular, é a economia de banda mais barata
     * que existe.
     */
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    minimumCacheTTL: 2678400,
  },
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
