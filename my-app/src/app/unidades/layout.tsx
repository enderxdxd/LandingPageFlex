import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unidades - Flex Fitness Center',
  description: 'Conheça nossas unidades em Goiânia e Palmas',
}

export default function UnitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}