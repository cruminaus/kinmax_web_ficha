import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIcon, ArrowRight, ArrowsClockwise, CalendarBlank, CaretRight,
  Check, CheckCircle, Clock, FileText, FloppyDisk, Info,
  LinkSimple, Lock, NotePencil, Path, Scales, ShieldCheck, Signpost,
  TrendUp, User, UserSwitch, WarningCircle,
} from '@phosphor-icons/react'
import { ComparisonTable, ConsentBlock, DocumentAttachment, DoseIndicator, LinkedClarification, Measurement } from './ClinicalComponents.jsx'

const views = [
  ['inicio', 'Inicio'], ['estado', 'Estado actual'], ['comparacion', 'Comparación'],
  ['objetivos', 'Objetivos'], ['decision', 'Análisis y decisión'],
  ['plan', 'Plan actualizado'], ['decisiones', 'Decisiones de diseño'],
]

const triggers = [
  ['planned', 'Fecha planificada', CalendarBlank],
  ['change', 'Cambio clínico', ActivityIcon],
  ['stalled', 'Falta de progreso', TrendUp],
  ['new', 'Nuevo antecedente', FileText],
  ['discharge', 'Preparación del alta', Signpost],
]

const sessions = [
  ['3 oct 2026', 'Sesión 1', 'Movilidad asistida · educación'],
  ['10 oct 2026', 'Sesión 2', 'Control de carga · programa domiciliario'],
  ['17 oct 2026', 'Sesión 3', 'Fortalecimiento progresivo'],
  ['24 oct 2026', 'Sesión 4', 'Alcance funcional · ajuste de dosis'],
]

function SectionHead({ kicker, title, text, action }) {
  return <header className="e5-section-head"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2><p>{text}</p></div>{action}</header>
}

function StartView({ trigger, setTrigger, absent, outsideAgenda }) {
  if (absent) return <section className="e5-view"><div className="e5-absence"><CalendarBlank size={30} /><div><span className="section-kicker">Evento de agenda · no clínico</span><h2>Paciente ausente a la reevaluación planificada</h2><p>No se crea una reevaluación ni se registra un estado actual. La indicación permanece pendiente y el evento queda en la agenda.</p><div><button className="button secondary">Registrar inasistencia</button><button className="button primary">Reprogramar reevaluación</button></div></div></div><div className="e5-boundary"><Info size={18} /><span><strong>No cuenta como E5.</strong> Una ausencia no genera comparación, decisión clínica ni firma.</span></div></section>
  return <section className="e5-view">
    <SectionHead kicker="E5_Inicio_Reevaluacion" title="¿Por qué reevaluamos hoy?" text="Selecciona uno o más disparadores clínicos. No existe una cantidad universal de sesiones." action={outsideAgenda && <span className="e5-outside"><Clock size={16} />Iniciada fuera de agenda</span>} />
    <div className="e5-trigger-grid">{triggers.map(([id,label,Icon])=><button key={id} className={trigger===id?'active':''} onClick={()=>setTrigger(id)}><Icon size={22}/><span><strong>{label}</strong><small>{id==='planned'?'Según criterio del plan':id==='change'?'Puede iniciarse hoy':id==='stalled'?'Revisar barreras y adherencia':id==='new'?'Dato recibido después': 'Conectar con E6'}</small></span>{trigger===id&&<Check size={18} weight="bold"/>}</button>)}</div>
    {trigger==='stalled'&&<div className="e5-suggestion"><WarningCircle size={19}/><div><strong>Revisión sugerida</strong><p>Explora barreras, adherencia, contexto y pertinencia del plan antes de concluir falta de respuesta.</p></div></div>}
    <article className="e5-episode-summary"><header><div><span className="section-kicker">Resumen del episodio · solo referencia</span><h3>4 sesiones efectivas · 3–24 oct 2026</h3></div><span>Plan E3 · versión 2</span></header><div className="e5-session-timeline">{sessions.map(([date,name,detail])=><div key={date}><span className="e5-session-dot"><CalendarBlank size={16}/></span><div><time>{date}</time><strong>{name}</strong><p>{detail}</p></div></div>)}</div><div className="e5-no-copy"><Lock size={18}/><span><strong>Este resumen no es el estado actual.</strong> La condición de hoy se registra nuevamente en la siguiente vista.</span></div></article>
  </section>
}

