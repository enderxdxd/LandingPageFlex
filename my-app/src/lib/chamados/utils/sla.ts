import { Timestamp } from 'firebase/firestore'
import { addHours, isWeekend, setHours, setMinutes, isBefore, isAfter, differenceInMilliseconds } from 'date-fns'
import { PrioridadeType } from '../types'
import { SLA_PADRAO, CONFIG_PADRAO } from '../constants'

const { horarioFuncionamento } = CONFIG_PADRAO

function parseHorario(horario: string): { hora: number; minuto: number } {
  const [hora, minuto] = horario.split(':').map(Number)
  return { hora, minuto }
}

/**
 * Verifica se uma data está dentro do horário de funcionamento
 */
function dentroDoHorario(data: Date): boolean {
  const dia = data.getDay()
  if (!horarioFuncionamento.diasUteis.includes(dia)) return false

  const inicio = parseHorario(horarioFuncionamento.inicio)
  const fim = parseHorario(horarioFuncionamento.fim)

  const horaAtual = data.getHours() * 60 + data.getMinutes()
  const horaInicio = inicio.hora * 60 + inicio.minuto
  const horaFim = fim.hora * 60 + fim.minuto

  return horaAtual >= horaInicio && horaAtual < horaFim
}

/**
 * Avança para o próximo horário útil
 */
function proximoHorarioUtil(data: Date): Date {
  let d = new Date(data)
  const inicio = parseHorario(horarioFuncionamento.inicio)

  // Se for fim de semana ou dia não útil, avançar para próximo dia útil
  while (!horarioFuncionamento.diasUteis.includes(d.getDay())) {
    d.setDate(d.getDate() + 1)
    d = setHours(setMinutes(d, inicio.minuto), inicio.hora)
  }

  const fim = parseHorario(horarioFuncionamento.fim)
  const horaAtual = d.getHours() * 60 + d.getMinutes()
  const horaFim = fim.hora * 60 + fim.minuto
  const horaInicio = inicio.hora * 60 + inicio.minuto

  // Se antes do horário de início
  if (horaAtual < horaInicio) {
    d = setHours(setMinutes(d, inicio.minuto), inicio.hora)
  }

  // Se depois do horário de fim
  if (horaAtual >= horaFim) {
    d.setDate(d.getDate() + 1)
    d = setHours(setMinutes(d, inicio.minuto), inicio.hora)
    // Pular fins de semana
    while (!horarioFuncionamento.diasUteis.includes(d.getDay())) {
      d.setDate(d.getDate() + 1)
    }
  }

  return d
}

/**
 * Adiciona horas úteis a uma data
 */
export function adicionarHorasUteis(dataInicio: Date, horas: number): Date {
  let restante = horas * 60 // Converter para minutos
  let atual = proximoHorarioUtil(new Date(dataInicio))

  const inicio = parseHorario(horarioFuncionamento.inicio)
  const fim = parseHorario(horarioFuncionamento.fim)
  const minutosPorDia = (fim.hora * 60 + fim.minuto) - (inicio.hora * 60 + inicio.minuto)

  while (restante > 0) {
    const fimDia = setHours(setMinutes(new Date(atual), fim.minuto), fim.hora)
    const minutosAteFimDia = differenceInMilliseconds(fimDia, atual) / 60000

    if (restante <= minutosAteFimDia) {
      atual = new Date(atual.getTime() + restante * 60000)
      restante = 0
    } else {
      restante -= minutosAteFimDia
      atual.setDate(atual.getDate() + 1)
      atual = setHours(setMinutes(atual, inicio.minuto), inicio.hora)
      // Pular fins de semana
      while (!horarioFuncionamento.diasUteis.includes(atual.getDay())) {
        atual.setDate(atual.getDate() + 1)
      }
    }
  }

  return atual
}

/**
 * Calcula os prazos de SLA baseado na prioridade
 */
export function calcularPrazosSLA(prioridade: PrioridadeType, dataCriacao?: Date): {
  prazoResposta: Timestamp
  prazoResolucao: Timestamp
} {
  const agora = dataCriacao || new Date()
  const config = SLA_PADRAO[prioridade]

  const prazoResposta = adicionarHorasUteis(agora, config.resposta)
  const prazoResolucao = adicionarHorasUteis(agora, config.resolucao)

  return {
    prazoResposta: Timestamp.fromDate(prazoResposta),
    prazoResolucao: Timestamp.fromDate(prazoResolucao),
  }
}

/**
 * Calcula a porcentagem de SLA consumida
 */
export function calcularPorcentagemSLA(criadoEm: Timestamp, prazo: Timestamp): number {
  const agora = new Date()
  const inicio = criadoEm.toDate()
  const fim = prazo.toDate()

  const total = differenceInMilliseconds(fim, inicio)
  const decorrido = differenceInMilliseconds(agora, inicio)

  if (total <= 0) return 100
  const porcentagem = (decorrido / total) * 100
  return Math.min(Math.max(porcentagem, 0), 100)
}

/**
 * Retorna a cor do SLA baseado na porcentagem
 */
export function corSLA(porcentagem: number): { cor: string; bgCor: string; label: string } {
  if (porcentagem >= 100) return { cor: 'text-gray-900', bgCor: 'bg-gray-900', label: 'Estourado' }
  if (porcentagem >= 80) return { cor: 'text-red-600', bgCor: 'bg-red-500', label: 'Crítico' }
  if (porcentagem >= 50) return { cor: 'text-yellow-600', bgCor: 'bg-yellow-500', label: 'Atenção' }
  return { cor: 'text-green-600', bgCor: 'bg-green-500', label: 'OK' }
}
