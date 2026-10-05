import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, ArrowsClockwise, Baby, CalendarBlank, CaretRight, Check,
  CheckCircle, Clock, FileText, FloppyDisk, Info, LinkSimple, Lock,
  NotePencil, ShieldCheck, SignIn, Sparkle, UserFocus, WarningCircle,
} from '@phosphor-icons/react'
import { ConsentBlock, DocumentAttachment, DoseIndicator, LinkedClarification, Measurement } from './ClinicalComponents.jsx'

const views = [
  ['objetivos', 'Objetivos'],
  ['plan', 'Plan y seguridad'],
  ['decision', 'Información y decisión'],
  ['resumen', 'Resumen paciente'],
  ['historial', 'Historial'],
  ['decisiones', 'Decisiones'],
]

const stateLabels = ['Vacío', 'Borrador', 'Pendiente de decisión', 'Acordado', 'Validado', 'Error']

function RecordPill({ value }) {
  const icon = value === 'Validado' ? ShieldCheck : value === 'Acordado' ? CheckCircle : value === 'Pendiente de decisión' ? Clock : value === 'Error' ? WarningCircle : NotePencil
  const Icon = icon
  return <span className={`e3-record-pill ${value.toLowerCase().replaceAll(' ', '-')}`}><Icon size={16} weight="bold" />{value}</span>
}

function SafetyStrip({ confirmed, setConfirmed, readOnly }) {
  return <section className="e3-safety-strip" aria-label="Precauciones heredadas desde E2">
    <div className="e3-safety-icon"><WarningCircle size={25} weight="fill" /></div>
    <div className="e3-safety-copy"><span className="section-kicker">Seguridad heredada de E2</span><strong>Precauciones antes de planificar</strong><p>Hipertensión controlada referida · dolor nocturno pendiente de precisar · evitar aumento sostenido de síntomas.</p></div>
    <label className={confirmed ? 'confirmed' : ''}><input type="checkbox" checked={confirmed} disabled={readOnly} onChange={event => setConfirmed(event.target.checked)} /><span><Check size={16} weight="bold" />Confirmo que fueron consideradas</span></label>
  </section>
}

function ObjectiveCard({ baselineMissing, changedIndicator, setChangedIndicator, readOnly, empty }) {
  const [editingBaseline, setEditingBaseline] = useState(false)
  return <article className="e3-objective-card">
    <header><div><span className="e3-objective-index">Objetivo 01</span><h3>{empty ? 'Objetivo pendiente' : 'Alcanzar una repisa sobre la cabeza con dolor tolerable'}</h3></div><span className="e3-plan-label">PLAN · no realizado</span></header>
    <div className="e3-source-link"><LinkSimple size={18} /><div><span>Problema de la conclusión E2</span><strong>{empty ? 'Pendiente de vincular' : 'Limitación funcional para alcance sobre cabeza'}</strong></div><button disabled={readOnly}>Ver E2</button></div>
    {baselineMissing ? <div className="e3-baseline-missing"><WarningCircle size={19} /><div><strong>Sin línea de base previa</strong><p>E2 quedó interrumpida. El objetivo puede guardarse, pero no tiene un valor inicial verificable.</p></div></div> : <div className="e3-baseline"><Measurement state={empty ? 'Vacío' : 'Validado'} title="Flexión activa de hombro · valor inicial E2" instrument="Goniómetro" result="128" unit="°" side="Derecho" date="3 oct 2026" conditions="De pie, movimiento activo" /><button className="button secondary small" disabled={readOnly} onClick={() => setEditingBaseline(value => !value)}><Lock size={16} />{editingBaseline ? 'Cancelar edición' : 'Editar con justificación'}</button></div>}
    {editingBaseline && <label className="e3-justification">Justificación obligatoria<textarea defaultValue="Se corrige transcripción; el registro fuente de E2 permanece protegido." /></label>}
    <div className="e3-goal-grid"><label>Meta observable <span>Requerido</span><input disabled={readOnly} defaultValue={empty ? '' : 'Llegar a 150° con EVA ≤ 3/10'} placeholder="Describe resultado observable" /></label><label>Plazo<input disabled={readOnly} defaultValue={empty ? '' : '4 semanas'} placeholder="Pendiente" /></label><label>Indicador<select disabled={readOnly} value={changedIndicator ? 'QuickDASH' : 'Flexión activa con goniómetro'} onChange={event => setChangedIndicator(event.target.value === 'QuickDASH')}><option>Flexión activa con goniómetro</option><option>QuickDASH</option></select></label></div>
    {changedIndicator && <div className="e3-comparability"><ArrowsClockwise size={18} /><div><strong>Indicador distinto al usado en E2</strong><p>QuickDASH podría no ser directamente comparable con la línea de base en E5. Registra el motivo del cambio.</p></div><input aria-label="Motivo del cambio de indicador" defaultValue="Se agrega indicador funcional informado por paciente." /></div>}
  </article>
}

