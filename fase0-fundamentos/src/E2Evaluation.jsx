import { useMemo, useState } from 'react'
import {
  ArrowsClockwise, Baby, Brain, CaretRight, Check,
  CheckCircle, Clock, Eye, FileText, FirstAid, FloppyDisk, FolderOpen,
  Info, Lock, NotePencil, PersonSimpleRun, ShieldCheck, SignOut, Stethoscope,
  WarningCircle, WifiSlash, X,
} from '@phosphor-icons/react'
import { Measurement, NamedScale } from './ClinicalComponents.jsx'

const sectionItems = [
  ['motivo', 'Motivo y expectativas', 'Completa'],
  ['historia', 'Historia del problema', 'En curso'],
  ['sintomas', 'Síntomas', 'En curso'],
  ['antecedentes', 'Antecedentes relevantes', 'Completa'],
  ['seguridad', 'Seguridad', 'En curso'],
  ['funcion', 'Función y participación', 'Completa'],
  ['examen', 'Examen físico', 'En curso'],
  ['linea', 'Línea de base', 'En curso'],
  ['documentos', 'Documentos revisados', 'No aplica'],
  ['conclusion', 'Conclusión', 'Vacía'],
]

const specialtyModules = [
  { id: 'musculo', name: 'Musculoesquelética', icon: PersonSimpleRun, suggested: true },
  { id: 'respira', name: 'Respiratoria', icon: Stethoscope },
  { id: 'neuro', name: 'Neurológica', icon: Brain },
  { id: 'pediatrica', name: 'Pediátrica', icon: Baby },
  { id: 'pelvico', name: 'Piso pélvico', icon: FirstAid },
]

function SectionStatus({ value }) {
  const icon = value === 'Completa' ? CheckCircle : value === 'En curso' ? NotePencil : value === 'No aplica' ? SignOut : Clock
  const Icon = icon
  return <span className={`e2-section-status ${value.toLowerCase().replace(' ', '-')}`}><Icon size={14} weight="bold" />{value}</span>
}

function SafetyChoice({ value, active, onClick }) {
  const meta = value === 'Ausente'
    ? { icon: CheckCircle, cls: 'absent' }
    : value === 'Presente'
      ? { icon: WarningCircle, cls: 'present' }
      : { icon: Info, cls: 'unknown' }
  const Icon = meta.icon
  return <button type="button" className={`${meta.cls} ${active ? 'selected' : ''}`} onClick={onClick} aria-pressed={active}><Icon size={17} weight={active ? 'fill' : 'regular'} />{value}</button>
}

function SafetyPanel({ alarms, setAlarms, readOnly = false }) {
  const positive = Object.values(alarms).some(value => value === 'Presente')
  const unresolved = Object.values(alarms).filter(value => value === 'No investigado').length
  return <aside className={`e2-safety-panel ${positive ? 'has-positive' : ''}`} aria-label="Panel de seguridad">
    <header><div><span className="section-kicker">Seguridad · siempre visible</span><h3><ShieldCheck size={20} />Signos de alarma</h3></div><span className={`e2-safety-summary ${positive ? 'danger' : ''}`}>{positive ? '1 presente' : `${unresolved} por resolver`}</span></header>
    <p className="e2-safety-rule">Cada ítem requiere un estado explícito. “No investigado” nunca equivale a ausente.</p>
    <div className="e2-alarm-list">{Object.entries(alarms).map(([alarm, status]) => <article key={alarm}><strong>{alarm}</strong><div className="e2-tristate">{['Ausente', 'Presente', 'No investigado'].map(value => <SafetyChoice key={value} value={value} active={status === value} onClick={() => !readOnly && setAlarms(current => ({ ...current, [alarm]: value }))} />)}</div></article>)}</div>
    {positive && <div className="e2-positive-action"><WarningCircle size={20} weight="fill" /><div><strong>Conducta obligatoria</strong><p>Suspender pruebas provocativas, informar a la paciente y registrar derivación prioritaria.</p><label>Conducta frente al hallazgo<textarea defaultValue="Se suspende evaluación física y se coordina evaluación médica prioritaria." /></label></div></div>}
    <div className="e2-precautions"><span className="field-label">Precauciones y contraindicaciones</span><p><strong>Precaución:</strong> evitar carga sostenida sobre cabeza hasta completar evaluación.</p></div>
  </aside>
}