function CurrentStateView({ readOnly, empty }) {
  return <section className="e5-view"><SectionHead kicker="E5_Estado_Actual" title="Registrar la condición de hoy" text="Lo anterior permanece como referencia. Esta vista recibe información nueva de la paciente y del examen." />
    <div className="e5-current-grid"><label>Síntomas actuales<textarea disabled={readOnly} placeholder={empty?'No evaluado':''} defaultValue={empty?'':'Dolor leve al final del alcance y sin dolor nocturno durante la última semana.'}/></label><label>Capacidades recuperadas<textarea disabled={readOnly} placeholder={empty?'No informado':''} defaultValue={empty?'':'Se viste de forma independiente y alcanza repisas a la altura de los ojos.'}/></label><label>Limitaciones persistentes<textarea disabled={readOnly} placeholder={empty?'Pendiente':''} defaultValue={empty?'':'Dificultad para sostener objetos sobre la cabeza por más de un minuto.'}/></label></div>
    <div className="e5-current-source"><article><User size={20}/><div><span>Relato de la paciente</span><p>“Puedo hacer más cosas sola, pero todavía me canso al trabajar arriba.”</p></div></article><article><Scales size={20}/><div><span>Hallazgo actual</span><p>Elevación activa 146°, dolor EVA 2/10 al final del rango.</p></div></article></div>
    <Measurement state={readOnly?'Validado':empty?'Vacío':'Borrador'} title="Flexión activa de hombro · medición actual" result="146" unit="°" date="4 nov 2026" conditions="De pie, movimiento activo" />
  </section>
}

function ComparisonView({ mode, state, setMode }) {
  const componentState = state==='Validada'?'Validado':state==='Vacío'?'Vacío':state==='Error'?'Error':'Borrador'
  return <section className="e5-view"><SectionHead kicker="E5_Comparacion_Tablet" title="Valor inicial y valor actual" text="Instrumento, unidad, lado y condiciones permanecen visibles antes de interpretar el cambio." action={<label className="e5-compare-mode">Variante<select value={mode} onChange={e=>setMode(e.target.value)}><option value="same">Mismo instrumento</option><option value="different">Instrumento distinto</option><option value="missing">Sin línea de base</option></select></label>} />
    <ComparisonTable state={componentState} variant={mode} />
    <div className="e5-graph-option"><TrendUp size={20}/><div><strong>Gráfico de evolución opcional</strong><p>Podría complementar la tabla cuando existan varias mediciones equivalentes; nunca la reemplaza.</p></div><button className="button secondary small" disabled>Configuración pendiente</button></div>
  </section>
}

function ObjectiveReview({ title, source, initialState='Parcial', evidence=true, readOnly }) {
  const [status,setStatus]=useState(initialState)
  const [hasEvidence,setHasEvidence]=useState(evidence)
  return <article className="e5-objective"><header><div><span className="section-kicker">Objetivo original E3 · solo lectura</span><h3>{title}</h3></div><span className="e5-source"><LinkSimple size={15}/>{source}</span></header><div className="e5-objective-review"><div className="e5-status-options">{['Alcanzado','Parcial','Pendiente'].map(value=><button key={value} className={status===value?'active':''} disabled={readOnly} onClick={()=>setStatus(value)}>{value==='Alcanzado'?<CheckCircle size={17}/>:value==='Parcial'?<Clock size={17}/>:<Info size={17}/>} {value}</button>)}</div><label className="e5-evidence-toggle"><input type="checkbox" checked={!hasEvidence} disabled={readOnly} onChange={e=>setHasEvidence(!e.target.checked)}/>Evidencia no disponible</label></div>{hasEvidence?<div className="e5-evidence"><span>Evidencia de esta reevaluación</span><p>Flexión activa 146° y relato de mayor autonomía para vestirse.</p><button>Vincular medición</button></div>:<div className="e5-evidence missing"><Info size={17}/><span>Estado registrado sin evidencia disponible. No se infiere cumplimiento.</span></div>}</article>
}

function ObjectivesView({ readOnly }) {
  return <section className="e5-view"><SectionHead kicker="E5_Revision_Objetivos" title="Revisar sin reescribir" text="El objetivo de E3 permanece protegido; E5 agrega estado y evidencia." /><ObjectiveReview title="Alcanzar una repisa sobre la cabeza con dolor tolerable" source="Plan E3 v2" readOnly={readOnly}/><ObjectiveReview title="Vestirse de forma independiente con menor dificultad" source="Plan E3 v2" initialState="Alcanzado" evidence={false} readOnly={readOnly}/></section>
}

