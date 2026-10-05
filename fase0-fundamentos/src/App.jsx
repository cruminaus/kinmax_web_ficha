import { useMemo, useState } from 'react'
import {
  ActivityIcon, ArrowsLeftRight, CalendarBlank, CaretRight,
  Check, CheckCircle, Clock, FileText, Info, ListBullets, Lock,
  NotePencil, Paperclip, Pulse, Ruler, Scales, ShieldCheck, SignOut,
  Stack, User, WarningCircle, X, PersonArmsSpread,
} from '@phosphor-icons/react'
import { E4Session } from './E4Session.jsx'
import { E2Evaluation } from './E2Evaluation.jsx'
import { E1Intake } from './E1Intake.jsx'
import { E3Planning } from './E3Planning.jsx'
import { E5Reevaluation } from './E5Reevaluation.jsx'
import { E6Closure } from './E6Closure.jsx'
import { ComparisonTable, ConsentBlock as Consent, DocumentAttachment as Attachment, DoseIndicator, EpisodeSelector as EpisodeSelectorDemo, FieldShell, LinkedClarification as Clarification, Measurement, NamedScale } from './ClinicalComponents.jsx'

const stages = [
  { id: 'E1', label: 'Ingreso', status: 'Validado', icon: User },
  { id: 'E2', label: 'Evaluación', status: 'Validado', icon: ActivityIcon },
  { id: 'E3', label: 'Plan', status: 'Validado', icon: ListBullets },
  { id: 'E4', label: 'Sesión', status: 'Borrador', icon: NotePencil },
  { id: 'E5', label: 'Reevaluación', status: 'Pendiente', icon: Scales },
  { id: 'E6', label: 'Cierre', status: 'Pendiente', icon: CheckCircle },
]

const states = ['Vacío', 'Borrador', 'Validado', 'Error', 'Deshabilitado']
const stateMeta = {
  Vacío: { label: 'Sin contenido', icon: Info, className: 'is-empty' },
  Borrador: { label: 'Borrador editable', icon: NotePencil, className: 'is-draft' },
  Validado: { label: 'Validado y protegido', icon: ShieldCheck, className: 'is-valid' },
  Error: { label: 'Requiere revisión', icon: WarningCircle, className: 'is-error' },
  Deshabilitado: { label: 'No disponible', icon: Lock, className: 'is-disabled' },
}

function StatusBadge({ status }) {
  const meta = status === 'Borrador'
    ? { icon: NotePencil, text: 'Borrador', className: 'draft' }
    : status === 'Pendiente de decisión'
      ? { icon: Clock, text: 'Pendiente de decisión', className: 'pending' }
    : status === 'Acordado'
      ? { icon: CheckCircle, text: 'Acordado', className: 'valid' }
    : status === 'Datos administrativos completos'
      ? { icon: CheckCircle, text: 'Datos admin. completos', className: 'valid' }
    : status === 'Validado asistencialmente'
      ? { icon: ShieldCheck, text: 'Validado asistencialmente', className: 'valid' }
    : status === 'Interrumpida'
      ? { icon: Clock, text: 'Interrumpida', className: 'pending' }
    : status === 'Con plan actualizado'
      ? { icon: CheckCircle, text: 'Plan actualizado', className: 'valid' }
    : status === 'Cerrado'
      ? { icon: CheckCircle, text: 'Cerrado', className: 'valid' }
    : status === 'Cerrado administrativamente'
      ? { icon: Lock, text: 'Cerrado administrativamente', className: 'valid' }
    : status === 'Pendiente de contacto'
      ? { icon: Clock, text: 'Pendiente de contacto', className: 'pending' }
    : status === 'Validado'
      ? { icon: ShieldCheck, text: 'Validado', className: 'valid' }
      : { icon: Clock, text: 'Pendiente', className: 'pending' }
  const StatusIcon = meta.icon
  return <span className={`status-badge ${meta.className}`}><StatusIcon size={16} weight="bold" />{meta.text}</span>
}

