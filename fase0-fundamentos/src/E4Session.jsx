import { useMemo, useState } from 'react'
import {
  ActivityIcon, ArrowsLeftRight, CalendarBlank, CaretRight, Check,
  CheckCircle, Clock, FileText, Info, ListBullets, Lock, NotePencil,
  Paperclip, Pulse, Ruler, Scales, ShieldCheck, Stack, User,
  WarningCircle, X,
} from '@phosphor-icons/react'

const edgeCases = {
  normal: null,
  late: { tone: 'info', icon: Clock, title: 'Registro posterior a la atención', text: 'Fecha de atención: 3 oct 2026 · Fecha de registro: 4 oct 2026. El motivo de ingreso posterior es obligatorio.' },
  interrupted: { tone: 'warning', icon: WarningCircle, title: 'Sesión interrumpida por síntomas', text: 'Registra el momento, la conducta adoptada y si corresponde derivación. La respuesta requiere detalle.' },
  multi: { tone: 'info', icon: User, title: 'Participaron dos profesionales', text: 'Cada bloque conserva su autoría. Klga. Valentina Soto registra intervención; Klgo. Matías Leiva registra evaluación.' },
  offline: { tone: 'warning', icon: ArrowsLeftRight, title: 'Conectividad intermitente', text: 'Guardado local activo. Los cambios se sincronizarán cuando vuelva la conexión.' },
  consent: { tone: 'danger', icon: Lock, title: 'Falta consentimiento configurado', text: 'La intervención seleccionada está configurada para requerir consentimiento escrito. La validación permanece bloqueada.' },
  response: { tone: 'danger', icon: WarningCircle, title: 'Falta respuesta clínica', text: 'Se registraron molestias, pero falta describir síntomas durante o después y la conducta adoptada.' },
  minor: { tone: 'info', icon: User, title: 'Variante menor de edad', text: 'Representante: Daniela Muñoz, madre. Documenta la información entregada y cómo se escuchó al niño o adolescente.' },
}

const appointments = [
  { date: '3 oct 2026', number: 'Sesión 4', author: 'Klga. Valentina Soto', state: 'Borrador', alert: 'Pendiente de validar' },
  { date: '26 sep 2026', number: 'Sesión 3', author: 'Klgo. Matías Leiva', state: 'Validado', alert: null },
  { date: '19 sep 2026', number: 'Sesión 2', author: 'Klga. Valentina Soto', state: 'Validado', alert: 'Molestia transitoria' },
  { date: '12 sep 2026', number: 'Sesión 1', author: 'Klga. Valentina Soto', state: 'Validado', alert: null },
  { date: '5 sep 2026', number: 'Inasistencia', author: 'Agenda', state: 'Evento', alert: 'No numerada como sesión' },
]

function MiniState({ state }) {
  const data = state === 'Validado'
    ? { icon: ShieldCheck, label: 'Validado', cls: 'valid' }
    : state === 'Borrador'
      ? { icon: NotePencil, label: 'Borrador', cls: 'draft' }
      : state === 'Error'
        ? { icon: WarningCircle, label: 'Con errores', cls: 'error' }
        : { icon: Info, label: state, cls: 'neutral' }
  const Icon = data.icon
  return <span className={`e4-state ${data.cls}`}><Icon size={15} weight="bold" />{data.label}</span>
}

function EdgeBanner({ mode }) {
  const edge = edgeCases[mode]
  if (!edge) return null
  const Icon = edge.icon
  return <div className={`e4-edge-banner ${edge.tone}`}><Icon size={21} weight="bold" /><div><strong>{edge.title}</strong><p>{edge.text}</p></div></div>
}

function RequiredMark({ required = false, conditional = false }) {
  if (!required && !conditional) return null
  return <span className={`e4-required ${conditional ? 'conditional' : ''}`}>{conditional ? 'Cond.' : 'Req.'}</span>
}

