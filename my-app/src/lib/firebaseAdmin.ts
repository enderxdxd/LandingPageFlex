import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

/**
 * Firebase Admin com inicialização PREGUIÇOSA.
 *
 * Por que isto importa: antes, `initializeApp({ credential: cert({...}) })`
 * rodava no escopo do módulo, ou seja, na hora do `import`. E `cert()` valida
 * as credenciais na hora — se faltar `FIREBASE_ADMIN_PRIVATE_KEY`, ou se ela
 * vier malformada, ele lança na mesma hora, com `codePrefix: 'app'`.
 *
 * O `next build` importa TODA rota de API para coletar os dados da página. Com
 * a inicialização no topo do arquivo, qualquer rota que importasse este módulo
 * derrubava o build inteiro quando as variáveis não estavam no ambiente de
 * build — que é exatamente o caso da Vercel, onde não existe `.env.local`.
 * Daí o build passar na máquina e quebrar no deploy.
 *
 * Com a inicialização adiada para o primeiro ACESSO, importar o módulo não
 * custa nada. A credencial só é validada quando uma requisição de verdade usa
 * o Admin SDK — e aí, se faltar variável, o erro é um 500 naquela rota, não um
 * deploy inteiro no chão.
 */

function getPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (!raw) return undefined
  // Remove aspas extras que a Vercel pode adicionar
  const cleaned = raw.replace(/^"(.*)"$/, '$1')
  // Converte \n literal em quebras de linha reais
  return cleaned.replace(/\\n/g, '\n')
}

/** Inicializa na primeira chamada; nas seguintes devolve o app existente. */
function adminApp(): App {
  if (getApps().length) return getApp()

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = getPrivateKey()

  /* Mensagem explícita em vez do erro cru do SDK: quando isto estourar em
     produção, o log diz QUAL variável está faltando, em vez de um
     "Failed to parse private key" que não aponta para lugar nenhum. */
  const faltando = [
    !projectId && 'FIREBASE_ADMIN_PROJECT_ID',
    !clientEmail && 'FIREBASE_ADMIN_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY',
  ].filter(Boolean)

  if (faltando.length) {
    throw new Error(
      `Firebase Admin não configurado: faltam ${faltando.join(', ')} no ambiente.`
    )
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

/**
 * Proxy preguiçoso.
 *
 * Mantém a forma `adminAuth.createUser(...)` que os consumidores já usam, em
 * vez de virar `getAdminAuth().createUser(...)` e obrigar a mexer em todos os
 * arquivos. O SDK só é tocado quando alguém lê uma propriedade — e aí já
 * estamos dentro de uma requisição, não do build.
 */
function lazy<T extends object>(resolver: () => T): T {
  return new Proxy({} as T, {
    get(_alvo, prop, receptor) {
      const real = resolver()
      const valor = Reflect.get(real as object, prop, receptor)
      // métodos precisam do `this` original, senão perdem o contexto interno
      return typeof valor === 'function' ? valor.bind(real) : valor
    },
    has(_alvo, prop) {
      return Reflect.has(resolver() as object, prop)
    },
  })
}

export const adminAuth: Auth = lazy(() => getAuth(adminApp()))
export const adminDb: Firestore = lazy(() => getFirestore(adminApp()))
