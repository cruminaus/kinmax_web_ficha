import { useState } from 'react'
import { ArrowsLeftRight, Check, Clock, FileText, Lock, NotePencil, Paperclip, Pulse, Ruler, ShieldCheck, WarningCircle, Info } from '@phosphor-icons/react'

const stateMeta = {
  Vacío: { label: 'Sin contenido', icon: Info, className: 'is-empty' },
  Borrador: { label: 'Borrador editable', icon: NotePencil, className: 'is-draft' },
  Validado: { label: 'Validado y protegido', icon: ShieldCheck, className: 'is-valid' },
  Error: { label: 'Requiere revisión', icon: WarningCircle, className: 'is-error' },
  Deshabilitado: { label: 'No disponible', icon: Lock, className: 'is-disabled' },
}

export function FieldShell({ state = 'Borrador', children, error = 'Revisa este componente antes de continuar.', className = '' }) {
  const meta = stateMeta[state] ?? stateMeta.Borrador
  return <div className={`field-shell ${meta.className} ${className}`} aria-disabled={state === 'Deshabilitado'}>{children}{state === 'Error' && <p className="field-message"><WarningCircle size={16} weight="fill" />{error}</p>}</div>
}

export function Measurement({
  state = 'Borrador',
  title = 'Flexión activa de hombro',
  instrument = 'Goniómetro',
  result = '128',
  unit = '°',
  side = 'Derecho',
  date = '3 oct 2026',
  conditions = 'De pie, movimiento activo',
  onAdd,
}) {
  const empty = state === 'Vacío'
  return <FieldShell state={state} className="measurement-component" error="Falta indicar instrumento, unidad o condiciones de la medición.">
    <div className="measurement-head"><div><span className="field-label">Medición</span><strong>{title}</strong></div><Ruler size={22} /></div>
    {empty ? <p className="muted">Aún no se registra una medición.</p> : <div className="measurement-grid"><span><small>Instrumento</small>{instrument}</span><span><small>Resultado</small>{result} {unit}</span><span><small>Lado</small>{side}</span><span><small>Fecha</small>{date}</span><span className="wide"><small>Condiciones</small>{conditions}</span></div>}
    {onAdd && <button type="button" className="button secondary small" onClick={onAdd} disabled={state === 'Validado' || state === 'Deshabilitado'}><Ruler size={16} />Agregar medición</button>}
  </FieldShell>
}

export function NamedScale({
  state = 'Borrador',
  name = 'Dolor EVA',
  min = 0,
  max = 10,
  initialValue = 3,
  minLabel = 'Sin dolor',
  maxLabel = 'Peor dolor',
  context = '',
}) {
  const [value, setValue] = useState(initialValue)
  const empty = state === 'Vacío'
  return <FieldShell state={state} className="named-scale-component" error="Indica el nombre de la escala y el contexto antes de registrar un valor.">
    <div className="scale-head"><div><span className="field-label">Escala con nombre</span><strong>{name} ({min}–{max})</strong></div><output>{empty ? '—' : `${value} / ${max}`}</output></div>
    <input aria-label={`${name} de ${min} a ${max}`} className="range" type="range" min={min} max={max} value={empty ? min : value} onChange={(event) => setValue(event.target.value)} disabled={state === 'Deshabilitado' || state === 'Validado'} />
    <div className="range-labels"><span>{min} · {minLabel}</span><span>{max} · {maxLabel}</span></div>
    {context && <p className="helper"><strong>Contexto:</strong> {context}</p>}
  </FieldShell>
}

export function DocumentAttachment({
  state = 'Borrador',
  title = 'Informe_ecografia_hombro.pdf',
  meta = 'Informe · 1 oct 2026 · Centro Imagen Sur',
  association = 'Episodio Hombro derecho · E2 Evaluación',
  access = 'clinical',
  onOpen,
}) {
  const empty = state === 'Vacío'
  return <FieldShell state={state} className="document-attachment" error="El archivo supera el máximo permitido o no puede leerse.">
    <div className="attachment-row"><span className="file-icon"><FileText size={24} /></span><div className="grow"><span className="field-label">Documento adjunto</span><strong>{empty ? 'Sin documentos asociados' : title}</strong><p>{empty ? 'Adjunta solo si existe y es pertinente.' : meta}</p></div><button type="button" className="button secondary small" onClick={onOpen} disabled={state === 'Deshabilitado'}><Paperclip size={17} />{empty ? 'Adjuntar' : 'Ver archivo'}</button></div>
    {!empty && <p className="association">Asociado a: {association} · Acceso {access === 'clinical' ? 'clínico' : 'administrativo'}</p>}
  </FieldShell>
}