function ObjectivesView({ baselineMissing, changedIndicator, setChangedIndicator, readOnly, empty }) {
  return <section className="e3-view">
    <header className="e3-view-head"><div><span className="section-kicker">E3_Objetivos_Tablet</span><h2>Objetivos conectados con la evaluación</h2><p>Cada meta mantiene visible el problema y el valor inicial que la hacen verificable.</p></div><button className="button secondary" disabled={readOnly}>Agregar objetivo</button></header>
    <div className="e3-priorities"><div><UserFocus size={22} /><span><small>Prioridad expresada por la paciente</small><strong>“Quiero volver a alcanzar una repisa y vestirme sin pedir ayuda.”</strong></span></div><div><Sparkle size={22} /><span><small>Expectativa conversada</small><strong>Mejorar función de forma progresiva; sin prometer un resultado específico.</strong></span></div></div>
    <ObjectiveCard baselineMissing={baselineMissing} changedIndicator={changedIndicator} setChangedIndicator={setChangedIndicator} readOnly={readOnly} empty={empty} />
    {!empty && <article className="e3-objective-card compact"><header><div><span className="e3-objective-index">Objetivo 02</span><h3>Vestirse de forma independiente con menor dificultad</h3></div><span className="e3-plan-label">PLAN · no realizado</span></header><div className="e3-source-link"><LinkSimple size={18} /><div><span>Problema de la conclusión E2</span><strong>Dificultad moderada para vestirse</strong></div><button>Ver E2</button></div></article>}
  </section>
}

function PlanView({ confirmed, setConfirmed, readOnly, newProcedure }) {
  return <section className="e3-view">
    <SafetyStrip confirmed={confirmed} setConfirmed={setConfirmed} readOnly={readOnly} />
    <header className="e3-view-head"><div><span className="section-kicker">E3_Plan_Intervencion_Desktop</span><h2>Intervenciones previstas</h2><p>Estas acciones forman parte del plan. Lo aplicado se registra únicamente en E4.</p></div><span className="e3-plan-label prominent">PLANIFICADO · NO EJECUTADO</span></header>
    <div className="e3-plan-grid">
      <article className="e3-intervention"><header><span>01</span><div><strong>Movilidad activa asistida</strong><small>Prevista para hombro derecho</small></div><button disabled={readOnly}>Editar</button></header><label>Justificación<textarea disabled={readOnly} defaultValue="Facilitar alcance funcional dentro de tolerancia y respuesta clínica." /></label><label>Progresión propuesta<textarea disabled={readOnly} defaultValue="Aumentar rango o carga solo si no hay exacerbación sostenida." /></label></article>
      <article className="e3-intervention"><header><span>02</span><div><strong>Fortalecimiento progresivo</strong><small>Previsto · banda elástica</small></div><button disabled={readOnly}>Editar</button></header><DoseIndicator state={readOnly ? 'Validado' : 'Borrador'} title="Rotación externa con banda" label="Prevista para programa domiciliario" /></article>
      {newProcedure && <article className="e3-new-procedure"><WarningCircle size={20} /><div><strong>Procedimiento nuevo no previsto</strong><p>“Punción seca” fue agregado después del acuerdo. Actualiza el plan y registra el consentimiento aplicable antes de ejecutarlo.</p></div><button>Actualizar y solicitar decisión</button></article>}
    </div>
    <div className="e3-organization"><label>Frecuencia estimada<select disabled={readOnly} defaultValue="2 veces por semana"><option>2 veces por semana</option><option>1 vez por semana</option></select></label><label>Duración estimada<input disabled={readOnly} defaultValue="4 semanas" /></label><label>Revisión prevista<input disabled={readOnly} defaultValue="31 oct 2026" /></label></div>
    <div className="e3-clinical-rules"><article><ShieldCheck size={21} /><div><span>Criterios para ajustar</span><p>Dolor mayor a 5/10 por más de 24 horas o menor tolerancia funcional.</p></div></article><article><WarningCircle size={21} /><div><span>Criterios para suspender</span><p>Síntomas neurológicos nuevos, malestar sistémico o respuesta no esperada.</p></div></article><article><SignIn size={21} /><div><span>Derivación</span><p>Reevaluar o derivar según evolución y hallazgos; decisión clínica no automatizada.</p></div></article></div>
    <article className="e3-home-program"><header><div><span className="section-kicker">Programa domiciliario</span><h3>Versión vigente · v1</h3><p>Material explicado y entregado para uso en domicilio.</p></div><span className="e3-version">Vigente desde 3 oct 2026</span></header><DoseIndicator state={readOnly ? 'Validado' : 'Borrador'} title="Elevación asistida con bastón" values={[["Series", "2"], ["Repeticiones", "8"], ["Frecuencia", "1 vez al día"], ["Pausa", "45 s"]]} label="Domiciliaria" /><DocumentAttachment state={readOnly ? 'Validado' : 'Borrador'} title="programa_hombro_v1.pdf" meta="Educación · versión 1 · lenguaje paciente" association="Episodio EP-003 · Plan E3 v1" access="clinical" /></article>
  </section>
}

