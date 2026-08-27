'use client'

/**
 * A caixa de consentimento dos formulários.
 *
 * A LGPD exige que o consentimento seja **livre, informado e inequívoco**
 * (art. 5º, XII). Na prática isso significa três coisas que este componente
 * garante e que um checkbox solto não garante:
 *
 *   1. Nunca vem pré-marcado — consentimento pré-marcado não é consentimento.
 *   2. Diz para QUÊ os dados vão ser usados, não só "aceito os termos".
 *   3. Liga para a Política de Privacidade, onde estão base legal, prazo de
 *      retenção e como exercer os direitos do titular.
 *
 * O rótulo inteiro é clicável e o alvo tem 44px — 98% do tráfego é celular.
 */

import Link from 'next/link'

interface ConsentFieldProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** o que será feito com os dados, em uma linha */
  purpose: string
  id?: string
  error?: string
}

export default function ConsentField({
  checked,
  onChange,
  purpose,
  id = 'consentimento',
  error,
}: ConsentFieldProps) {
  return (
    <div className="consent-field">
      <label htmlFor={id}>
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          aria-describedby={`${id}-desc`}
          required
        />
        <span id={`${id}-desc`}>
          Autorizo a Flex Fitness Center a tratar meus dados pessoais para{' '}
          {purpose}, conforme a{' '}
          <Link href="/privacy-policy" target="_blank">
            Política de Privacidade
          </Link>
          . Posso revogar este consentimento a qualquer momento.
        </span>
      </label>
      {error && (
        <p className="consent-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