function SectionHeader({ number, title, description, required, conditional, open, onToggle }) {
  return <button className="e4-section-header" onClick={onToggle} aria-expanded={open}><span className="e4-section-number">{number}</span><span className="e4-section-title"><strong>{title}</strong><small>{description}</small></span><RequiredMark required={required} conditional={conditional} /><CaretRight size={19} className={open ? 'open' : ''} /></button>
}

function CompactContext({ referenceOpen, setReferenceOpen }) {
  return <aside className="e4-context-panel">
    <section><span className="field-label">Plan vigente</span><strong>Recuperar elevación funcional</strong><ul><li>Ejercicio terapéutico progresivo</li><li>Control de carga</li><li>Educación en autocuidado</li></ul><button className="e4-link">Abrir E3 Plan <CaretRight size={14} /></button></section>
    <section className="e4-precautions"><span className="field-label">Precauciones</span><strong><ShieldCheck size={17} />Sin alertas activas</strong><p>Vigilar dolor que persista más de 24 horas.</p></section>
    <section><button className="e4-panel-toggle" onClick={() => setReferenceOpen(!referenceOpen)}><span><span className="field-label">Sesión anterior · solo lectura</span><strong>26 sep 2026 · Sesión 3</strong></span><CaretRight size={17} className={referenceOpen ? 'open' : ''} /></button>{referenceOpen && <div className="e4-reference"><p><b>Intervención:</b> elevación asistida y rotación externa con banda amarilla.</p><p><b>Respuesta:</b> molestia 2/10 al final, resuelta en reposo.</p><div className="e4-no-copy"><Lock size={16} /><span>No se copia automáticamente.</span></div><button className="button secondary small">Seleccionar qué reutilizar</button></div>}</section>
  </aside>
}

function DoseEditor({ doseType, setDoseType, disabled }) {
  const fields = doseType === 'ejercicio'
    ? [['Series', '3'], ['Repeticiones', '10'], ['Carga', 'Banda amarilla'], ['Descanso', '60 s']]
    : doseType === 'tiempo'
      ? [['Duración', '8 min'], ['Intervalo', '40 s'], ['Pausa', '20 s'], ['Rondas', '6']]
      : [['Equipo', 'Bicicleta'], ['Resistencia', 'Nivel 4'], ['Tiempo', '10 min'], ['Cadencia', '60 rpm']]
  return <div className="e4-dose"><div className="e4-dose-top"><div><span className="field-label">Indicador de dosis</span><strong>Parámetros aplicados hoy</strong></div><div className="e4-segmented">{[['ejercicio', 'Series'], ['tiempo', 'Tiempo'], ['equipo', 'Equipo']].map(([id, label]) => <button key={id} className={doseType === id ? 'active' : ''} onClick={() => setDoseType(id)} disabled={disabled}>{label}</button>)}</div></div><div className="e4-dose-fields">{fields.map(([label, value]) => <label key={label}><span>{label}</span><input value={value} readOnly={disabled} onChange={() => {}} /></label>)}</div><p className="e4-help"><Info size={15} />Las unidades son obligatorias. Los campos cambian según la intervención.</p></div>
}

function IncidentModal({ onClose }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal e4-incident-modal" role="dialog" aria-modal="true" aria-labelledby="incident-title"><header><div><span className="section-kicker">Registro condicional</span><h2 id="incident-title">Registrar incidente</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={22} /></button></header><div className="e4-form-grid"><label className="span-2"><span>Evento <RequiredMark required /></span><textarea defaultValue="Mareo leve al incorporarse desde decúbito." /></label><label><span>Momento <RequiredMark required /></span><input defaultValue="Durante la intervención" /></label><label><span>Hora</span><input defaultValue="11:28" /></label><label className="span-2"><span>Medidas adoptadas <RequiredMark required /></span><textarea defaultValue="Se suspende ejercicio, se sienta a la paciente y se controlan síntomas." /></label><label><span>Comunicación</span><input defaultValue="Tratante informado" /></label><label><span>Derivación</span><select defaultValue="no"><option value="no">No requerida</option><option value="si">Realizada</option><option value="pendiente">Pendiente</option></select></label></div><div className="e4-edge-banner warning"><WarningCircle size={20} /><div><strong>Relato factual</strong><p>Evita conclusiones no verificadas. La notificación al tratante se sugiere, pero el destinatario debe confirmarse con la clínica.</p></div></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancelar</button><button className="button primary" onClick={onClose}>Guardar incidente</button></div></section></div>
}