function SectionNav({ current, setCurrent, interrupted }) {
  return <nav className="e2-section-nav" aria-label="Secciones de la evaluación"><div className="e2-nav-head"><span className="section-kicker">Secciones clínicas</span><strong>Estado por sección</strong><p>Sin porcentaje de avance</p></div>{sectionItems.map(([id, label, status]) => <button key={id} className={current === id ? 'active' : ''} onClick={() => setCurrent(id)}><span>{label}</span><SectionStatus value={interrupted && id === 'examen' ? 'En curso' : status} /><CaretRight size={16} /></button>)}</nav>
}

function MotiveSection({ readOnly }) {
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Relato de la paciente</span><h2>Motivo y expectativas</h2><p>Registra el problema en sus palabras y la actividad que desea recuperar.</p></div><SectionStatus value="Completa" /></div><label>Motivo de consulta <span className="required">Requerido</span><textarea disabled={readOnly} defaultValue="Quiero volver a vestirme y alcanzar objetos en altura sin dolor ni temor a mover el brazo." /><small>En palabras de la paciente.</small></label><div className="e2-field-grid"><label>Zona<select disabled={readOnly} defaultValue="Hombro"><option>Hombro</option></select></label><label>Lado<select disabled={readOnly} defaultValue="Derecho"><option>Derecho</option><option>Izquierdo</option><option>Bilateral</option><option>No aplica</option></select></label></div><label>Actividad que desea recuperar<input disabled={readOnly} defaultValue="Vestirse y guardar objetos en repisas altas" /></label></div>
}

function HistorySection({ readOnly, approximate }) {
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Historia del problema</span><h2>Inicio, contexto y curso</h2></div><SectionStatus value="En curso" /></div><div className="e2-field-grid"><label>Inicio<input disabled={readOnly} defaultValue={approximate ? 'Mediados de agosto de 2026' : '14 ago 2026'} /></label><label className="e2-check"><input type="checkbox" defaultChecked={approximate} disabled={readOnly} />Fecha aproximada</label></div><label>Mecanismo o contexto<textarea disabled={readOnly} defaultValue="Inicio gradual luego de aumentar tareas de bodega sobre altura de hombro." /></label><label>Curso<select disabled={readOnly} defaultValue="Variable"><option>Variable</option><option>Mejorando</option><option>Estable</option><option>Empeorando</option></select></label><div className="e2-repeat"><span className="field-label">Tratamientos previos y respuesta</span><div><strong>Reposo relativo</strong><span>Alivio transitorio</span><button type="button">Editar</button></div><button type="button" className="button secondary small">Agregar tratamiento</button></div></div>
}

function SymptomsSection({ readOnly, state }) {
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Relato + cuantificación</span><h2>Síntomas</h2></div><SectionStatus value="En curso" /></div><div className="e2-field-grid"><label>Ubicación<input disabled={readOnly} defaultValue="Cara lateral del hombro derecho" /></label><label>Tipo<input disabled={readOnly} defaultValue="Dolor sordo; punzada al elevar" /></label></div><NamedScale state={state} name="Dolor EVA" initialValue={5} context="Al alcanzar una repisa por sobre la cabeza" /><div className="e2-field-grid"><label>Frecuencia<select disabled={readOnly} defaultValue="Intermitente"><option>Intermitente</option><option>Constante</option></select></label><label>Duración<input disabled={readOnly} defaultValue="Minutos; cede al bajar el brazo" /></label></div><div className="e2-list-pair"><article><span className="field-label">Agravantes</span><p>Alcanzar altura · vestirse · dormir sobre lado derecho</p></article><article><span className="field-label">Aliviantes</span><p>Reposo · calor local · adaptar altura de tarea</p></article></div></div>
}

function ExamSection({ readOnly, activeModule, interrupted }) {
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Hallazgos objetivos</span><h2>Examen físico · {specialtyModules.find(item => item.id === activeModule)?.name}</h2><p>Selecciona solo pruebas pertinentes a este problema y a tu competencia.</p></div><SectionStatus value="En curso" /></div>{interrupted && <div className="e2-interrupted-inline"><Clock size={20} /><div><strong>Evaluación interrumpida por dolor</strong><p>Se conserva lo registrado. Pendiente: fuerza isométrica y pruebas específicas.</p></div></div>}<div className="e2-exam-grid"><label>Observación<textarea disabled={readOnly} defaultValue="Protección leve del brazo derecho al retirar chaqueta." /></label><label>Movilidad<textarea disabled={readOnly} defaultValue="Limitación activa de elevación; movilidad pasiva mejor conservada." /></label><label>Fuerza<select disabled={readOnly} defaultValue={interrupted ? 'Pendiente' : 'No evaluado'}><option>No evaluado</option><option>Pendiente</option><option>No aplica</option></select></label><label>Pruebas específicas<select disabled={readOnly} defaultValue="No evaluado"><option>No evaluado</option><option>No aplica</option><option>Pendiente</option></select></label></div><p className="e2-not-pressure"><Info size={17} />No se exige completar observación, movilidad, fuerza, sensibilidad, marcha, equilibrio y pruebas específicas si no son pertinentes.</p></div>
}