export function EpisodeSelector({
  state = 'Borrador',
  episode = 'Hombro derecho',
  episodeId = 'EP-003',
  meta = 'Activo desde 26 ago 2026',
  action = 'Cambiar episodio',
  onSelect,
}) {
  return <FieldShell state={state}><button type="button" className="episode-demo" disabled={state === 'Deshabilitado'} onClick={onSelect}><div><span className="field-label">Selector de episodio</span><strong>{episode}</strong><small>{episodeId} · {meta}</small></div><span className="episode-demo-action"><ArrowsLeftRight size={22} /><b>{action}</b></span></button>{state === 'Error' && <p className="helper">Confirma el episodio antes de registrar información clínica.</p>}</FieldShell>
}

export function LinkedClarification({
  state = 'Borrador',
  title = 'Agregado posterior al registro original',
  text = 'Se precisa que la carga registrada corresponde a banda elástica amarilla.',
  audit = 'Original protegido · Autor y fecha visibles · Motivo obligatorio',
}) {
  const empty = state === 'Vacío'
  return <FieldShell state={state} error="Debes indicar el motivo de la aclaración."><div className="component-title"><NotePencil size={22} /><div><span className="field-label">Aclaración vinculada</span><strong>{empty ? 'Sin aclaraciones' : title}</strong></div></div>{!empty && <blockquote>{text}</blockquote>}<p className="audit-line">{audit}</p></FieldShell>
}

export function DoseIndicator({
  state = 'Borrador',
  title = 'Rotación externa con banda',
  values = [['Series', '3'], ['Repeticiones', '10'], ['Carga', 'Banda amarilla'], ['Descanso', '60 s']],
  label = 'Dosis prevista',
}) {
  const empty = state === 'Vacío'
  return <FieldShell state={state} className="dose-indicator" error="La dosis necesita valor y unidad antes de guardarse.">
    <div className="component-title"><Pulse size={22} /><div><span className="field-label">Indicador de dosis · {label}</span><strong>{title}</strong></div></div>
    <div className="dose-grid">{values.map(([name, value]) => <span key={name}><small>{name}</small>{empty ? '—' : value}</span>)}</div>
  </FieldShell>
}

export function ConsentBlock({
  state = 'Borrador',
  procedure = 'Procedimiento configurable',
  decision = 'Acepta',
  requiredWritten = false,
  signed = false,
  minor = false,
  representative = 'Paula Medina · madre',
  support = 'Identidad y relación verificadas',
  onDecision,
}) {
  const empty = state === 'Vacío'
  const disabled = state === 'Deshabilitado' || state === 'Validado'
  const blocked = requiredWritten && decision === 'Acepta' && !signed
  const options = [
    ['Acepta', Check],
    ['Rechaza', WarningCircle],
    ['Difiere', Clock],
  ]
  return <FieldShell state={state} className="consent-block" error="Falta registrar decisión, firmante o respaldo exigible.">
    <div className="component-title"><ShieldCheck size={22} /><div><span className="field-label">Bloque de consentimiento</span><strong>{empty ? 'Sin consentimiento registrado' : procedure}</strong></div></div>
    <div className="notice neutral"><Info size={17} /><span><strong>Regla configurable.</strong> La clínica debe definir qué procedimientos requieren consentimiento escrito.</span></div>
    {!empty && <>
      <div className="decision-row" role="group" aria-label="Decisión informada">{options.map(([option, Icon]) => <button type="button" key={option} className={`choice ${decision === option ? 'selected' : ''}`} disabled={disabled} onClick={() => onDecision?.(option)}><Icon size={15} weight="bold" />{option}</button>)}</div>
      <div className="consent-facts"><span><small>Modalidad exigida</small>{requiredWritten ? 'Escrita' : 'Verbal o escrita'}</span><span><small>Firmante</small>{minor ? representative : 'Paciente'}</span><span><small>Documento</small>{signed ? 'Registrado y asociado' : requiredWritten ? 'Pendiente' : 'No requerido'}</span></div>
      {minor && <p className="helper"><strong>Respaldo de representación:</strong> {support}</p>}
      {blocked && <div className="consent-blocker"><Lock size={18} /><div><strong>Plan aún no listo para ejecutar</strong><p>Este procedimiento está configurado para exigir consentimiento escrito. Registra el documento antes de aplicarlo.</p></div></div>}
      {decision === 'Rechaza' && <div className="consent-branch"><strong>Rechazo informado</strong><p>Registra alternativas discutidas y conducta acordada; no programes la intervención rechazada.</p></div>}
      {decision === 'Difiere' && <div className="consent-branch pending"><strong>Pendiente de decisión</strong><p>Conserva el plan en borrador y acuerda cuándo retomar la conversación.</p></div>}
    </>}
  </FieldShell>
}