function SessionForm({ screenState, setScreenState, caseMode, setCaseMode, onValidate, viewport }) {
  const [fastMode, setFastMode] = useState(false)
  const [doseType, setDoseType] = useState('ejercicio')
  const [referenceOpen, setReferenceOpen] = useState(true)
  const [incidentOpen, setIncidentOpen] = useState(false)
  const [unplanned, setUnplanned] = useState(false)
  const [sections, setSections] = useState({ initial: true, intervention: true, response: true, analysis: false, indications: false, next: false })
  const readOnly = screenState === 'Validado'
  const empty = screenState === 'Vacío'
  const error = screenState === 'Error' || caseMode === 'consent' || caseMode === 'response'
  const toggle = (key) => setSections((current) => ({ ...current, [key]: !current[key] }))
  const showOptional = !fastMode

  return <div className="e4-register-layout">
    <div className="e4-form-column">
      <div className="e4-session-toolbar"><div><span className="section-kicker">E4_Registro_Sesion_{viewport === 'desktop' ? 'Desktop' : 'Tablet'}</span><h2>Sesión 4 · 3 oct 2026</h2><p>Presencial · Box 2 · 60 min · Klga. Valentina Soto</p></div><div className="e4-toolbar-actions"><MiniState state={screenState} /><label className="e4-switch"><input type="checkbox" checked={fastMode} onChange={(event) => setFastMode(event.target.checked)} /><span>Ruta rápida</span></label></div></div>

      <EdgeBanner mode={caseMode} />
      {screenState === 'Borrador' && <div className="e4-save-strip"><ArrowsLeftRight size={17} /><span>Autoguardado local a las 11:42</span><small>Sin cambios pendientes</small></div>}
      {readOnly && <div className="e4-lock-strip"><ShieldCheck size={18} /><span>Sesión validada por Klga. Valentina Soto · 3 oct 2026, 12:04</span><button className="button secondary small">Agregar aclaración</button></div>}

      <section className="e4-form-section">
        <SectionHeader number="1" title="Estado inicial" description="Lo referido hoy, sin copiar la sesión anterior." open={sections.initial} onToggle={() => toggle('initial')} />
        {sections.initial && <div className="e4-section-body"><label><span>Síntomas, cambios o limitaciones del día</span><textarea disabled={readOnly} placeholder={empty ? 'Sin información registrada' : ''} defaultValue={empty ? '' : 'Refiere menor dolor al vestirse y dificultad persistente para alcanzar objetos sobre la cabeza.'} /></label><div className="e4-source-label"><User size={16} />Relato de la paciente</div>{showOptional && <div className="e4-home-program"><label><span>Programa domiciliario</span><select disabled={readOnly} defaultValue={empty ? '' : 'parcial'}><option value="">No informado</option><option value="completo">Realizado según indicación</option><option value="parcial">Realizado parcialmente</option><option value="no">No realizado</option></select></label><label><span>Dificultades o barreras</span><input disabled={readOnly} defaultValue={empty ? '' : 'Falta de tiempo durante dos días.'} /></label></div>}</div>}
      </section>

      {showOptional && <section className="e4-form-section"><SectionHeader number="2" title="Evaluación del día" description="Solo pruebas o mediciones efectivamente realizadas." conditional open={sections.evaluation ?? false} onToggle={() => toggle('evaluation')} />{sections.evaluation && <div className="e4-section-body"><div className="e4-measurement"><div><span className="field-label">Medición</span><strong>Flexión activa de hombro</strong></div><div className="e4-measure-grid"><span><small>Instrumento</small>Goniómetro</span><span><small>Resultado</small>128°</span><span><small>Lado</small>Derecho</span><span><small>Condiciones</small>De pie, activa</span></div><button className="button secondary small" disabled={readOnly}><Ruler size={16} />Agregar medición</button></div></div>}</section>}

      <section className={`e4-form-section ${error && caseMode === 'consent' ? 'has-error' : ''}`}>
        <SectionHeader number={showOptional ? '3' : '2'} title="Intervención realizada" description="Qué se aplicó efectivamente hoy." required open={sections.intervention} onToggle={() => toggle('intervention')} />
        {sections.intervention && <div className="e4-section-body"><div className="e4-plan-picker"><span className="field-label">Desde el plan vigente</span><label><input type="checkbox" defaultChecked={!empty} disabled={readOnly} /><span><strong>Elevación asistida</strong><small>Hombro derecho · polea</small></span></label><label><input type="checkbox" defaultChecked={!empty} disabled={readOnly} /><span><strong>Rotación externa con banda</strong><small>Hombro derecho · banda elástica</small></span></label><button className="button secondary small" onClick={() => setUnplanned(true)} disabled={readOnly}><NotePencil size={16} />Agregar no prevista</button></div>{unplanned && <div className="e4-unplanned"><WarningCircle size={18} /><div><strong>Intervención fuera del plan</strong><p>“Movilidad escapular guiada” se registra en esta sesión. Revisa si corresponde actualizar E3.</p></div><button className="e4-link">Revisar plan</button></div>}<DoseEditor doseType={doseType} setDoseType={setDoseType} disabled={readOnly} />{caseMode === 'consent' && <div className="e4-field-error"><Lock size={18} /><div><strong>Validación bloqueada</strong><p>Esta intervención está configurada para requerir consentimiento escrito y no hay uno asociado en E3.</p></div></div>}</div>}
      </section>

      <section className={`e4-form-section ${error && caseMode === 'response' ? 'has-error' : ''}`}>
        <SectionHeader number={showOptional ? '4' : '3'} title="Respuesta de la paciente" description="Tolerancia, síntomas y cambios observados." required open={sections.response} onToggle={() => toggle('response')} />
        {sections.response && <div className="e4-section-body"><div className="e4-tolerance"><span className="field-label">Tolerancia</span>{['Sin molestias', 'Molestia leve', 'Molestia relevante', 'Suspendida'].map((item, index) => <button key={item} className={(!empty && index === 1) ? 'selected' : ''} disabled={readOnly}>{item}</button>)}</div><label><span>Síntomas durante o después {caseMode === 'response' && <RequiredMark required />}</span><textarea disabled={readOnly} className={caseMode === 'response' ? 'input-error' : ''} placeholder={caseMode === 'response' ? 'Describe la molestia y la conducta adoptada.' : 'Describe la respuesta con contexto.'} defaultValue={empty || caseMode === 'response' ? '' : 'Molestia 2/10 durante las últimas repeticiones; cede al reducir el rango y no persiste al finalizar.'} /></label>{caseMode === 'response' && <p className="e4-error-text"><WarningCircle size={15} />Este campo es obligatorio porque se registraron molestias.</p>}<button className="e4-incident-button" onClick={() => setIncidentOpen(true)} disabled={readOnly}><WarningCircle size={18} /><span><strong>¿Ocurrió un incidente?</strong><small>Abre un registro factual y separado.</small></span><CaretRight size={18} /></button></div>}
      </section>

      {showOptional && <>
        <section className="e4-form-section"><SectionHeader number="5" title="Análisis" description="Interpretación separada de los hallazgos." open={sections.analysis} onToggle={() => toggle('analysis')} />{sections.analysis && <div className="e4-section-body"><label><span>Evolución y decisión</span><textarea disabled={readOnly} defaultValue={empty ? '' : 'Mejora funcional respecto de la sesión anterior. Se mantiene progresión con menor rango ante molestia.'} /></label><div className="e4-decision-buttons"><button className="selected">Mantener</button><button>Progresar</button><button>Reducir</button><button>Derivar</button></div></div>}</section>
        <section className="e4-form-section"><SectionHeader number="6" title="Indicaciones" description="Educación, programa actualizado y precauciones." open={sections.indications} onToggle={() => toggle('indications')} />{sections.indications && <div className="e4-section-body"><label><span>Educación y autocuidado</span><textarea disabled={readOnly} defaultValue={empty ? '' : 'Mantener ejercicios sin superar molestia leve y observar respuesta durante 24 horas.'} /></label><div className="e4-attachment"><FileText size={21} /><span><strong>Programa_Hombro_v3.pdf</strong><small>Versión 3 · Entregado hoy</small></span><button className="button secondary small" disabled={readOnly}><Paperclip size={16} />Adjuntar</button></div></div>}</section>
        <section className="e4-form-section"><SectionHeader number="7" title="Próxima atención" description="Objetivo, pendientes y necesidad de reevaluación." open={sections.next} onToggle={() => toggle('next')} />{sections.next && <div className="e4-section-body"><label><span>Objetivo próximo</span><input disabled={readOnly} defaultValue={empty ? '' : 'Progresar elevación con control escapular.'} /></label><label className="e4-checkbox-row"><input type="checkbox" defaultChecked disabled={readOnly} /><span>Revisar criterio de reevaluación en la próxima sesión</span></label><div className="e4-edge-banner warning"><Scales size={20} /><div><strong>Reevaluación próxima</strong><p>El plan indica revisar resultados al completar 4 sesiones. Puedes activar E5 sin cerrar esta pantalla.</p></div></div></div>}</section>
      </>}

      <footer className="e4-form-footer"><div><button className="button secondary" disabled={readOnly}>Guardar borrador</button><span><ArrowsLeftRight size={15} />{caseMode === 'offline' ? 'Guardado local · pendiente de sincronizar' : 'Sincronizado'}</span></div><button className="button primary" onClick={onValidate} disabled={readOnly || caseMode === 'consent'}>{readOnly ? <><ShieldCheck size={18} />Registro validado</> : <><CheckCircle size={18} />Validar y firmar sesión</>}</button></footer>
    </div>
    <CompactContext referenceOpen={referenceOpen} setReferenceOpen={setReferenceOpen} />
    {incidentOpen && <IncidentModal onClose={() => setIncidentOpen(false)} />}
  </div>
}