function DecisionView({ decision, setDecision, requiresWritten, setRequiresWritten, signed, setSigned, minor, readOnly }) {
  return <section className="e3-view">
    <header className="e3-view-head"><div><span className="section-kicker">E3_Informacion_Decision_Consentimiento</span><h2>Información → decisión → consentimiento</h2><p>La decisión se registra después de conversar objetivos, alternativas y dudas.</p></div></header>
    <div className="e3-decision-flow" aria-label="Flujo de decisión informada"><div className="active"><span>1</span><strong>Información</strong><small>Explicada</small></div><CaretRight size={20} /><div className={decision ? 'active' : ''}><span>2</span><strong>Decisión</strong><small>{decision || 'Pendiente'}</small></div><CaretRight size={20} /><div className={signed || !requiresWritten ? 'active' : ''}><span>3</span><strong>Consentimiento</strong><small>{requiresWritten ? signed ? 'Registrado' : 'Pendiente' : 'Verbal permitido'}</small></div></div>
    <article className="e3-information-card"><h3>Información explicada</h3><div className="e3-check-list"><label><input type="checkbox" defaultChecked disabled={readOnly} />Objetivos y resultados esperables</label><label><input type="checkbox" defaultChecked disabled={readOnly} />Intervenciones previstas y alternativas</label><label><input type="checkbox" defaultChecked disabled={readOnly} />Beneficios, molestias y riesgos relevantes</label><label><input type="checkbox" defaultChecked disabled={readOnly} />Derecho a preguntar, rechazar o decidir después</label></div><label>Preguntas del paciente<textarea disabled={readOnly} defaultValue="Pregunta si puede continuar trabajando y cómo reconocer una reacción no esperada." /></label></article>
    {minor && <article className="e3-minor"><Baby size={24} /><div><span className="section-kicker">Variante menor de edad</span><h3>Información, escucha y decisión del representante</h3><label>Información entregada al niño, niña o adolescente<textarea defaultValue="Se explica el plan con palabras simples y se muestran los ejercicios." /></label><label>Escucha y preferencias<textarea defaultValue="Prefiere ejercicios breves y solicita que su madre esté presente al inicio." /></label><div className="e3-minor-grid"><label>Representante<input defaultValue="Paula Medina" /></label><label>Relación<select defaultValue="Madre"><option>Madre</option><option>Padre</option><option>Representante legal</option></select></label><label>Respaldo<input defaultValue="Cédula y relación verificadas" /></label></div></div></article>}
    <div className="e3-consent-config"><label><input type="checkbox" checked={requiresWritten} disabled={readOnly} onChange={event => setRequiresWritten(event.target.checked)} />Este procedimiento requiere consentimiento escrito según configuración clínica</label><span>Pendiente de definir por la clínica; no es una regla legal fijada por el prototipo.</span></div>
    <ConsentBlock state={readOnly ? 'Validado' : 'Borrador'} procedure="Intervención prevista seleccionada" decision={decision} requiredWritten={requiresWritten} signed={signed} minor={minor} onDecision={setDecision} />
    {decision === 'Rechaza' && <article className="e3-rejection"><WarningCircle size={22} /><div><h3>Rechazo registrado</h3><label>Alternativas discutidas <span>Requerido</span><textarea defaultValue="Continuar con educación y ejercicio domiciliario sin el procedimiento rechazado." /></label><label>Conducta acordada <span>Requerido</span><textarea defaultValue="Reformular plan y revisar respuesta en 7 días; derivar si corresponde." /></label></div></article>}
    {decision === 'Difiere' && <article className="e3-deferred"><Clock size={22} /><div><h3>Pendiente de decisión</h3><p>La paciente prefiere revisar el resumen con su familia. No se programará el procedimiento hasta registrar su decisión.</p><label>Recordatorio acordado<input defaultValue="Llamar el 5 oct 2026 a las 18:00" /></label></div></article>}
    {requiresWritten && !signed && decision === 'Acepta' && <div className="e3-sign-actions"><button className="button secondary" onClick={() => setSigned(true)}><FileText size={18} />Adjuntar documento firmado</button><button className="button secondary" onClick={() => setSigned(true)}><NotePencil size={18} />Firmar en pantalla</button></div>}
  </section>
}