function BaselineSection({ readOnly, state, addMeasurement, measurements }) {
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Hallazgo reproducible</span><h2>Línea de base</h2><p>Instrumento, resultado, unidad, lado, condiciones y fecha permanecen juntos.</p></div><SectionStatus value="En curso" /></div><Measurement state={state} onAdd={readOnly ? undefined : addMeasurement} />{measurements > 1 && <Measurement state={state} title="Rotación externa activa" result="58" unit="°" conditions="Sedente, codo a 90°, movimiento activo" />}</div>
}

function OtherSection({ section, readOnly }) {
  if(section==='antecedentes') return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Información relevante</span><h2>Antecedentes relevantes</h2><p>Solo registra antecedentes que modifican la evaluación o intervención.</p></div><SectionStatus value="Completa"/></div><label>Enfermedades, cirugías o lesiones<textarea disabled={readOnly} defaultValue="Sin cirugías de hombro. Hipertensión controlada referida."/></label><div className="e2-field-grid"><label>Medicamentos<input disabled={readOnly} defaultValue="Losartán · dosis no informada"/></label><label>Alergias<select disabled={readOnly} defaultValue="Sin alergias referidas"><option>Sin alergias referidas</option><option>No informado</option></select></label></div></div>
  if(section==='seguridad') return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Seguridad clínica</span><h2>Signos, precauciones y conducta</h2><p>Los estados se registran en el panel persistente. Esta sección reúne el contexto y la conducta.</p></div><SectionStatus value="En curso"/></div><div className="e2-not-pressure"><ShieldCheck size={18}/>Completa cada signo como ausente, presente o no investigado en el panel visible a la derecha.</div><label>Contexto de seguridad<textarea disabled={readOnly} defaultValue="Sin fiebre referida ni pérdida de peso no explicada. Dolor nocturno pendiente de precisar."/></label><label>Contraindicaciones<select disabled={readOnly} defaultValue="No informadas"><option>No informadas</option><option>Presentes</option><option>No aplica</option></select></label></div>
  if(section==='funcion') return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Actividad y participación</span><h2>Función y participación</h2><p>Usa actividades concretas y el grado de dificultad referido.</p></div><SectionStatus value="Completa"/></div><div className="e2-repeat"><span className="field-label">Limitaciones</span><div><strong>Vestirse</strong><span>Dificultad moderada</span><button>Editar</button></div><div><strong>Trabajo sobre hombro</strong><span>Dificultad alta</span><button>Editar</button></div></div><label>Ayudas o apoyos<input disabled={readOnly} defaultValue="Adapta altura de elementos; apoyo ocasional de compañera de trabajo"/></label></div>
  if(section==='documentos') return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Documentos revisados</span><h2>Archivo y verificación</h2><p>Un documento solo puede quedar “revisado” si el archivo está disponible.</p></div><SectionStatus value="No aplica"/></div><div className="e2-not-pressure"><FileText size={18}/>Usa la vista Documentos para revisar archivo, procedencia, condición y hallazgos relevantes.</div></div>
  return <div className="e2-section-content"><div className="e2-section-title"><div><span className="section-kicker">Análisis profesional</span><h2>Conclusión</h2><p>Diferencia hallazgos, hipótesis y diagnóstico kinesiológico.</p></div><SectionStatus value="Vacía"/></div><label>Problemas funcionales <span className="required">Requerido</span><textarea disabled={readOnly} defaultValue="Limitación para alcance sobre cabeza, vestido y tareas laborales sostenidas."/></label><label>Diagnóstico kinesiológico<textarea disabled={readOnly} defaultValue="Limitación funcional del miembro superior derecho para alcance y vestido."/></label><label>Factores relevantes<textarea disabled={readOnly} defaultValue="Carga laboral sobre altura de hombro y temor al movimiento."/></label></div>
}