export function ComparisonTable({
  state = 'Borrador',
  variant = 'same',
  title = 'Flexión activa de hombro',
  initial = { value: '128°', instrument: 'Goniómetro', unit: 'grados', side: 'Derecho', conditions: 'De pie, movimiento activo', date: '3 oct 2026' },
  current = { value: '146°', instrument: 'Goniómetro', unit: 'grados', side: 'Derecho', conditions: 'De pie, movimiento activo', date: '4 nov 2026' },
    difference = '+18°',
    explanation = 'Se utiliza QuickDASH para incorporar función informada por la paciente.',
    initialLabel = 'Valor inicial · E2',
    currentLabel = 'Valor actual · E5',
}) {
  const empty = state === 'Vacío'
  const disabled = state === 'Deshabilitado' || state === 'Validado'
  const different = variant === 'different'
  const missing = variant === 'missing'
  return <FieldShell state={state} className={`comparison-component variant-${variant}`} error="La medición actual necesita instrumento, unidad, lado y condiciones.">
    <div className="comparison-component-head"><div><span className="field-label">Tabla comparativa</span><strong>{title}</strong></div><span className={`comparison-mode ${different || missing ? 'warning' : 'valid'}`}>{missing ? 'Línea de base no disponible' : different ? 'No comparable directamente' : 'Mismo instrumento'}</span></div>
    {different && <div className="comparison-warning"><WarningCircle size={18} /><div><strong>Instrumentos distintos</strong><p>Los valores se muestran lado a lado, sin calcular diferencia ni sugerir una comparación directa.</p></div></div>}
    {missing && <div className="comparison-warning neutral"><Info size={18} /><div><strong>Valor inicial no disponible</strong><p>No se infiere un resultado. Registra el motivo y conserva la medición actual.</p></div></div>}
    <div className="comparison-real-table" role="table" aria-label={`Comparación de ${title}`}>
      <div className="comparison-real-row header" role="row"><span>Dato</span><span>{initialLabel}</span><span>{currentLabel}</span>{!different && !missing && <span>Diferencia</span>}</div>
      <div className="comparison-real-row primary" role="row"><strong>Resultado</strong><span>{empty || missing ? 'No disponible' : initial.value}</span><span>{empty ? 'Pendiente' : current.value}</span>{!different && !missing && <strong className="difference">{empty ? '—' : difference}</strong>}</div>
      <div className="comparison-real-row" role="row"><strong>Instrumento</strong><span>{missing ? 'No disponible' : initial.instrument}</span><span>{different ? 'QuickDASH' : current.instrument}</span>{!different && !missing && <span>Coincide</span>}</div>
      <div className="comparison-real-row" role="row"><strong>Unidad</strong><span>{missing ? 'No disponible' : initial.unit}</span><span>{different ? 'puntaje / 100' : current.unit}</span>{!different && !missing && <span>Coincide</span>}</div>
      <div className="comparison-real-row" role="row"><strong>Lado</strong><span>{missing ? 'No disponible' : initial.side}</span><span>{current.side}</span>{!different && !missing && <span>Coincide</span>}</div>
      <div className="comparison-real-row conditions" role="row"><strong>Condiciones</strong><span>{missing ? 'No disponible' : initial.conditions}</span><span>{different ? 'Cuestionario autoadministrado, versión chilena' : current.conditions}</span>{!different && !missing && <span>Equivalentes</span>}</div>
      <div className="comparison-real-row" role="row"><strong>Fecha</strong><span>{missing ? 'No disponible' : initial.date}</span><span>{current.date}</span>{!different && !missing && <span>—</span>}</div>
    </div>
    {(different || missing) && <label className="comparison-explanation">Explicación obligatoria<textarea disabled={disabled} defaultValue={missing ? 'E2 fue interrumpida antes de obtener esta medición.' : explanation} /></label>}
  </FieldShell>
}