function SummaryView({ decision, requiresWritten, signed, confirmed, setSigned, setRecordState, minor }) {
  const ready = confirmed && decision === 'Acepta' && (!requiresWritten || signed)
  return <section className="e3-view e3-summary">
    <header className="e3-view-head"><div><span className="section-kicker">E3_Resumen_Paciente_Lectura_Firma</span><h2>Revisemos el plan juntos</h2><p>Versión en lenguaje simple para leer con la paciente o su representante.</p></div><button className="button secondary"><FileText size={18} />Vista para imprimir</button></header>
    <div className="e3-patient-summary"><header><div><span>Plan de atención · versión 1</span><h3>Recuperar movimiento y autonomía del hombro derecho</h3></div><span>Preparado el 3 oct 2026</span></header><section><span>Lo que queremos lograr</span><p>Que puedas alcanzar una repisa y vestirte con menos dolor y mayor independencia.</p></section><section><span>Lo que proponemos hacer</span><p>Practicar movimientos guiados, aumentar la fuerza de manera gradual y enseñarte ejercicios breves para la casa.</p></section><section><span>Cómo cuidaremos tu seguridad</span><p>Ajustaremos o detendremos una actividad si el dolor aumenta y se mantiene, o si aparece un síntoma nuevo.</p></section><div className="e3-plan-metrics"><span><small>Frecuencia estimada</small>2 veces por semana</span><span><small>Revisión</small>31 oct 2026</span><span><small>Decisión</small>{decision}</span></div></div>
    {minor && <div className="e3-summary-representative"><Baby size={20} /><span><strong>Decisión del representante:</strong> Paula Medina · madre · respaldo verificado.</span></div>}
    {!ready && <div className="e3-execution-block"><Lock size={23} /><div><strong>El plan todavía no está listo para ejecutar</strong><p>{!confirmed ? 'Falta confirmar que las precauciones de E2 fueron consideradas.' : decision !== 'Acepta' ? 'La decisión está pendiente o el plan fue rechazado.' : 'El procedimiento exige consentimiento escrito y el documento aún no está registrado.'}</p><span>Este bloqueo protege la ejecución; el borrador y la conversación permanecen guardados.</span></div></div>}
    {ready && <div className="e3-ready"><CheckCircle size={23} weight="fill" /><div><strong>Plan acordado y listo para ejecutar</strong><p>Objetivos, seguridad y consentimiento requerido están registrados. E4 verá el plan como referencia, no como acciones realizadas.</p></div></div>}
    <div className="e3-summary-actions"><button className="button secondary"><FloppyDisk size={18} />Guardar borrador</button>{requiresWritten && !signed && <button className="button secondary" onClick={() => setSigned(true)}><FileText size={18} />Registrar consentimiento</button>}<button className="button primary" disabled={!ready} onClick={() => setRecordState('Acordado')}><CheckCircle size={18} />Marcar plan acordado</button><button className="button primary" disabled={!ready} onClick={() => setRecordState('Validado')}><ShieldCheck size={18} />Validar y firmar</button></div>
  </section>
}