function PersistentHeader({ onEpisode, stage = 'E4 · Sesión y evolución', detail = 'Atención del 3 oct 2026', recordState = 'Borrador', patientName = 'Camila Rojas M.', document = 'RUT 19.842.731-6', age = '34 años', file = 'Ficha FC-02841', episode = 'Hombro derecho', episodeId = 'Episodio EP-003', professional = 'Klga. Valentina Soto', professionalDetail = 'Registrando ahora', episodeClosed = false }) {
  return <header className={`patient-header ${episodeClosed ? 'episode-is-closed' : ''}`}>
    <div className="patient-primary">
      <span className="avatar" aria-hidden="true">CR</span>
      <div><span className="eyebrow">Paciente activo</span><h1>{patientName}</h1><div className="patient-meta"><span>{document}</span><span>{age}</span><span>{file}</span></div></div>
    </div>
    <div className="context-cluster">
      <button className="context-item episode-trigger" onClick={onEpisode}><span className="context-label">{episodeClosed ? 'Episodio consultado' : 'Episodio activo'}</span><strong>{episode}</strong><span className="context-sub">{episodeId}</span>{episodeClosed&&<span className="header-closed-chip"><Lock size={13}/>Cerrado · solo lectura</span>}<span className="change-action"><ArrowsLeftRight size={18} />Cambiar</span></button>
      <div className="context-item"><span className="context-label">Etapa actual</span><strong>{stage}</strong><span className="context-sub">{detail}</span></div>
      <div className="context-item compact-context"><span className="context-label">Estado del registro</span><StatusBadge status={recordState === 'Validada' ? 'Validado' : recordState} /><span className="context-sub">{recordState === 'Interrumpida' ? 'Guardado parcial 12:18' : recordState === 'Cerrado' || recordState === 'Cerrado administrativamente' ? 'Validado 18 nov 2026 · 11:42' : 'Autoguardado 12:18'}</span></div>
      <div className="context-item compact-context"><span className="context-label">Profesional</span><strong>{professional}</strong><span className="context-sub">{episodeClosed ? 'Cierre validado' : professionalDetail}</span></div>
    </div>
  </header>
}

function EpisodeTimeline({ activeStage, onStage }) {
  return <nav className="episode-timeline" aria-label="Línea de tiempo del episodio">
    {stages.map((stage) => {
      const StageIcon = stage.icon
      const isActive = activeStage === stage.id
      return <button key={stage.id} className={`stage ${isActive ? 'active' : ''}`} onClick={() => onStage(stage.id)} aria-current={isActive ? 'step' : undefined}><span className="stage-symbol"><StageIcon size={19} weight={isActive ? 'fill' : 'regular'} /></span><span className="stage-copy"><b>{stage.id}</b><span>{stage.label}</span></span><StatusBadge status={stage.status} /></button>
    })}
  </nav>
}

function StateBanner({ state }) {
  const meta = stateMeta[state]
  const StateIcon = meta.icon
  return <div className={`state-banner ${meta.className}`}><StateIcon size={17} weight="bold" /><span>{meta.label}</span></div>
}


function ClinicalSeparator({ state }) {
  return <FieldShell state={state} error="El análisis debe diferenciarse del relato y del hallazgo."><div className="clinical-sections"><section><span>Relato</span><p>{state === 'Vacío' ? 'Sin información' : '“Hoy puedo alcanzar un estante con menos molestia”.'}</p></section><section><span>Hallazgo</span><p>{state === 'Vacío' ? 'No evaluado' : 'Elevación activa 128°, sin compensación visible.'}</p></section><section><span>Análisis</span><p>{state === 'Vacío' ? 'Pendiente' : 'Mejora funcional respecto del registro previo.'}</p></section></div></FieldShell>
}


const components = [
  ['Medición', 'Instrumento, resultado, unidad, lado, condiciones y fecha.', Measurement],
  ['Documento adjunto', 'Archivo con procedencia y asociación clínica explícita.', Attachment],
  ['Bloque de consentimiento', 'Información, decisión, firmante y documento.', Consent],
  ['Selector de episodio', 'Cambio deliberado sin perder el contexto activo.', EpisodeSelectorDemo],
  ['Aclaración vinculada', 'Agregado posterior sin modificar el original.', Clarification],
  ['Relato / hallazgo / análisis', 'Tres fuentes de información que no se mezclan.', ClinicalSeparator],
  ['Escala con nombre', 'Valor siempre acompañado por instrumento y rango.', NamedScale],
  ['Tabla comparativa', 'Comparación trazable bajo condiciones equivalentes.', ComparisonTable],
  ['Indicador de dosis', 'Series, repeticiones, carga, tiempo y descanso.', DoseIndicator],
]