function SpecialtyView({ activeModule, setActiveModule, minor }) {
  return <section className="e2-specialty-view"><div className="e2-section-title"><div><span className="section-kicker">Módulos seleccionables</span><h2>Examen por especialidad</h2><p>El área de E1 sugiere un módulo; el profesional confirma qué activar.</p></div></div><div className="e2-module-grid">{specialtyModules.map(item => { const Icon=item.icon; const active=activeModule===item.id || (minor && item.id==='pediatrica'); return <button key={item.id} className={active?'active':''} onClick={()=>setActiveModule(item.id)}><Icon size={24}/><strong>{item.name}</strong><span>{item.suggested?'Sugerido por E1':minor&&item.id==='pediatrica'?'Activo por edad':'Disponible'}</span>{active&&<Check size={18} weight="bold"/>}</button>})}</div>{activeModule==='musculo'&&<div className="e2-module-detail"><header><PersonSimpleRun size={24}/><div><strong>Musculoesquelética</strong><p>Movilidad, fuerza, sensibilidad y pruebas específicas seleccionables.</p></div></header><div className="e2-module-options"><label><input type="checkbox" defaultChecked/>Movilidad activa y pasiva</label><label><input type="checkbox" defaultChecked/>Fuerza funcional</label><label><input type="checkbox"/>Sensibilidad</label><label><input type="checkbox"/>Pruebas específicas</label></div></div>}{activeModule==='respira'&&<div className="e2-module-detail"><header><Stethoscope size={24}/><div><strong>Respiratoria</strong><p>Patrón ventilatorio, disnea, tos, secreciones y tolerancia al esfuerzo.</p></div></header><NamedScale state="Borrador" name="Disnea mMRC" max={4} initialValue={1} minLabel="Sin disnea" maxLabel="Disnea intensa" context="Marcha habitual"/></div>}{activeModule==='pelvico'&&<div className="e2-privacy"><Lock size={22}/><div><strong>Privacidad y consentimiento</strong><p>Confirma condiciones de privacidad y el consentimiento aplicable antes de abrir campos del módulo.</p><button className="button primary small">Confirmar y abrir módulo</button></div></div>}{minor&&<div className="e2-minor"><Baby size={22}/><div><strong>Información y escucha del niño, niña o adolescente</strong><label>Información entregada<textarea defaultValue="Se explica la evaluación con lenguaje acorde a su edad."/></label><label>Opinión o preferencias expresadas<textarea defaultValue="Prefiere realizar pruebas de juego antes de las mediciones."/></label><label>Representante presente<input defaultValue="Paula Medina · madre · identidad verificada"/></label></div></div>}</section>
}

function DocumentsView({ unreadable }) {
  return <section className="e2-documents"><div className="e2-section-title"><div><span className="section-kicker">Documento adjunto reutilizado</span><h2>Documentos revisados</h2><p>“Revisado” solo está disponible cuando existe un archivo legible.</p></div><button className="button secondary"><FolderOpen size={18}/>Adjuntar documento</button></div><article className={unreadable?'is-unreadable':''}><span className="e2-doc-icon"><FileText size={25}/></span><div><strong>Ecografía de hombro derecho</strong><p>1 oct 2026 · Centro Imagen Sur · Episodio EP-003</p><span>{unreadable?'Archivo incompleto o ilegible':'Archivo disponible · 3 páginas'}</span></div><div className="e2-document-actions"><button className="button secondary small"><Eye size={17}/>Vista previa</button><label><input type="radio" name="doc" defaultChecked={!unreadable} disabled={unreadable}/>Revisado</label><label><input type="radio" name="doc" defaultChecked={unreadable}/>Mencionado, no disponible</label></div></article><label>Hallazgos relevantes<textarea disabled={unreadable} defaultValue={unreadable?'No se transcriben hallazgos: documento no verificable.':'Tendinopatía del supraespinoso descrita por emisor; correlacionar clínicamente.'}/></label></section>
}

