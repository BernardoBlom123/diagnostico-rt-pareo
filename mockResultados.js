// =============================================================
// DEV BYPASS — Diagnóstico de Prontidão · Reforma Tributária
//
// ATENÇÃO: este bypass NUNCA é ativado em produção.
// Só funciona em localhost / 127.0.0.1 / .local com ?dev=1.
//
// Uso:
//   http://localhost/index.html?dev=1
//   http://localhost/index.html?dev=1&cenario=riscoBaixo
//   http://localhost/index.html?dev=1&cenario=riscoMedio   ← padrão
//   http://localhost/index.html?dev=1&cenario=riscoAlto
//
// Presets disponíveis (campo ?cenario=):
//   riscoBaixo — empresa bem preparada  (score 77.5% · baixo risco)
//   riscoMedio — prontidão parcial      (score 45%   · risco médio · 2 blocos críticos)
//   riscoAlto  — exposição crítica      (score 20%   · alto risco  · todos os blocos críticos)
//
// Scores por bloco (máx 8 pontos cada, total máx 40):
//   riscoBaixo : A=7  B=6  C=7  D=6  E=5  → 31/40
//   riscoMedio : A=4  B=5  C=3  D=2  E=4  → 18/40
//   riscoAlto  : A=2  B=2  C=1  D=1  E=2  →  8/40
// =============================================================

var DEV_PRESETS = {
  riscoBaixo: {
    label: 'Risco Baixo',
    // Score total 31/40 = 77.5% → baixo risco
    // A:87.5%(baixo) B:75%(baixo) C:87.5%(baixo) D:75%(baixo) E:62.5%(médio)
    blockScore: { A: 7, B: 6, C: 7, D: 6, E: 5 }
  },
  riscoMedio: {
    label: 'Risco Médio',
    // Score total 18/40 = 45% → risco médio
    // A:50%(médio) B:62.5%(médio) C:37.5%(alto!) D:25%(alto!) E:50%(médio)
    blockScore: { A: 4, B: 5, C: 3, D: 2, E: 4 }
  },
  riscoAlto: {
    label: 'Risco Alto',
    // Score total 8/40 = 20% → alto risco
    // A:25%(alto) B:25%(alto) C:12.5%(alto) D:12.5%(alto) E:25%(alto)
    blockScore: { A: 2, B: 2, C: 1, D: 1, E: 2 }
  }
}

function isDevEnv () {
  var h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '' || h.endsWith('.local')
}

function initDevBypass () {
  // Checagem dupla: ambiente local E parâmetro ?dev=1
  // Em produção, retorna imediatamente — sem exceções.
  if (!isDevEnv()) return

  var params  = new URLSearchParams(window.location.search)
  if (params.get('dev') !== '1') return

  var cenario = params.get('cenario') || 'riscoMedio'
  var preset  = DEV_PRESETS[cenario] || DEV_PRESETS.riscoMedio
  var label   = preset.label

  // Sobrescreve blockScore global (definido no inline script do index.html)
  // sem disparar nenhuma chamada ao HubSpot.
  Object.assign(blockScore, preset.blockScore)

  // Badge visual — só aparece em dev, nunca em produção
  var badge = document.createElement('div')
  badge.id  = '__dev-badge'
  badge.style.cssText = [
    'position:fixed', 'bottom:16px', 'right:16px', 'z-index:99999',
    'background:#1E2235', 'color:#39A5A7',
    'border:1px solid rgba(57,165,167,.5)', 'border-radius:8px',
    'font:700 11px/1 ui-monospace,monospace',
    'padding:7px 12px', 'letter-spacing:.06em',
    'pointer-events:none', 'user-select:none',
    'box-shadow:0 2px 12px rgba(0,0,0,.35)'
  ].join(';')
  badge.textContent = 'DEV · ' + label
  document.body.appendChild(badge)

  // Vai direto para a tela de resultados, sem formulário nem HubSpot
  showResults()
}