function Foundations({ activeStage, onStage }) {
  const [emptyValue, setEmptyValue] = useState('No evaluado')
  return <div className="page-stack">
    <section className="hero-section"><div><span className="section-kicker">Fase 0 · Fundamentos</span><h2>Contexto clínico antes que formulario</h2><p>La pantalla mantiene visible quién es la persona, en qué episodio se trabaja y qué registro se está editando. El flujo acompaña la atención; no obliga a completarla de manera lineal.</p></div><div className="hero-actions"><button className="button primary"><NotePencil size={19} />Continuar registro de sesión</button><button className="button secondary"><Stack size={19} />Ver resumen del episodio</button></div></section>
    <section className="surface flow-section"><div className="section-heading"><div><span className="section-kicker">Modelo de información</span><h3>Paciente → episodio → atención → documento</h3></div><span className="note-chip"><Info size={16} />Un paciente puede tener varios episodios</span></div><div className="entity-flow" aria-label="Mapa del modelo de información"><article><span className="entity-icon"><User size={23} /></span><small>Nivel longitudinal</small><strong>Paciente</strong><p>Identidad y antecedentes compartidos.</p></article><CaretRight className="flow-arrow" size={22} /><article className="current"><span className="entity-icon"><Stack size={23} /></span><small>Ciclo clínico activo</small><strong>Episodio</strong><p>Hombro derecho · EP-003</p></article><CaretRight className="flow-arrow" size={22} /><article><span className="entity-icon"><CalendarBlank size={23} /></span><small>Unidad de registro</small><strong>Atención</strong><p>Sesión del 3 oct 2026.</p></article><CaretRight className="flow-arrow" size={22} /><article><span className="entity-icon"><FileText size={23} /></span><small>Con procedencia</small><strong>Documento</strong><p>Asociado a episodio o atención.</p></article></div><div className="transition-note"><ArrowsLeftRight size={19} /><p><strong>Flujo no lineal:</strong> E1, E2, E3 y la primera E4 pueden ocurrir el mismo día. E5 puede iniciarse por fecha, cambio clínico, falta de progreso o preparación del alta.</p></div></section>
    <section className="surface timeline-section"><div className="section-heading"><div><span className="section-kicker">Línea de tiempo del episodio</span><h3>Seis etapas, acceso no lineal</h3></div><p className="section-aside">Selecciona una etapa para ver su contexto. No hay porcentaje de avance.</p></div><EpisodeTimeline activeStage={activeStage} onStage={onStage} /><div className="stage-detail"><span className="stage-detail-code">{activeStage}</span><div><strong>{stages.find(s => s.id === activeStage)?.label}</strong><p>La navegación conserva el episodio activo y advierte antes de abandonar cambios sin validar.</p></div><button className="button secondary small">Abrir etapa <CaretRight size={16} /></button></div></section>
    <section className="two-column"><article className="surface empty-values"><div className="section-heading"><div><span className="section-kicker">Vacíos con significado</span><h3>No completar también comunica</h3></div></div><div className="empty-choice-grid">{['No evaluado', 'No aplica', 'No informado', 'Pendiente'].map((value) => <button key={value} onClick={() => setEmptyValue(value)} className={emptyValue === value ? 'selected' : ''}><span>{value}</span><small>{value === 'No evaluado' ? 'Se pudo evaluar y no se hizo.' : value === 'No aplica' ? 'No corresponde al caso.' : value === 'No informado' ? 'La fuente no entrega el dato.' : 'Se completará después.'}</small></button>)}</div><div className="selection-result"><CheckCircle size={20} /><span>Valor registrado: <strong>{emptyValue}</strong></span></div></article><article className="surface alarm-demo"><div className="section-heading"><div><span className="section-kicker">Patrón crítico</span><h3>Signos de alarma: tres estados</h3></div></div><div className="tri-state"><button><CheckCircle size={19} />Ausente</button><button><WarningCircle size={19} />Presente</button><button className="selected"><Info size={19} />No investigado</button></div><p className="helper strong-helper"><ShieldCheck size={17} />Una casilla sin marcar nunca equivale a “descartado”.</p></article></section>
  </div>
}