function AppointmentTimeline() {
  return <div className="e4-view-page"><div className="e4-view-heading"><div><span className="section-kicker">E4_Lista_Atenciones_Desktop</span><h2>Atenciones del episodio</h2><p>Hombro derecho · 4 sesiones realizadas · 1 evento de agenda</p></div><button className="button primary"><NotePencil size={18} />Nueva sesión</button></div><div className="e4-appointments">{appointments.map((item, index) => <article key={item.date + item.number} className={index === 0 ? 'current' : ''}><span className="e4-timeline-dot"><CalendarBlank size={19} /></span><div className="e4-appointment-main"><div><time>{item.date}</time><h3>{item.number}</h3><p>{item.author}</p></div><MiniState state={item.state} /></div>{item.alert && <span className={`e4-appointment-alert ${item.number === 'Inasistencia' ? 'neutral' : ''}`}><Info size={15} />{item.alert}</span>}<button className="button secondary small">Abrir <CaretRight size={15} /></button></article>)}</div><div className="e4-info-note"><Info size={19} /><p><strong>Una inasistencia no es una sesión.</strong> Se muestra en la línea de tiempo como evento de agenda, sin número de atención.</p></div></div>
}

function ValidatedSession() {
  return <div className="e4-view-page"><div className="e4-view-heading"><div><span className="section-kicker">E4_Sesion_Validada</span><h2>Sesión 3 · Registro validado</h2><p>26 sep 2026 · Klgo. Matías Leiva · Firma registrada 12:14</p></div><MiniState state="Validado" /></div><div className="e4-validated-banner"><ShieldCheck size={23} weight="fill" /><div><strong>Contenido protegido</strong><p>El registro original permanece visible. Cualquier corrección se agrega como aclaración vinculada.</p></div><button className="button secondary"><NotePencil size={17} />Agregar aclaración</button></div><div className="e4-validated-grid"><section><span className="field-label">Intervención</span><h3>Ejercicio terapéutico</h3><p>Elevación asistida y rotación externa con banda amarilla.</p><div className="e4-dose-fields"><label><span>Series</span><b>3</b></label><label><span>Repeticiones</span><b>10</b></label><label><span>Descanso</span><b>60 s</b></label></div></section><section><span className="field-label">Respuesta</span><h3>Molestia leve</h3><p>Molestia 2/10 en últimas repeticiones; cede al reducir el rango.</p></section><section><span className="field-label">Análisis</span><h3>Progresión mantenida</h3><p>Mejor control de elevación sin compensación visible.</p></section><section><span className="field-label">Próxima atención</span><h3>Control escapular</h3><p>Revisar tolerancia y criterio de reevaluación.</p></section></div><section className="e4-clarification"><header><div><span className="field-label">Aclaración vinculada</span><h3>Agregada el 27 sep 2026, 09:18</h3></div><MiniState state="Validado" /></header><blockquote>La banda utilizada fue amarilla, no roja como se indicó inicialmente.</blockquote><p>Autor: Klgo. Matías Leiva · Motivo: precisión de parámetro · Original sin cambios</p></section></div>
}