function SummaryView({ interrupted, positive, state, setState }) {
  const validatable=!interrupted&&!positive
  return <section className="e2-summary"><div className="e2-section-title"><div><span className="section-kicker">E2_Resumen_Evaluacion</span><h2>Revisar antes de validar</h2><p>La suficiencia clínica se revisa por decisión, no por porcentaje de llenado.</p></div><span className={`e2-record-badge ${interrupted?'interrupted':''}`}>{interrupted?'Interrumpida':state}</span></div><div className="e2-summary-grid"><article><span>Motivo</span><strong>Recuperar alcance sobre cabeza y autonomía al vestirse.</strong></article><article><span>Seguridad</span><strong>{positive?'Signo presente · conducta registrada':'Sin signos presentes; ítems explícitos.'}</strong></article><article><span>Línea de base</span><strong>Flexión activa 128° · goniómetro · lado derecho.</strong></article><article><span>Problemas funcionales</span><strong>Alcance limitado, dolor al vestirse y menor tolerancia laboral.</strong></article></div><div className="e2-conclusion"><div><span className="field-label">Hallazgos</span><p>Limitación activa y dolor provocable en elevación de hombro derecho.</p></div><div><span className="field-label">Hipótesis profesional</span><p>Alteración de control y tolerancia de carga del complejo del hombro.</p></div><div><span className="field-label">Diagnóstico kinesiológico</span><p>Limitación funcional del miembro superior derecho para alcance y vestido.</p></div></div><label>Decisión inicial<select defaultValue={positive?'Derivar':'Tratar'}><option>Tratar</option><option>Complementar evaluación</option><option>Derivar</option></select></label>{interrupted&&<div className="e2-stop-record"><Clock size={20}/><div><strong>Guardado parcial confirmado</strong><p>Motivo: dolor aumentó durante movilidad activa. Pendientes: fuerza y pruebas específicas.</p><span>Registro local recuperable · último guardado 12:18</span></div></div>}<div className="e2-summary-actions"><button className="button secondary"><FloppyDisk size={18}/>Guardar borrador</button><button className="button secondary" onClick={()=>setState('Interrumpida')}><Clock size={18}/>Marcar interrumpida</button><button className="button primary" disabled={!validatable} onClick={()=>setState('Validada')}><ShieldCheck size={18}/>{positive?'Derivación pendiente':'Validar y firmar'}</button></div></section>
}

function DecisionsView() {
  return <section className="e2-decisions"><div className="e2-section-title"><div><span className="section-kicker">Decisiones de diseño</span><h2>Foco, supuestos y preguntas</h2></div></div><div className="e2-decision-grid"><article><h3>Foco resuelto</h3><ul><li>Navegación por estado, sin porcentaje ni premio por llenar.</li><li>Seguridad persistente y triestado explícito por ítem.</li><li>Relato, hallazgo y análisis se mantienen separados.</li><li>Módulos se agregan sin sobrecargar el caso base.</li><li>Interrumpir conserva datos y declara pendientes.</li></ul></article><article><h3>Supuestos</h3><ul><li>Autoguardado local y sincronización están disponibles.</li><li>El área de E1 solo sugiere; no activa pruebas automáticamente.</li><li>Las evaluaciones parciales quedan bajo autoría del evaluador actual.</li><li>Permisos por rol son propuestas pendientes de confirmación.</li></ul></article><article><h3>Preguntas pendientes</h3><ul><li>Escalas de dolor y función usadas por la clínica.</li><li>Plantillas existentes por especialidad.</li><li>Disponibilidad de dictado e imágenes del examen.</li><li>Lista institucional de signos de alarma.</li><li>Participación de varios profesionales en una evaluación.</li></ul></article></div><div className="notice pending"><Info size={18}/>La lista de signos, el consentimiento de piso pélvico y los criterios de derivación deben quedar configurables; el prototipo no toma decisiones clínicas ni legales.</div><div className="e2-component-change"><ArrowsClockwise size={20}/><div><strong>Ajuste informado a componentes existentes</strong><p><b>Medición</b> y <b>Escala con nombre</b> conservan anatomía, tokens y estados de Fase 0. Se ampliaron mediante propiedades configurables para reutilizar instrumento, unidad, rango y contexto en distintas especialidades, sin crear variantes visuales paralelas.</p></div></div></section>
}