function ReferralBlock({ decision }) {
  return <article className="e5-referral"><FileText size={24}/><div><span className="section-kicker">Bloque condicional</span><h3>{decision==='derivar'?'Derivación':'Evaluación complementaria'}</h3><div className="e5-referral-grid"><label>Destino o especialidad<input defaultValue={decision==='derivar'?'Medicina física y rehabilitación':'Evaluación médica complementaria'}/></label><label>Prioridad<select defaultValue="Preferente"><option>Preferente</option><option>Habitual</option><option>Urgente según criterio clínico</option></select></label></div><label>Motivo y antecedentes enviados<textarea defaultValue="Persistencia de limitación para carga sostenida sobre cabeza pese a mejoría de movilidad."/></label><DocumentAttachment state="Borrador" title="resumen_reevaluacion_E5.pdf" meta="Resumen clínico · 4 nov 2026 · Klga. Valentina Soto" association="Episodio EP-003 · Reevaluación E5" access="clinical"/></div></article>
}

function DecisionView({ decision, setDecision, patientDecision, setPatientDecision, newProcedure }) {
  const needsPlan=decision==='continuar'||decision==='modificar'
  return <section className="e5-view"><SectionHead kicker="E5_Analisis_Decision" title="Interpretar y decidir" text="Hallazgo, interpretación, barreras y pronóstico se registran por separado." />
    <div className="e5-analysis-grid"><article><span>Hallazgo</span><p>Flexión activa 146°, EVA 2/10 al final del rango y autonomía recuperada para vestirse.</p></article><article><span>Interpretación profesional</span><p>Mejoría de movilidad y función básica; persiste baja tolerancia a carga sostenida.</p></article><article><span>Barreras y contexto</span><p>Exposición laboral repetida sobre altura de hombro y adherencia domiciliaria irregular.</p></article><article><span>Pronóstico actualizado</span><p>Se considera posible continuar progresión gradual, sujeto a respuesta y revisión. No constituye promesa de resultado.</p></article></div>
    <div className="e5-decision-block"><span className="field-label">Decisión dominante · requerida</span><div className="e5-decision-options">{[['continuar','Continuar'],['modificar','Modificar'],['complementar','Complementar'],['derivar','Derivar'],['suspender','Suspender'],['cerrar','Cerrar']].map(([id,label])=><button key={id} className={decision===id?'active':''} onClick={()=>setDecision(id)}>{label}</button>)}</div><label>Fundamento obligatorio<textarea defaultValue={decision==='cerrar'?'Objetivos funcionales principales alcanzados; se propone cierre con autocuidado y señales de consulta.':decision==='derivar'?'Persiste limitación de tolerancia a carga; se solicita evaluación complementaria antes de progresar.':'Existe mejoría objetiva y funcional; se ajustará la progresión para tolerancia de carga.'}/></label></div>
    {(decision==='derivar'||decision==='complementar')&&<ReferralBlock decision={decision}/>} {decision==='cerrar'&&<div className="e5-next-stage"><Signpost size={24}/><div><strong>Continuar hacia E6 · Alta o cierre</strong><p>Se precargarán objetivos revisados, comparación, decisión, fundamento y recomendaciones. E6 exige revisión antes de validar.</p></div><button className="button primary">Preparar E6<ArrowRight size={17}/></button></div>}
    {needsPlan&&<div className="e5-next-stage"><ArrowsClockwise size={24}/><div><strong>{decision==='modificar'?'Actualizar plan antes de volver a E4':'Continuar con el plan revisado'}</strong><p>La nueva versión mostrará diferencias y quedará disponible en E4 como referencia.</p></div><button className="button primary">Revisar plan actualizado<ArrowRight size={17}/></button></div>}
    {newProcedure&&<div className="e5-new-procedure"><WarningCircle size={21}/><div><strong>La decisión incorpora un procedimiento nuevo</strong><p>Actualiza E3 y verifica el consentimiento aplicable antes de ejecutarlo.</p></div></div>}
    {newProcedure&&<ConsentBlock state="Borrador" procedure="Procedimiento nuevo propuesto en E5" decision="Acepta" requiredWritten signed={false}/>} 
    <article className="e5-participation"><header><User size={21}/><div><span className="section-kicker">Participación de la paciente</span><h3>Preferencias, información y decisión</h3></div></header><label>Preferencias<textarea defaultValue="Prefiere continuar con ejercicios breves y revisar adaptación de tareas laborales."/></label><label>Información entregada<textarea defaultValue="Se explican resultados, alternativas, límites de la comparación y próximos pasos."/></label><div className="e5-patient-choice"><span>Respuesta a la decisión</span>{['Acepta','Rechaza'].map(value=><button key={value} className={patientDecision===value?'active':''} onClick={()=>setPatientDecision(value)}>{value}</button>)}</div>{patientDecision==='Rechaza'&&<div className="e5-reject-fields"><label>Alternativas discutidas<textarea defaultValue="Pausa del plan, evaluación complementaria o autocuidado con control posterior."/></label><label>Conducta acordada<textarea defaultValue="La paciente solicita 7 días para decidir; no se aplica el cambio propuesto."/></label></div>}</article>
  </section>
}