function SoapView() {
  return <div className="e4-view-page"><div className="e4-view-heading"><div><span className="section-kicker">E4_Vista_SOAP_Alternativa</span><h2>Sesión 4 · Vista SOAP</h2><p>Organización alternativa del mismo registro; no crea campos clínicos nuevos.</p></div><span className="note-chip"><Info size={16} />Vista opcional</span></div><div className="e4-soap-grid">{[
    ['S', 'Subjetivo · Relato', 'Refiere menor dolor al vestirse y dificultad para alcanzar objetos sobre la cabeza.', User],
    ['O', 'Objetivo · Hallazgos', 'Flexión activa 128° con goniómetro. Molestia 2/10 en últimas repeticiones.', Ruler],
    ['A', 'Análisis', 'Mejora funcional respecto de la sesión anterior. Mantener progresión adaptada.', ActivityIcon],
    ['P', 'Plan', 'Progresar elevación con control escapular y revisar criterio de reevaluación.', ListBullets],
  ].map(([letter, title, text, Icon]) => <article key={letter}><span className="e4-soap-letter">{letter}</span><div><Icon size={21} /><h3>{title}</h3><p>{text}</p><button className="e4-link">Editar en registro estructurado <CaretRight size={14} /></button></div></article>)}</div><div className="e4-info-note"><ArrowsLeftRight size={19} /><p>Los cambios se reflejan en la vista estructurada y conservan relato, hallazgo y análisis como categorías distintas.</p></div></div>
}

