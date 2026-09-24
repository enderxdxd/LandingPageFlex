/**
 * O campo-armadilha, isolado num módulo sem dependência de servidor.
 *
 * Os formulários são componentes de cliente e precisam do nome do campo para
 * renderizá-lo. Se importassem de `security.ts`, arrastariam `next/server`
 * para dentro do bundle do navegador — daí a separação.
 */

/** Nome do campo invisível que só um robô preenche. */
export const HONEYPOT_FIELD = 'website'

/** Props do input escondido: fora do fluxo, fora da ordem de tabulação e
 *  fora do alcance de leitores de tela, mas presente no DOM para o robô. */
export const honeypotInputProps = {
  type: 'text' as const,
  name: HONEYPOT_FIELD,
  tabIndex: -1,
  autoComplete: 'off',
  'aria-hidden': true,
  style: {
    position: 'absolute' as const,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden' as const,
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
  },
}