function PlanView({ decision }) {
  const enabled=decision==='continuar'||decision==='modificar'
  if(!enabled) return <section className="e5-view"><div className="e5-empty-branch"><Lock size={26}/><h2>Plan actualizado no corresponde a esta decisión</h2><p>Selecciona continuar o modificar para crear una nueva versión vinculada a E4.</p></div></section>
  return <section className="e5-view"><SectionHead kicker="E5_Plan_Actualizado" title="Plan actualizado · versión 3" text="Las diferencias con la versión 2 permanecen visibles antes de confirmar." action={<span className="e5-version-chip">Borrador v3</span>}/><div className="e5-plan-diff"><header><span>Elemento</span><span>Versión 2</span><span>Versión 3 propuesta</span></header><div><strong>Meta</strong><span>Alcance 150° con EVA ≤3</span><span className="changed">Mantener rango y sostener carga 1 min</span></div><div><strong>Intervención</strong><span>Banda amarilla</span><span className="changed">Progresión a banda roja según tolerancia</span></div><div><strong>Frecuencia</strong><span>2 veces por semana</span><span>2 veces por semana</span></div><div><strong>Revisión</strong><span>31 oct 2026</span><span className="changed">Al alcanzar tolerancia o ante cambio clínico</span></div></div><DoseIndicator state="Borrador" title="Rotación externa con banda" values={[["Series","3"],["Repeticiones","8"],["Carga","Banda roja condicional"],["Descanso","75 s"]]} label="Plan actualizado"/><div className="e5-e4-connection"><Path size={22}/><div><strong>Conexión con E4</strong><p>Al validar, E4 mostrará la versión 3 como plan vigente. Las sesiones anteriores conservarán la versión que estaba activa.</p></div><button className="button primary">Confirmar nueva versión</button></div></section>
}

function DesignNotes() {
  return <section className="e5-view"><SectionHead kicker="Decisiones de diseño" title="Comparar sin forzar conclusiones" text="La tabla conserva el contexto de medición; la interpretación y la decisión nunca se calculan automáticamente."/><div className="e5-notes"><article><h3>Foco resuelto</h3><ul><li>Comparación contextual y tres variantes explícitas.</li><li>Resumen E4 solo como referencia, sin copiar estado actual.</li><li>Objetivos E3 protegidos con estado y evidencia E5.</li><li>Una decisión dominante con fundamento obligatorio.</li><li>Transición trazable hacia E4 o E6.</li></ul></article><article><h3>Supuestos</h3><ul><li>E2, E3 y E4 exponen datos estructurados al mismo episodio.</li><li>Una reevaluación puede iniciarse fuera de agenda.</li><li>El profesional autenticado firma su propia autoría.</li><li>El plan actualizado conserva versiones anteriores.</li></ul></article><article><h3>Preguntas pendientes</h3><ul><li>Si la clínica desea gráfico además de tabla.</li><li>Reglas de recordatorio por fecha o número de sesiones.</li><li>Catálogo institucional de instrumentos comparables.</li><li>Permisos para reevaluar y modificar plan.</li><li>Canal para informar resultados al paciente.</li></ul></article></div><div className="e5-component-change"><ArrowsClockwise size={20}/><div><strong>Ajuste informado a la Tabla comparativa</strong><p>El componente base ahora admite mismo instrumento, instrumento distinto y línea de base no disponible; conserva estados vacío, borrador, validado, error y deshabilitado.</p></div></div></section>
}

