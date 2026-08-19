export interface Modalidade {
  name: string
  description: string
  category: ModalidadeCategory
}

export type ModalidadeCategory =
  | 'Força & Funcional'
  | 'Mente & Corpo'
  | 'Lutas'
  | 'Cardio'
  | 'Dança & Ritmos'

export const modalidadeCategories: ModalidadeCategory[] = [
  'Força & Funcional',
  'Mente & Corpo',
  'Lutas',
  'Cardio',
  'Dança & Ritmos',
]

export const modalidadesData: Modalidade[] = [
  // Força & Funcional
  {
    name: 'ABS',
    description:
      'Aula focada no fortalecimento e definição da região abdominal, trabalhando diferentes grupos musculares do core.',
    category: 'Força & Funcional',
  },
  {
    name: 'Funcional',
    description:
      'Treino dinâmico que combina força, resistência, agilidade, coordenação e condicionamento físico através de exercícios multiarticulares e funcionais.',
    category: 'Força & Funcional',
  },
  {
    name: 'Glúteos',
    description:
      'Aula focada no fortalecimento e desenvolvimento dos músculos dos glúteos, com exercícios variados e diferentes estímulos.',
    category: 'Força & Funcional',
  },
  {
    name: 'Power Core',
    description:
      'Aula de treinamento funcional focada no fortalecimento dos músculos do core, trabalhando principalmente abdômen, lombar e musculatura estabilizadora.',
    category: 'Força & Funcional',
  },

  // Mente & Corpo
  {
    name: 'LPF',
    description:
      'Técnica de treinamento postural e respiratório que trabalha a musculatura profunda do abdômen, favorecendo consciência corporal e controle postural.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Mat Pilates',
    description:
      'Aula de Pilates realizada no solo, com exercícios que desenvolvem força, flexibilidade, equilíbrio, mobilidade e consciência corporal.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Circuito Pilates',
    description:
      'Aula de Pilates realizada em aparelhos, em formato de circuito, com exercícios para força, mobilidade, estabilidade e controle corporal. Capacidade de até 12 alunos.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Flow',
    description:
      'Aula que integra elementos da yoga, dança, capoeira e outras práticas corporais, combinando mobilidade, alongamentos e movimentos fluidos para melhorar a amplitude de movimento, a flexibilidade e a consciência corporal.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Yoga',
    description:
      'Prática que combina posturas, respiração e concentração, promovendo mobilidade, equilíbrio, força e relaxamento.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Alongamento e Mobilidade',
    description:
      'Aula voltada para melhorar a flexibilidade, mobilidade articular e amplitude de movimento, contribuindo para uma melhor qualidade dos movimentos.',
    category: 'Mente & Corpo',
  },
  {
    name: 'Alongamento Express',
    description:
      'Aula de 20 minutos com exercícios de alongamento e mobilidade para promover relaxamento, flexibilidade e bem-estar de forma prática e rápida.',
    category: 'Mente & Corpo',
  },

  // Lutas
  {
    name: 'Boxe',
    description:
      'Aula dinâmica que utiliza técnicas e movimentos do boxe para desenvolver condicionamento físico, coordenação, agilidade e resistência.',
    category: 'Lutas',
  },
  {
    name: 'Muay Thai',
    description:
      'Aula baseada nas técnicas do Muay Thai, trabalhando condicionamento físico, coordenação, resistência, força e agilidade.',
    category: 'Lutas',
  },
  {
    name: 'Jiu Jitsu',
    description:
      'Aula baseada nas técnicas do Jiu-Jitsu, com foco em movimentações, posições, quedas e técnicas de luta no solo.',
    category: 'Lutas',
  },

  // Cardio
  {
    name: 'Ciclismo',
    description:
      'Aula de ciclismo indoor com diferentes intensidades e estímulos, proporcionando melhora do condicionamento cardiovascular e resistência.',
    category: 'Cardio',
  },
  {
    name: 'HIIT',
    description:
      'Treino intervalado de alta intensidade realizado na esteira, alternando períodos de esforço e recuperação para melhorar o condicionamento cardiovascular.',
    category: 'Cardio',
  },
  {
    name: 'Running',
    description:
      'Aula de corrida que trabalha resistência, velocidade e condicionamento cardiovascular, com estímulos adaptados aos diferentes níveis de treinamento.',
    category: 'Cardio',
  },

  // Dança & Ritmos
  {
    name: 'Ballet Clássico',
    description:
      'Aula baseada nos fundamentos do ballet clássico, desenvolvendo postura, coordenação, equilíbrio, flexibilidade e consciência corporal.',
    category: 'Dança & Ritmos',
  },
  {
    name: 'Ritmos',
    description:
      'Aula dançante e dinâmica que combina diferentes estilos musicais para melhorar o condicionamento físico, coordenação e disposição.',
    category: 'Dança & Ritmos',
  },
]