export function E2Evaluation({ viewport = 'tablet', onRecordState }) {
  const initialParams = new URLSearchParams(window.location.search)
  const [view,setView]=useState(initialParams.get('view') || 'evaluacion')
  const [section,setSection]=useState('motivo')
  const [state,setState]=useState(initialParams.get('state') || 'Borrador')
  const [caseMode,setCaseMode]=useState(initialParams.get('case') || 'normal')
  const [module,setModule]=useState(initialParams.get('module') || 'musculo')
  const [measurements,setMeasurements]=useState(1)
  const [alarms,setAlarms]=useState({'Dolor nocturno no mecánico':'No investigado','Trauma significativo reciente':'Ausente','Síntomas sistémicos':'No investigado'})
  const interrupted=state==='Interrumpida'||caseMode==='interrupted'
  const positive=Object.values(alarms).some(value=>value==='Presente')||caseMode==='alarm'
  const displayAlarms=useMemo(()=>caseMode==='alarm'?{...alarms,'Síntomas sistémicos':'Presente'}:alarms,[alarms,caseMode])
  const componentState=state==='Validada'?'Validado':state==='Vacío'?'Vacío':state==='Error'?'Error':'Borrador'
  const readOnly=state==='Validada'
  const changeState=(value)=>{setState(value);onRecordState?.(value)}
  const sectionBody=section==='motivo'?<MotiveSection readOnly={readOnly}/>:section==='historia'?<HistorySection readOnly={readOnly} approximate={caseMode==='approx'}/>:section==='sintomas'?<SymptomsSection readOnly={readOnly} state={componentState}/>:section==='examen'?<ExamSection readOnly={readOnly} activeModule={module} interrupted={interrupted}/>:section==='linea'?<BaselineSection readOnly={readOnly} state={componentState} addMeasurement={()=>setMeasurements(value=>value+1)} measurements={measurements}/>:<OtherSection section={section} readOnly={readOnly}/>
  return <div className="e2-page">
    {positive&&<div className="e2-global-alert"><WarningCircle size={20} weight="fill"/><div><strong>Signo de alarma presente</strong><span>Revisa la conducta antes de continuar o validar la evaluación.</span></div><button onClick={()=>{setView('evaluacion');setSection('seguridad')}}>Ver seguridad</button></div>}
    {caseMode==='offline'&&<div className="e2-offline"><WifiSlash size={19}/><strong>Sin conexión</strong><span>Guardando localmente · se sincronizará al recuperar conexión.</span></div>}
    <header className="e2-stage-head"><div className="e2-stage-title"><span>E2</span><div><strong>Evaluación inicial</strong><small>Línea de base y decisión clínica</small></div></div><div className="e2-view-tabs">{[['evaluacion','Evaluación'],['modulos','Módulos'],['documentos','Documentos'],['resumen','Resumen'],['decisiones','Decisiones']].map(([id,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</div></header>
    <div className="e2-state-controls"><div><span className="field-label">Estado visible</span>{['Vacío','Borrador','Interrumpida','Validada','Error'].map(value=><button key={value} className={state===value?'active':''} onClick={()=>changeState(value)}>{value}</button>)}</div><label>Simular caso borde<select value={caseMode} onChange={event=>setCaseMode(event.target.value)}><option value="normal">Uso normal</option><option value="alarm">Signo de alarma presente</option><option value="interrupted">Interrumpida por dolor</option><option value="minor">Menor de edad</option><option value="offline">Pérdida de conexión</option><option value="approx">Fecha aproximada</option><option value="unreadable">Documento ilegible</option><option value="clarification">Edición posterior</option></select></label></div>
    {caseMode==='clarification'&&<div className="e2-clarification"><Lock size={18}/><div><strong>Evaluación original validada</strong><p>Los cambios se registrarán como aclaración vinculada con autor, fecha y motivo.</p></div><button className="button secondary small">Agregar aclaración</button></div>}
    {view==='evaluacion'&&<div className="e2-workspace"><SectionNav current={section} setCurrent={setSection} interrupted={interrupted}/><main>{sectionBody}<div className="e2-form-actions"><span><FloppyDisk size={16}/>Guardado parcial 12:18</span><button className="button secondary" onClick={()=>changeState('Interrumpida')}><Clock size={18}/>Interrumpir evaluación</button><button className="button primary" onClick={()=>setView('resumen')}>Revisar evaluación<CaretRight size={18}/></button></div></main><SafetyPanel alarms={displayAlarms} setAlarms={setAlarms} readOnly={readOnly}/></div>}
    {view==='modulos'&&<SpecialtyView activeModule={module} setActiveModule={setModule} minor={caseMode==='minor'}/>} 
    {view==='documentos'&&<DocumentsView unreadable={caseMode==='unreadable'}/>} 
    {view==='resumen'&&<SummaryView interrupted={interrupted} positive={positive} state={state} setState={changeState}/>} 
    {view==='decisiones'&&<DecisionsView/>}
  </div>
}