function HistoryView({ clarification }) {
  return <section className="e3-view"><header className="e3-view-head"><div><span className="section-kicker">E3_Historial_Versiones</span><h2>Versionado del plan</h2><p>Los cambios previos a la primera sesión conservan autoría, motivo y contenido anterior.</p></div><span className="e3-version">Versión vigente · v2</span></header><div className="e3-history"><article className="current"><span className="e3-history-dot"></span><div><header><strong>Versión 2 · vigente</strong><span>3 oct 2026 · 13:02</span></header><p>Se ajusta frecuencia estimada de 3 a 2 sesiones semanales por disponibilidad conversada.</p><small>Klga. Valentina Soto · antes de la primera sesión</small></div><button>Ver cambios</button></article><article><span className="e3-history-dot"></span><div><header><strong>Versión 1 · reemplazada</strong><span>3 oct 2026 · 12:24</span></header><p>Plan inicial acordado: objetivos, intervenciones previstas y programa domiciliario.</p><small>El contenido se conserva y no se sobreescribe.</small></div><button>Ver versión</button></article></div>{clarification && <LinkedClarification state="Borrador" title="Aclaración posterior a versión validada" text="Se precisa que la frecuencia acordada corresponde a una estimación revisable y no a un paquete garantizado." audit="Plan original protegido · Motivo obligatorio · Autora y fecha visibles" />}</section>
}

function DecisionsView() {
  return <section className="e3-view"><header className="e3-view-head"><div><span className="section-kicker">Decisiones de diseño</span><h2>Foco, supuestos y preguntas</h2></div></header><div className="e3-decisions-grid"><article><h3>Foco resuelto</h3><ul><li>E2 y E3 quedan unidos por problema, valor inicial e indicador.</li><li>Todo lo previsto lleva el rótulo “plan”, nunca “realizado”.</li><li>Seguridad de E2 aparece antes de las intervenciones.</li><li>La decisión informada controla el estado del plan.</li><li>El resumen usa lenguaje simple y admite lectura o firma.</li></ul></article><article><h3>Supuestos</h3><ul><li>E2 validada puede alimentar objetivos sin duplicar datos.</li><li>Autoguardado e historial de versiones están disponibles.</li><li>El tratante es responsable de validar el plan.</li><li>Recepción solo puede adjuntar un documento ya firmado.</li></ul></article><article><h3>Preguntas pendientes</h3><ul><li>Procedimientos que exigirán consentimiento escrito.</li><li>Firma en pantalla, papel o ambas modalidades.</li><li>Canal de entrega del resumen a la paciente.</li><li>Relación entre frecuencia y paquetes de sesiones.</li><li>Profesionales autorizados para cambiar un plan acordado.</li></ul></article></div><div className="e3-component-note"><ArrowsClockwise size={20} /><div><strong>Ajustes informados a componentes compartidos</strong><p><b>Bloque de consentimiento</b> completa sus estados y ramas reales; <b>Indicador de dosis</b> se centraliza para E3 y E4. Medición, Documento adjunto y Aclaración vinculada conservan anatomía y tokens.</p></div></div><div className="notice pending"><Info size={18} />Permisos, validez de firma y lista de procedimientos se mantienen configurables y pendientes de confirmación clínica, operativa y legal.</div></section>
}