function Library() {
  const [componentState, setComponentState] = useState('Borrador')
  return <div className="page-stack"><section className="library-intro"><div><span className="section-kicker">Librería clínica</span><h2>Nueve patrones reutilizables</h2><p>Cada patrón comparte el mismo contrato de estados: vacío, borrador, validado, error y deshabilitado.</p></div><div className="state-switcher" role="group" aria-label="Estado a previsualizar">{states.map((state) => <button key={state} className={componentState === state ? 'active' : ''} onClick={() => setComponentState(state)}>{state}</button>)}</div></section><div className="current-state-row"><StateBanner state={componentState} /><p>Todos los componentes se muestran ahora en estado <strong>{componentState.toLowerCase()}</strong>.</p></div><section className="component-grid">{components.map(([name, description, Component], index) => <article className="component-card" key={name}><header><span className="component-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{name}</h3><p>{description}</p></div></header><Component state={componentState} /></article>)}</section></div>
}

function VisualStyle() {
  const colors = [['Tinta clínica', '#14244A', 'Texto principal'], ['Azul acción', '#145EEB', 'Acciones y foco'], ['Verde validado', '#157A55', 'Registro validado'], ['Ocre pendiente', '#A45E00', 'Pendiente'], ['Coral error', '#B73535', 'Error'], ['Superficie fría', '#F5F7FB', 'Fondo']]
  return <div className="page-stack"><section className="style-hero"><span className="section-kicker">Sistema visual</span><h2>Claro, sobrio y preparado para el box</h2><p>La jerarquía nace del espaciado y la tipografía. El color confirma significados, pero nunca trabaja solo.</p></section><section className="surface tokens-section"><div className="section-heading"><div><span className="section-kicker">Color</span><h3>Paleta funcional</h3></div><span className="note-chip"><PersonArmsSpread size={16} />Contraste objetivo WCAG AA</span></div><div className="color-grid">{colors.map(([name, value, use]) => <div className="color-token" key={name}><span style={{ background: value }}></span><strong>{name}</strong><code>{value}</code><small>{use}</small></div>)}</div></section><section className="style-grid"><article className="surface type-spec"><span className="section-kicker">Tipografía</span><h3>Inter, sistema sans-serif</h3><div className="type-sample display">Contexto clínico seguro</div><div className="type-sample heading">E4 · Sesión y evolución</div><div className="type-sample body">Texto base de 16 px para lectura cómoda en tablet y notebook.</div><div className="type-sample label">ETIQUETA · 12 PX · SEMIBOLD</div></article><article className="surface spacing-spec"><span className="section-kicker">Espaciado</span><h3>Escala base de 4 px</h3><div className="spacing-bars">{[['4', 4], ['8', 8], ['12', 12], ['16', 16], ['24', 24], ['32', 32], ['48', 48]].map(([label, width]) => <div key={label}><span>{label}</span><i style={{ width: width * 3 }}></i></div>)}</div><p>Áreas táctiles: mínimo 44 × 44 px. Radio: 8 px en campos, 12 px en superficies. Sombra solo para capas temporales.</p></article></section><section className="surface decisions"><div className="section-heading"><div><span className="section-kicker">Supuestos y pendientes</span><h3>Decisiones que la clínica debe confirmar</h3></div></div><div className="decision-columns"><div><h4>Supuestos de diseño</h4><ul><li>Tablet vertical como referencia principal; escritorio amplía columnas.</li><li>Autoguardado disponible para borradores.</li><li>Los permisos se confirman por rol, paciente, periodo y acción.</li></ul></div><div><h4>Preguntas abiertas</h4><ul><li>¿Firma con clave, firma electrónica, huella o identificación de usuario?</li><li>¿Consentimientos en pantalla o papel escaneado?</li><li>¿Existe agenda para vincular número de sesión?</li><li>¿Habrá atención remota o a domicilio?</li></ul></div></div><div className="notice pending"><Clock size={18} />Consentimientos, firma e interoperabilidad quedan configurables y marcados como pendientes; el diseño no decide su validez legal.</div></section></div>
}

function EpisodeModal({ onClose }) {
  const [selected, setSelected] = useState('EP-003')
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="episode-title"><header><div><span className="section-kicker">Cambio seguro de contexto</span><h2 id="episode-title">Seleccionar episodio</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={22} /></button></header><p>Confirma el problema antes de continuar. El borrador actual se mantiene asociado a “Hombro derecho”.</p><div className="episode-options"><button className={selected === 'EP-003' ? 'selected' : ''} onClick={() => setSelected('EP-003')}><span><strong>Hombro derecho</strong><small>EP-003 · Activo · Inicio 26 ago 2026</small></span><StatusBadge status="Borrador" /></button><button className={selected === 'EP-002' ? 'selected' : ''} onClick={() => setSelected('EP-002')}><span><strong>Rodilla izquierda</strong><small>EP-002 · Cerrado · 4 mar–16 may 2026</small></span><StatusBadge status="Validado" /></button></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancelar</button><button className="button primary" onClick={onClose}>Confirmar episodio</button></div></section></div>
}

export function App() {
  const initialParams = new URLSearchParams(window.location.search)
  const [tab, setTab] = useState(initialParams.get('tab') || 'e6')
  const requestedViewport = new URLSearchParams(window.location.search).get('viewport')
  const [viewport, setViewport] = useState(requestedViewport === 'desktop' ? 'desktop' : 'tablet')
  const [activeStage, setActiveStage] = useState('E4')
  const [episodeOpen, setEpisodeOpen] = useState(false)
  const [e2RecordState, setE2RecordState] = useState(new URLSearchParams(window.location.search).get('state') || 'Borrador')
  const [e1RecordState, setE1RecordState] = useState(new URLSearchParams(window.location.search).get('state') || 'Borrador')
  const [e3RecordState, setE3RecordState] = useState(initialParams.get('state') || 'Borrador')
  const [e5RecordState, setE5RecordState] = useState(initialParams.get('state') || 'Borrador')
  const [e6RecordState, setE6RecordState] = useState(initialParams.get('state') || 'Borrador')
  const screenName = useMemo(() => tab === 'e1' ? `E1_Ingreso_Apertura_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'e2' ? `E2_Evaluacion_Inicial_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'e3' ? `E3_Planificacion_Acuerdo_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'e4' ? `E4_Registro_Sesion_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'e5' ? `E5_Reevaluacion_Ajuste_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'e6' ? `E6_Alta_Cierre_${viewport === 'desktop' ? 'Desktop' : 'Tablet'}` : tab === 'fundamentos' ? 'F0_Fundamentos_Tablet' : tab === 'componentes' ? 'F0_Libreria_Componentes' : 'F0_Estilo_Tokens', [tab, viewport])
  const clinicalStage = tab === 'e1' ? 'E1 · Ingreso y apertura' : tab === 'e2' ? 'E2 · Evaluación inicial' : tab === 'e3' ? 'E3 · Planificación y acuerdo' : tab === 'e5' ? 'E5 · Reevaluación y ajuste' : tab === 'e6' ? 'E6 · Alta o cierre' : 'E4 · Sesión y evolución'
  const clinicalDetail = tab === 'e1' ? 'Registro del 3 oct 2026' : tab === 'e2' ? 'Evaluación del 3 oct 2026' : tab === 'e3' ? 'Plan v1 · 3 oct 2026' : tab === 'e5' ? 'Reevaluación del 4 nov 2026' : tab === 'e6' ? 'Cierre del 18 nov 2026' : 'Atención del 3 oct 2026'
  const clinicalState = tab === 'e1' ? e1RecordState : tab === 'e2' ? e2RecordState : tab === 'e3' ? e3RecordState : tab === 'e5' ? e5RecordState : tab === 'e6' ? e6RecordState : 'Borrador'
  const stageButtons = [
    ['e1', User, 'E1 Ingreso'],
    ['e2', ActivityIcon, 'E2 Evaluación'],
    ['e3', ListBullets, 'E3 Plan'],
    ['e4', NotePencil, 'E4 Sesión'],
    ['e5', Scales, 'E5 Reevaluación'],
    ['e6', CheckCircle, 'E6 Cierre'],
  ]
  return <div className="prototype-shell">
    <aside className="prototype-toolbar"><div className="brand"><span className="brand-mark"><Pulse size={22} weight="bold" /></span><div><strong>FichaKin</strong><small>Prototipo · Fases 0–6</small></div></div><nav aria-label="Secciones del prototipo">{stageButtons.map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={20} />{label}</button>)}<button className={tab === 'fundamentos' ? 'active' : ''} onClick={() => setTab('fundamentos')}><Stack size={20} />Fundamentos</button><button className={tab === 'componentes' ? 'active' : ''} onClick={() => setTab('componentes')}><ListBullets size={20} />Componentes</button><button className={tab === 'estilo' ? 'active' : ''} onClick={() => setTab('estilo')}><Scales size={20} />Estilo y tokens</button></nav><div className="toolbar-foot"><div className="permission-note"><Lock size={17} /><span><strong>Rol simulado</strong>{tab === 'e1' ? 'Recepción / admisión' : 'Kinesiólogo tratante'}</span></div><button><SignOut size={18} />Salir del prototipo</button></div></aside>
    <main className="workspace"><div className="preview-bar"><div><span className="live-dot"></span><strong>{screenName}</strong><span>Opción 3 · Contexto Primero</span></div><div className="viewport-toggle"><button className={viewport === 'tablet' ? 'active' : ''} onClick={() => setViewport('tablet')}>Tablet</button><button className={viewport === 'desktop' ? 'active' : ''} onClick={() => setViewport('desktop')}>Escritorio</button></div></div><div className={`app-frame viewport-${viewport}`}><PersistentHeader onEpisode={() => setEpisodeOpen(true)} stage={clinicalStage} detail={clinicalDetail} recordState={clinicalState} patientName={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Paciente por identificar' : 'Camila Rojas Medina') : undefined} document={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Documento pendiente' : 'Pasaporte PA-843721') : undefined} age={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Edad pendiente' : '34 años') : undefined} file={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Ficha sin crear' : 'Ficha FC-03112') : undefined} episode={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Sin episodio' : 'Hombro derecho') : undefined} episodeId={tab === 'e1' ? (e1RecordState === 'Borrador' ? 'Pendiente de asignar' : tab === 'e6' && (e6RecordState === 'Cerrado' || e6RecordState === 'Cerrado administrativamente') ? 'Episodio EP-003 · Cerrado' : 'Episodio EP-004') : tab === 'e6' && (e6RecordState === 'Cerrado' || e6RecordState === 'Cerrado administrativamente') ? 'Episodio EP-003 · Cerrado' : undefined} professional={tab === 'e1' ? 'Recepción · Marcela Díaz' : undefined} professionalDetail={tab === 'e1' ? 'Ingreso administrativo' : tab === 'e3' ? 'Planificando con la paciente' : tab === 'e6' ? 'Preparando cierre' : undefined} episodeClosed={tab === 'e6' && (e6RecordState === 'Cerrado' || e6RecordState === 'Cerrado administrativamente')} />
      <div className="mobile-nav">{stageButtons.map(([id, , label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}<button className={tab === 'fundamentos' ? 'active' : ''} onClick={() => setTab('fundamentos')}>Fundamentos</button><button className={tab === 'componentes' ? 'active' : ''} onClick={() => setTab('componentes')}>Componentes</button><button className={tab === 'estilo' ? 'active' : ''} onClick={() => setTab('estilo')}>Estilo</button></div>
      <div className="app-content">{tab === 'e1' && <E1Intake onRecordState={setE1RecordState} />}{tab === 'e2' && <E2Evaluation viewport={viewport} onRecordState={setE2RecordState} />}{tab === 'e3' && <E3Planning viewport={viewport} onRecordState={setE3RecordState} />}{tab === 'e4' && <E4Session />}{tab === 'e5' && <E5Reevaluation viewport={viewport} onRecordState={setE5RecordState} />}{tab === 'e6' && <E6Closure viewport={viewport} onRecordState={setE6RecordState} />}{tab === 'fundamentos' && <Foundations activeStage={activeStage} onStage={setActiveStage} />}{tab === 'componentes' && <Library />}{tab === 'estilo' && <VisualStyle />}</div></div></main>{episodeOpen && <EpisodeModal onClose={() => setEpisodeOpen(false)} />}
  </div>
}