function DesignNotes() {
  return <section className="e4-design-notes"><div><span className="section-kicker">Decisiones de diseño</span><h2>Velocidad sin perder honestidad</h2><p>La ruta rápida mantiene siempre intervención y respuesta. La sesión anterior se consulta en solo lectura y reutilizar datos exige una acción explícita. Plan, precauciones y autoría permanecen visibles sin competir con el registro de hoy.</p></div><div className="e4-notes-grid"><article><h3>Supuestos</h3><ul><li>La clínica dispone de autoguardado local.</li><li>Modalidades y catálogo de intervenciones se configuran.</li><li>El profesional autenticado firma solo su propia autoría.</li><li>La agenda puede identificar inasistencias sin crear una sesión.</li></ul></article><article><h3>Preguntas pendientes</h3><ol><li>¿Qué catálogo de ejercicios e intervenciones se utilizará?</li><li>¿Habrá sesiones favoritas por paciente?</li><li>¿El registro se completa en vivo o al final de la jornada?</li><li>¿Qué modalidades estarán disponibles?</li><li>¿Quién recibe una notificación de incidente?</li></ol></article></div><div className="e4-edge-banner warning"><Lock size={19} /><div><strong>Configuración pendiente</strong><p>Los procedimientos que requieren consentimiento escrito, las modalidades y las notificaciones no se deciden en este prototipo.</p></div></div></section>
}

