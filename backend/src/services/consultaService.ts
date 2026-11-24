import { db } from '../config/database'

export class ConsultaService {
  getSaldoAcumulado(usuarioId: number, ateData: string) {
    const stmt = db.prepare(`
      SELECT coalesce(sum(CASE WHEN tipo = 'renda'
          THEN valor_centavos ELSE -valor_centavos END), 0) AS saldo_centavos
      FROM lancamentos
      WHERE usuario_id = :usuario_id AND data <= :ate_data
    `)

    const result = stmt.get({ usuario_id: usuarioId, ate_data: ateData })
    return result as { saldo_centavos: number }
  }

  getTotaisMensais(usuarioId: number, inicioMes: string, proximoMes: string) {
    const stmt = db.prepare(`
      WITH totais AS (
          SELECT
              coalesce(sum(CASE WHEN tipo = 'renda' THEN valor_centavos ELSE 0 END), 0) AS renda,
              coalesce(sum(CASE WHEN tipo = 'gasto' THEN valor_centavos ELSE 0 END), 0) AS gasto
          FROM lancamentos
          WHERE usuario_id = :usuario_id AND data >= :inicio_mes AND data < :proximo_mes
      )
      SELECT renda AS renda_centavos, gasto AS gasto_centavos,
          renda - gasto AS resultado_centavos,
          CASE WHEN renda > 0 THEN round(100.0 * gasto / renda, 2) END AS comprometimento_percentual
      FROM totais
    `)

    const result = stmt.get({
      usuario_id: usuarioId,
      inicio_mes: inicioMes,
      proximo_mes: proximoMes,
    })

    return result as {
      renda_centavos: number
      gasto_centavos: number
      resultado_centavos: number
      comprometimento_percentual: number | null
    }
  }

  getGastosPorCategoria(usuarioId: number, inicioMes: string, proximoMes: string) {
    const stmt = db.prepare(`
      WITH gastos AS (
          SELECT c.id, c.nome, sum(l.valor_centavos) AS valor_centavos
          FROM lancamentos l
          JOIN categorias c ON c.id = l.categoria_id
          WHERE l.usuario_id = :usuario_id AND l.tipo = 'gasto'
              AND l.data >= :inicio_mes AND l.data < :proximo_mes
          GROUP BY c.id, c.nome
      )
      SELECT id, nome, valor_centavos,
          round(100.0 * valor_centavos / (SELECT sum(valor_centavos) FROM gastos), 2) AS percentual
      FROM gastos ORDER BY valor_centavos DESC, id
    `)

    const rows = stmt.all({
      usuario_id: usuarioId,
      inicio_mes: inicioMes,
      proximo_mes: proximoMes,
    })

    return rows as Array<{
      id: number
      nome: string
      valor_centavos: number
      percentual: number | null
    }>
  }

  getLancamentosRecentes(usuarioId: number, ateData: string, limite: number) {
    const stmt = db.prepare(`
      SELECT l.id, l.tipo, l.descricao, c.nome AS categoria, l.data,
          l.valor_centavos, l.forma_pagamento, l.observacao
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      WHERE l.usuario_id = :usuario_id AND l.data <= :ate_data
      ORDER BY l.data DESC, l.id DESC LIMIT :limite
    `)

    const rows = stmt.all({
      usuario_id: usuarioId,
      ate_data: ateData,
      limite,
    })

    return rows as Array<{
      id: number
      tipo: 'renda' | 'gasto'
      descricao: string
      categoria: string
      data: string
      valor_centavos: number
      forma_pagamento: string | null
      observacao: string | null
    }>
  }

  getEvolucaoSeisMeses(usuarioId: number, inicioMes: string) {
    const stmt = db.prepare(`
      WITH RECURSIVE meses(mes, numero) AS (
          SELECT date(:inicio_mes, '-5 months'), 1
          UNION ALL
          SELECT date(mes, '+1 month'), numero + 1 FROM meses WHERE numero < 6
      )
      SELECT substr(m.mes, 1, 7) AS mes,
          coalesce(sum(CASE WHEN l.tipo = 'renda' THEN l.valor_centavos ELSE 0 END), 0) AS renda_centavos,
          coalesce(sum(CASE WHEN l.tipo = 'gasto' THEN l.valor_centavos ELSE 0 END), 0) AS gasto_centavos,
          coalesce(sum(CASE WHEN l.tipo = 'renda' THEN l.valor_centavos
              WHEN l.tipo = 'gasto' THEN -l.valor_centavos ELSE 0 END), 0) AS resultado_centavos
      FROM meses m
      LEFT JOIN lancamentos l ON l.usuario_id = :usuario_id
          AND l.data >= m.mes AND l.data < date(m.mes, '+1 month')
      GROUP BY m.mes ORDER BY m.mes
    `)

    const rows = stmt.all({
      usuario_id: usuarioId,
      inicio_mes: inicioMes,
    })

    return rows as Array<{
      mes: string
      renda_centavos: number
      gasto_centavos: number
      resultado_centavos: number
    }>
  }
}

export const consultaService = new ConsultaService()