export function E3Planning({ viewport = 'tablet', onRecordState }) {
  const params = new URLSearchParams(window.location.search)
  const initialCase = params.get('case') || 'normal'
  const [view, setView] = useState(params.get('view') || 'objetivos')
  const [recordState, setRecordStateLocal] = useState(params.get('state') || (initialCase === 'defer' ? 'Pendiente de decisión' : 'Borrador'))
  const [caseMode, setCaseMode] = useState(initialCase)
  const [confirmed, setConfirmed] = useState(initialCase !== 'unconfirmed')
  const [changedIndicator, setChangedIndicator] = useState(initialCase === 'indicator')
  const [decision, setDecision] = useState(initialCase === 'reject' ? 'Rechaza' : initialCase === 'defer' ? 'Difiere' : 'Acepta')
  const [requiresWritten, setRequiresWritten] = useState(['written', 'minor', 'newprocedure'].includes(initialCase))
  const [signed, setSigned] = useState(initialCase === 'minor')
  const readOnly = recordState === 'Validado'
  const empty = recordState === 'Vacío'
  const minor = caseMode === 'minor'
  const baselineMissing = caseMode === 'nobaseline'
  const newProcedure = caseMode === 'newprocedure'
  const setRecordState = value => { setRecordStateLocal(value); onRecordState?.(value) }

  useEffect(() => {
    if (caseMode === 'reject') { setDecision('Rechaza'); setRecordState('Borrador') }
    if (caseMode === 'defer') { setDecision('Difiere'); setRecordState('Pendiente de decisión') }
    if (caseMode === 'written') { setDecision('Acepta'); setRequiresWritten(true); setSigned(false); setRecordState('Pendiente de decisión') }
    if (caseMode === 'minor') { setDecision('Acepta'); setRequiresWritten(true); setSigned(true) }
    if (caseMode === 'normal') { setDecision('Acepta'); setRequiresWritten(false); setSigned(false) }
    if (caseMode === 'unconfirmed') setConfirmed(false)
    if (caseMode === 'indicator') setChangedIndicator(true)
  }, [caseMode])

  const ready = useMemo(() => confirmed && decision === 'Acepta' && (!requiresWritten || signed), [confirmed, decision, requiresWritten, signed])
  const body = view === 'objetivos' ? <ObjectivesView baselineMissing={baselineMissing} changedIndicator={changedIndicator} setChangedIndicator={setChangedIndicator} readOnly={readOnly} empty={empty} />
    : view === 'plan' ? <PlanView confirmed={confirmed} setConfirmed={setConfirmed} readOnly={readOnly} newProcedure={newProcedure} />
      : view === 'decision' ? <DecisionView decision={decision} setDecision={value => { setDecision(value); if (value === 'Difiere') setRecordState('Pendiente de decisión') }} requiresWritten={requiresWritten} setRequiresWritten={setRequiresWritten} signed={signed} setSigned={setSigned} minor={minor} readOnly={readOnly} />
        : view === 'resumen' ? <SummaryView decision={decision} requiresWritten={requiresWritten} signed={signed} confirmed={confirmed} setSigned={setSigned} setRecordState={setRecordState} minor={minor} />
          : view === 'historial' ? <HistoryView clarification={caseMode === 'clarification'} /> : <DecisionsView />

  return <div className={`e3-page viewport-${viewport}`}>
    {recordState === 'Error' && <div className="e3-form-error"><WarningCircle size={20} weight="fill" /><div><strong>El plan necesita revisión</strong><span>Falta una meta observable y la decisión informada no tiene fecha. Los datos válidos permanecen guardados.</span></div><button onClick={() => setView('objetivos')}>Revisar campos</button></div>}
    {!ready && view !== 'decisiones' && <div className="e3-top-status"><Lock size={18} /><div><strong>Plan no listo para ejecutar</strong><span>{!confirmed ? 'Falta confirmar precauciones de E2.' : decision !== 'Acepta' ? 'La decisión no es aceptación.' : 'Falta consentimiento escrito requerido.'}</span></div><button onClick={() => setView(!confirmed ? 'plan' : 'decision')}>Resolver ahora<ArrowRight size={16} /></button></div>}
    <header className="e3-stage-head"><div className="e3-stage-title"><span>E3</span><div><strong>Planificación y acuerdo</strong><small>Del análisis clínico a un plan conversado</small></div></div><nav>{views.map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}>{label}</button>)}</nav></header>
    <div className="e3-controls"><div><span className="field-label">Estado visible</span>{stateLabels.map(value => <button key={value} className={recordState === value ? 'active' : ''} onClick={() => setRecordState(value)}>{value}</button>)}</div><label>Simular caso borde<select value={caseMode} onChange={event => setCaseMode(event.target.value)}><option value="normal">Uso normal</option><option value="written">Falta consentimiento escrito</option><option value="reject">Rechaza intervención</option><option value="defer">Difiere decisión</option><option value="minor">Menor con representante</option><option value="nobaseline">E2 interrumpida sin línea base</option><option value="indicator">Indicador cambiado</option><option value="unconfirmed">Precauciones no confirmadas</option><option value="newprocedure">Procedimiento nuevo</option><option value="clarification">Cambio posterior</option></select></label></div>
    {view !== 'plan' && view !== 'decisiones' && <SafetyStrip confirmed={confirmed} setConfirmed={setConfirmed} readOnly={readOnly} />}
    {body}
    <footer className="e3-sticky-actions"><span><FloppyDisk size={16} />Autoguardado 12:24 · Plan v1</span><button className="button secondary" onClick={() => setView('historial')}>Ver historial</button><button className="button primary" onClick={() => setView(view === 'objetivos' ? 'plan' : view === 'plan' ? 'decision' : 'resumen')}>Continuar<CaretRight size={18} /></button></footer>
  </div>
}