export function E4Session({ viewport = new URLSearchParams(window.location.search).get('viewport') === 'desktop' ? 'desktop' : 'tablet' }) {
  const [view, setView] = useState('registro')
  const [screenState, setScreenState] = useState('Borrador')
  const [caseMode, setCaseMode] = useState('normal')
  const [validationMessage, setValidationMessage] = useState('')
  const views = useMemo(() => [
    ['registro', 'Registro de sesión'], ['atenciones', 'Atenciones'], ['validada', 'Sesión validada'], ['soap', 'Vista SOAP'], ['notas', 'Decisiones'],
  ], [])

  const handleValidate = () => {
    if (caseMode === 'consent' || caseMode === 'response' || screenState === 'Vacío') {
      setScreenState('Error')
      setValidationMessage(caseMode === 'consent' ? 'No se puede validar: falta consentimiento configurado.' : 'No se puede validar: intervención y respuesta deben estar registradas.')
      return
    }
    setScreenState('Validado')
    setValidationMessage('Sesión validada y firmada. El contenido quedó protegido.')
  }

  return <div className="e4-shell">
    <div className="e4-stage-strip"><div><span className="e4-stage-code">E4</span><span><strong>Sesión y evolución</strong><small>Pantalla de mayor frecuencia</small></span></div><div className="e4-view-tabs">{views.map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}>{label}</button>)}</div></div>
    <div className="e4-simulator"><div><span className="field-label">Estado visible</span><div className="e4-segmented">{['Vacío', 'Borrador', 'Validado', 'Error'].map((state) => <button key={state} className={screenState === state ? 'active' : ''} onClick={() => { setScreenState(state); setValidationMessage('') }}>{state}</button>)}</div></div><label><span className="field-label">Simular caso borde</span><select value={caseMode} onChange={(event) => { setCaseMode(event.target.value); setValidationMessage('') }}><option value="normal">Uso normal</option><option value="late">Registro posterior</option><option value="interrupted">Sesión interrumpida</option><option value="multi">Varios profesionales</option><option value="offline">Sin conexión</option><option value="consent">Falta consentimiento</option><option value="response">Falta respuesta</option><option value="minor">Menor con representante</option></select></label></div>
    {validationMessage && <div className={`e4-validation-toast ${screenState === 'Validado' ? 'success' : 'error'}`}>{screenState === 'Validado' ? <CheckCircle size={19} /> : <WarningCircle size={19} />}<span>{validationMessage}</span><button onClick={() => setValidationMessage('')} aria-label="Cerrar mensaje"><X size={17} /></button></div>}
    {view === 'registro' && <SessionForm screenState={screenState} setScreenState={setScreenState} caseMode={caseMode} setCaseMode={setCaseMode} onValidate={handleValidate} viewport={viewport} />}
    {view === 'atenciones' && <AppointmentTimeline />}
    {view === 'validada' && <ValidatedSession />}
    {view === 'soap' && <SoapView />}
    {view === 'notas' && <DesignNotes />}
  </div>
}