export function E5Reevaluation({viewport='tablet',onRecordState}){
  const params=new URLSearchParams(window.location.search)
  const initialCase=params.get('case')||'normal'
  const [view,setView]=useState(params.get('view')||'inicio')
  const [recordState,setRecordStateLocal]=useState(params.get('state')||'Borrador')
  const [caseMode,setCaseMode]=useState(initialCase)
  const [trigger,setTrigger]=useState(initialCase==='stalled'?'stalled':initialCase==='sudden'?'change':'planned')
  const [comparison,setComparison]=useState(initialCase==='different'?'different':initialCase==='missing'?'missing':'same')
  const [decision,setDecision]=useState(initialCase==='derive'?'derivar':initialCase==='close'?'cerrar':'modificar')
  const [patientDecision,setPatientDecision]=useState(initialCase==='reject'?'Rechaza':'Acepta')
  const readOnly=recordState==='Validada'
  const empty=recordState==='Vacío'
  const absent=caseMode==='absent'
  const outsideAgenda=caseMode==='sudden'
  const otherProfessional=caseMode==='otherprofessional'
  const newProcedure=caseMode==='newprocedure'
  const setRecordState=value=>{setRecordStateLocal(value);onRecordState?.(value)}
  useEffect(()=>{if(caseMode==='different')setComparison('different');if(caseMode==='missing')setComparison('missing');if(caseMode==='stalled')setTrigger('stalled');if(caseMode==='sudden')setTrigger('change');if(caseMode==='derive')setDecision('derivar');if(caseMode==='close')setDecision('cerrar');if(caseMode==='reject')setPatientDecision('Rechaza')},[caseMode])
  const body=view==='inicio'?<StartView trigger={trigger} setTrigger={setTrigger} absent={absent} outsideAgenda={outsideAgenda}/>:view==='estado'?<CurrentStateView readOnly={readOnly} empty={empty}/>:view==='comparacion'?<ComparisonView mode={comparison} state={recordState} setMode={setComparison}/>:view==='objetivos'?<ObjectivesView readOnly={readOnly}/>:view==='decision'?<DecisionView decision={decision} setDecision={setDecision} patientDecision={patientDecision} setPatientDecision={setPatientDecision} newProcedure={newProcedure}/>:view==='plan'?<PlanView decision={decision}/>:<DesignNotes/>
  const next=view==='inicio'?'estado':view==='estado'?'comparacion':view==='comparacion'?'objetivos':view==='objetivos'?'decision':view==='decision'&&['continuar','modificar'].includes(decision)?'plan':'decision'
  return <div className={`e5-page viewport-${viewport}`}>
    {otherProfessional&&<div className="e5-author-banner"><UserSwitch size={21}/><div><strong>Reevaluación realizada por profesional distinto</strong><p>Autor: Klgo. Matías Leiva · Tratante del episodio: Klga. Valentina Soto. Ambos permanecen visibles en el registro.</p></div></div>}
    {caseMode==='clarification'&&<LinkedClarification state="Borrador" title="Aclaración vinculada a reevaluación validada" text="Se precisa que la condición de medición actual fue de pie, sin apoyo externo." audit="Reevaluación original protegida · Motivo, autor y fecha obligatorios"/>}
    <header className="e5-stage-head"><div className="e5-stage-title"><span>E5</span><div><strong>Reevaluación y ajuste</strong><small>Comparar, interpretar y decidir continuidad</small></div></div><nav>{views.map(([id,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</nav></header>
    <div className="e5-controls"><div><span className="field-label">Estado visible</span>{['Vacío','Borrador','Validada','Con plan actualizado','Error'].map(value=><button key={value} className={recordState===value?'active':''} onClick={()=>setRecordState(value)}>{value}</button>)}</div><label>Simular caso borde<select value={caseMode} onChange={e=>setCaseMode(e.target.value)}><option value="normal">Uso normal</option><option value="different">Instrumento distinto</option><option value="missing">Sin línea de base</option><option value="stalled">Falta de progreso</option><option value="sudden">Cambio súbito fuera de agenda</option><option value="absent">Paciente ausente</option><option value="otherprofessional">Otro profesional</option><option value="derive">Derivar</option><option value="close">Cerrar hacia E6</option><option value="newprocedure">Procedimiento nuevo</option><option value="reject">Paciente rechaza decisión</option><option value="clarification">Aclaración posterior</option></select></label></div>
    {recordState==='Error'&&<div className="e5-error"><WarningCircle size={20}/><div><strong>Reevaluación incompleta</strong><p>Falta fundamento de la decisión y condiciones de la medición actual.</p></div><button onClick={()=>setView('decision')}>Revisar</button></div>}
    {body}
    {!absent&&view!=='decisiones'&&<footer className="e5-actions"><span><FloppyDisk size={16}/>Autoguardado 10:42</span><button className="button secondary">Guardar borrador</button><button className="button primary" onClick={()=>setView(next)}>{view==='decision'&&!['continuar','modificar'].includes(decision)?'Guardar decisión':'Continuar'}<CaretRight size={17}/></button>{view==='plan'&&<button className="button primary" onClick={()=>setRecordState('Con plan actualizado')}><ShieldCheck size={17}/>Validar reevaluación</button>}</footer>}
  </div>
}
