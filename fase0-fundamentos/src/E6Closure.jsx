import { useEffect, useState } from 'react'
import {
  ArrowRight, CalendarBlank, CaretRight, Check, CheckCircle, Clock,
  EnvelopeSimple, FileText, FloppyDisk, Info, LinkSimple, Lock, NotePencil,
  PaperPlaneTilt, Phone, Plus, ShieldCheck, Signpost, User, WarningCircle,
} from '@phosphor-icons/react'
import { ComparisonTable, DocumentAttachment, LinkedClarification } from './ClinicalComponents.jsx'

const views = [
  ['inicio','Inicio'],['resumen','Resumen'],['resultado','Resultado final'],['objetivos','Objetivos'],
  ['continuidad','Continuidad'],['informe','Informe y entrega'],['confirmacion','Confirmación'],['consistencia','Consistencia F0–F6'],
]

const motives = [
  ['goals','Objetivos cumplidos'],['referral','Derivación'],['patient','Decisión del paciente'],
  ['interruption','Interrupción'],['other','Otro'],
]

function SectionHead({kicker,title,text,action}){
  return <header className="e6-section-head"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2><p>{text}</p></div>{action}</header>
}

function ClosureTimeline({closed=false}){
  return <div className="e6-episode-line" aria-label="Línea de tiempo del episodio cerrado">{['E1','E2','E3','E4','E5','E6'].map((stage,index)=><div key={stage} className={`${index<5?'done':''} ${stage==='E6'?'current':''} ${closed?'closed':''}`}><span>{index<5||closed?<Check size={14} weight="bold"/>:stage}</span><div><strong>{stage}</strong><small>{stage==='E1'?'Ingreso':stage==='E2'?'Evaluación':stage==='E3'?'Plan':stage==='E4'?'Sesiones':stage==='E5'?'Reevaluación':closed?'Cerrado':'Cierre'}</small></div></div>)}</div>
}

function MotiveFields({motive}){
  if(motive==='referral') return <div className="e6-conditional"><Signpost size={21}/><div><span className="section-kicker">Condicional · derivación</span><div className="e6-field-grid"><label>Destino requerido<input defaultValue="Medicina física y rehabilitación"/></label><label>Documento asociado<select defaultValue="informe"><option value="informe">Informe de cierre E6</option><option value="resumen">Resumen clínico</option></select></label></div><DocumentAttachment state="Borrador" title="derivacion_cierre_EP003.pdf" meta="Derivación · 18 nov 2026 · Klga. Valentina Soto" association="Episodio EP-003 · Cierre E6" access="clinical"/></div></div>
  if(motive==='patient'||motive==='interruption') return <div className="e6-conditional warning"><WarningCircle size={21}/><div><span className="section-kicker">Información entregada obligatoria</span><label>Riesgos, alternativas y conducta informada<textarea defaultValue={motive==='patient'?'Se explican posibles consecuencias de interrumpir el plan, alternativas disponibles y señales para volver a consultar.':'Se informa que no fue posible completar la evaluación final, las alternativas de continuidad y cuándo solicitar atención.'}/></label></div></div>
  if(motive==='other') return <div className="e6-conditional neutral"><NotePencil size={21}/><label>Especificar otro motivo<textarea placeholder="Describe el motivo de cierre…"/></label></div>
  return null
}

function StartView({route,setRoute,motive,setMotive,closed}){
  return <section className="e6-view"><SectionHead kicker="E6_Inicio_Cierre" title="Elegir la ruta de cierre" text="La ruta define qué información puede afirmarse y qué debe quedar explícitamente como no disponible."/>
    <div className="e6-route-grid"><button className={route==='evaluated'?'active':''} onClick={()=>setRoute('evaluated')}><CheckCircle size={28}/><span><strong>Con evaluación final</strong><small>Hay estado actual, mediciones y revisión clínica de objetivos.</small></span>{route==='evaluated'&&<Check size={19} weight="bold"/>}</button><button className={route==='without'?'active':''} onClick={()=>setRoute('without')}><Clock size={28}/><span><strong>Sin evaluación final</strong><small>Paciente no vuelve, interrupción o abandono. Se usa el último estado conocido.</small></span>{route==='without'&&<Check size={19} weight="bold"/>}</button></div>
    {route==='without'&&<div className="e6-no-inference"><Lock size={20}/><div><strong>No se puede inferir recuperación</strong><p>Esta ruta no permite seleccionar “recuperado”. El cierre describe el último estado documentado y la información faltante.</p></div></div>}
    <article className="e6-motive"><header><div><span className="section-kicker">Campo obligatorio</span><h3>Motivo del cierre</h3></div><span className="required-chip">Requerido</span></header><div className="e6-motive-options">{motives.map(([id,label])=><button key={id} className={motive===id?'active':''} onClick={()=>setMotive(id)}>{motive===id&&<Check size={16} weight="bold"/>}{label}</button>)}</div><MotiveFields motive={motive}/></article>
    <ClosureTimeline closed={closed}/>
  </section>
}

function SummaryView({reviewed,setReviewed}){
  return <section className="e6-view"><SectionHead kicker="E6_Resumen_Episodio" title="Resumen precargado para revisión" text="El sistema propone un borrador desde E1–E5. El profesional debe verificarlo antes de validar." action={<span className="e6-origin"><LinkSimple size={15}/>Origen: registro clínico</span>}/>
    <div className="e6-generated"><header><div><FileText size={22}/><div><strong>Borrador generado desde el episodio</strong><small>Editable · no firmado · actualizado al 18 nov 2026</small></div></div><span>BORRADOR</span></header><div className="e6-summary-grid"><label>Problema inicial<textarea defaultValue="Dolor y limitación funcional de hombro derecho para vestirse y alcanzar objetos sobre la cabeza."/></label><label>Periodo<input defaultValue="26 ago–18 nov 2026"/></label><label>Sesiones efectivas<input defaultValue="8"/><small>2 inasistencias excluidas del conteo</small></label><label>Intervenciones relevantes<textarea defaultValue="Educación, movilidad activa asistida, fortalecimiento progresivo y adaptación de tareas."/></label></div><label className={`e6-review-check ${reviewed?'checked':''}`}><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/><ShieldCheck size={20}/><span><strong>Revisé el resumen contra el registro</strong><small>Esta confirmación es obligatoria antes de validar el cierre.</small></span></label></div>
  </section>
}

function ContactRow({date,channel,result}){
  const Icon=channel==='Teléfono'?Phone:EnvelopeSimple
  return <div className="e6-contact-row"><Icon size={18}/><span><strong>{date}</strong><small>{channel}</small></span><p>{result}</p><button aria-label="Editar contacto"><NotePencil size={17}/></button></div>
}

function ResultView({route,comparison,setComparison}){
  if(route==='without') return <section className="e6-view"><SectionHead kicker="E6_Sin_Evaluacion_Final" title="Último estado conocido y contactos" text="Se documenta lo que sí consta. Lo ausente conserva su significado." action={<span className="e6-state-chip pending"><Clock size={15}/>Pendiente de contacto</span>}/>
    <div className="e6-known-state"><header><CalendarBlank size={20}/><div><strong>Último estado conocido</strong><small>24 oct 2026 · última sesión efectiva</small></div></header><p>La paciente alcanzaba 146° de flexión activa y refería dificultad para sostener carga sobre la cabeza. No existe examen posterior.</p></div>
    <article className="e6-contacts"><header><div><span className="section-kicker">Trazabilidad</span><h3>Contactos realizados</h3></div><button className="button secondary small"><Plus size={16}/>Agregar contacto</button></header><ContactRow date="2 nov 2026" channel="Teléfono" result="Sin respuesta; se deja mensaje de voz."/><ContactRow date="6 nov 2026" channel="Correo" result="Correo enviado con alternativas para retomar o cerrar."/><ContactRow date="13 nov 2026" channel="Teléfono" result="Sin respuesta; segundo intento registrado."/></article>
    <div className="e6-missing-info"><Info size={20}/><div><strong>Información faltante</strong><p>No disponible: estado actual, medición final, revisión presencial de objetivos y preferencia reciente de la paciente.</p></div></div>
    <div className="e6-forbidden"><Lock size={19}/><span><strong>“Recuperado” no está disponible.</strong> El cierre administrativo no interpreta la evolución clínica.</span></div>
  </section>
  return <section className="e6-view"><SectionHead kicker="E6_Resultado_Final" title="Resultado documentado, no supuesto" text="El fin del episodio o del paquete de sesiones no equivale por sí solo a recuperación." action={<label className="e6-compare-select">Variante<select value={comparison} onChange={e=>setComparison(e.target.value)}><option value="same">Mismo instrumento</option><option value="different">Instrumento distinto</option><option value="missing">Sin línea de base</option></select></label>}/>
    <div className="e6-final-grid"><label>Estado final<textarea defaultValue="Mejoría funcional para actividades básicas; persiste menor tolerancia a carga sostenida sobre la cabeza."/></label><label>Limitaciones persistentes<textarea defaultValue="Fatiga en tareas laborales repetidas sobre altura de hombro."/></label></div><ComparisonTable state="Borrador" variant={comparison} currentLabel="Valor final · E6" current={{value:'151°',instrument:'Goniómetro',unit:'grados',side:'Derecho',conditions:'De pie, movimiento activo',date:'18 nov 2026'}} difference="+23°" explanation="Se registra QuickDASH al cierre para describir función percibida; no se calcula diferencia con la goniometría inicial."/>
  </section>
}

function GoalCard({title,status,evidence,pending=false}){
  return <article className={`e6-goal ${pending?'pending':''}`}><header><div><span className="section-kicker">Objetivo original E3 · solo lectura</span><h3>{title}</h3></div><span className={`e6-goal-state ${status.toLowerCase()}`}>{status}</span></header><div><span>Evidencia del cierre</span><p>{evidence}</p></div>{pending&&<label>Conducta obligatoria<textarea defaultValue="Continuar programa domiciliario y consultar si aumenta el dolor o disminuye la función."/></label>}</article>
}

function ObjectivesView(){
  return <section className="e6-view"><SectionHead kicker="E6_Revision_Objetivos" title="Estado final de los objetivos" text="El objetivo original permanece protegido; el cierre agrega estado, evidencia y conducta."/><GoalCard title="Vestirse de forma independiente con menor dificultad" status="Alcanzado" evidence="Autonomía informada por la paciente y observada en reevaluación E5."/><GoalCard title="Sostener carga sobre la cabeza durante un minuto" status="Pendiente" evidence="Tolera aproximadamente 40 segundos con fatiga." pending/><div className="e6-pending-warning"><WarningCircle size={20}/><div><strong>Queda 1 objetivo pendiente</strong><p>El cierre puede continuar solo si se registra una conducta clara para ese objetivo.</p></div></div></section>
}

function ContinuityView(){
  return <section className="e6-view"><SectionHead kicker="E6_Continuidad" title="Indicaciones accionables para la paciente" text="El cierre deja próximos pasos concretos, precauciones y vías de consulta."/><div className="e6-continuity-grid"><article><span className="section-kicker">Programa domiciliario</span><h3>Hombro derecho · versión 4</h3><p>Movilidad activa y fortalecimiento progresivo tres veces por semana.</p><DocumentAttachment state="Borrador" title="programa_domiciliario_v4.pdf" meta="Versión 4 · 18 nov 2026" association="Episodio EP-003 · Continuidad E6" access="patient"/></article><article><span className="section-kicker">Recomendaciones</span><ul><li>Progresar carga según tolerancia.</li><li>Alternar tareas sobre altura de hombro.</li><li>Mantener pausas breves durante la jornada.</li></ul></article><article className="precaution"><span className="section-kicker">Precauciones</span><ul><li>Suspender si aparece dolor intenso o pérdida súbita de fuerza.</li><li>Consultar ante dolor nocturno nuevo o síntomas neurológicos.</li></ul></article><article><span className="section-kicker">Control y derivación</span><p><strong>Control:</strong> a demanda o ante cambio clínico.</p><p><strong>Derivación:</strong> no indicada al cierre actual.</p></article></div></section>
}

function ReportView({delivered,setDelivered}){
  return <section className="e6-view"><SectionHead kicker="E6_Informe_Alta" title="Emisión y constancia de entrega" text="El documento, su destinatario y la entrega conservan trazabilidad visible."/><article className="e6-report"><header><div><FileText size={24}/><div><strong>Informe de alta emitido</strong><small>INF-E6-2026-0031 · 18 nov 2026 · 11:34</small></div></div><span className="e6-state-chip valid"><CheckCircle size={15}/>Emitido</span></header><div className="e6-field-grid"><label>Destinatario<select defaultValue="patient"><option value="patient">Paciente</option><option value="referrer">Profesional derivador</option><option value="insurer">Asegurador</option></select></label><label>Emitido por<input defaultValue="Klga. Valentina Soto" disabled/></label></div><DocumentAttachment state="Validado" title="informe_alta_EP003.pdf" meta="Firmado · 18 nov 2026 · 11:34" association="Episodio EP-003 · Cierre E6" access="patient"/></article><article className="e6-delivery"><header><div><PaperPlaneTilt size={21}/><div><span className="section-kicker">Puede registrar recepción</span><h3>Constancia de entrega</h3></div></div><label className="e6-toggle"><input type="checkbox" checked={delivered} onChange={e=>setDelivered(e.target.checked)}/>Informe entregado</label></header>{delivered?<div className="e6-field-grid three"><label>Quién recibió<input defaultValue="Camila Rojas M."/></label><label>Cómo<select defaultValue="email"><option value="email">Correo electrónico</option><option value="print">Impreso</option><option value="portal">Portal</option></select></label><label>Registrado por<input defaultValue="Recepción · Marcela Díaz"/></label></div>:<div className="e6-empty-delivery"><Info size={18}/>Sin constancia de entrega registrada.</div>}<p className="e6-audit-line">Emisión y entrega son eventos separados. Registrar entrega no permite editar el contenido clínico.</p></article></section>
}

function PostCloseActivity(){
  return <article className="e6-post-close"><header><div><span className="section-kicker">Después del cierre</span><h3>Solicitudes vinculadas sin reabrir el episodio</h3></div><button className="button secondary small"><Plus size={16}/>Nueva actividad</button></header><div className="e6-activity-row"><FileText size={20}/><div><strong>Solicitud de copia del informe</strong><small>2 dic 2026 · Recepción · Entregada por correo</small></div><span>Documento 02</span></div><div className="e6-activity-row"><Info size={20}/><div><strong>Consulta administrativa</strong><small>5 dic 2026 · Estado de reembolso</small></div><span>Sin reapertura</span></div></article>
}

function ConfirmationView({route,state,setState,reviewed,caseMode}){
  const closed=state==='Cerrado'||state==='Cerrado administrativamente'
  if(closed) return <section className="e6-view"><div className="e6-closed-hero"><CheckCircle size={34}/><div><span className="section-kicker">Episodio cerrado · consultable</span><h2>{state}</h2><p>Validado el 18 nov 2026 por Klga. Valentina Soto. El contenido queda protegido.</p></div><button className="button secondary">Ver cierre firmado</button></div><ClosureTimeline closed/><div className="e6-new-episode"><Plus size={22}/><div><strong>Un nuevo problema abre otro episodio</strong><p>No se edita este cierre para registrar una condición nueva.</p></div><button className="button primary">Abrir nuevo episodio</button></div><PostCloseActivity/><div className="e6-permissions"><ShieldCheck size={20}/><p><strong>Permisos propuestos:</strong> kinesiólogo valida; recepción registra entrega y consulta solo datos administrativos. Pendiente confirmar con la clínica.</p></div></section>
  const warnings=[]
  if(!reviewed) warnings.push('Resumen precargado sin revisión profesional')
  if(caseMode==='drafts') warnings.push('2 registros clínicos continúan en borrador')
  if(caseMode==='missingmotive') warnings.push('Motivo de cierre no seleccionado')
  warnings.push('1 objetivo pendiente con conducta registrada')
  return <section className="e6-view"><SectionHead kicker="E6_Confirmacion" title="Revisión antes de cerrar" text="El episodio se protege después de validar; cualquier precisión posterior será una aclaración vinculada."/><div className="e6-warning-list">{warnings.map((item,index)=><div key={item} className={index===warnings.length-1?'resolved':''}>{index===warnings.length-1?<CheckCircle size={19}/>:<WarningCircle size={19}/>}<span>{item}</span>{index<warnings.length-1&&<button>Resolver</button>}</div>)}</div><div className="e6-close-summary"><div><span>Ruta</span><strong>{route==='evaluated'?'Con evaluación final':'Sin evaluación final'}</strong></div><div><span>Estado resultante</span><strong>{route==='evaluated'?'Cerrado':'Cerrado administrativamente'}</strong></div><div><span>Valida</span><strong>Klga. Valentina Soto</strong></div></div><div className="e6-validation-note"><Lock size={21}/><p>Al validar, el cierre no se sobrescribe. Las correcciones se agregan mediante una aclaración vinculada.</p></div><button className="button primary e6-close-button" disabled={!reviewed||caseMode==='drafts'||caseMode==='missingmotive'} onClick={()=>setState(route==='evaluated'?'Cerrado':'Cerrado administrativamente')}><ShieldCheck size={18}/>Validar y cerrar episodio</button></section>
}

const componentRows = [
  ['Cabecera persistente','E1–E6','E6 agrega estado de episodio cerrado, sin cambiar su anatomía.'],['Línea de tiempo','F0, E4, E5, E6','E6 incorpora representación final consultable.'],['Medición','E2, E3, E5','Sin variantes nuevas.'],['Documento adjunto','E1, E3, E5, E6','E6 agrega asociaciones de continuidad, derivación e informe.'],['Consentimiento','F0, E3, E5','Se completó en E3; reutilizado en E5.'],['Selector de episodio','F0, E1, E4–E6','Episodio cerrado sigue seleccionable.'],['Aclaración vinculada','F0, E1, E3, E5, E6','E6 la usa después del cierre validado.'],['Relato / hallazgo / análisis','F0, E2, E4, E5','Sin cambios.'],['Escala con nombre','F0, E2, E4','Sin cambios.'],['Tabla comparativa','F0, E5, E6','Extendida en E5: equivalente, instrumento distinto y sin línea de base.'],['Indicador de dosis','F0, E3, E4, E5','Sin cambios.'],['Panel de objetivos','E3, E5, E6','E5/E6 protegen el original y agregan estado/evidencia.'],
]

function ConsistencyView(){
  return <section className="e6-view"><SectionHead kicker="Revisión final del sistema" title="Consistencia Fases 0–6" text="Inventario transversal de componentes, cambios, inconsistencias y decisiones aún abiertas."/><article className="e6-system-table"><header><span>Componente</span><span>Etapas</span><span>Variantes o cambios</span></header>{componentRows.map(row=><div key={row[0]}>{row.map(cell=><span key={cell}>{cell}</span>)}</div>)}</article><div className="e6-review-columns"><article><h3>Cambios a componentes F0</h3><ul><li><strong>Tabla comparativa:</strong> tres variantes clínicas para evitar comparaciones inválidas.</li><li><strong>Consentimiento:</strong> ramas acepta, rechaza y difiere; bloqueo escrito configurable.</li><li><strong>Cabecera:</strong> muestra episodio cerrado sin perder acceso.</li><li><strong>Aclaración:</strong> admite notas posteriores a validación y cierre.</li></ul></article><article><h3>Inconsistencias detectadas y resolución</h3><ul><li><strong>Validado / Validada:</strong> normalizar a “Validado” para documentos y “Cerrado” para episodios.</li><li><strong>Pendiente:</strong> calificar siempre el objeto: contacto, decisión o dato.</li><li><strong>Acción principal:</strong> mantenerla al extremo inferior derecho en E2–E6.</li><li><strong>Autoguardado:</strong> usar una sola ubicación en el pie persistente.</li><li><strong>Resumen / estado actual:</strong> rotular siempre origen y fecha para evitar copias implícitas.</li></ul></article></div><div className="e6-question-groups"><article><h3>Legal</h3><ul><li>Método y validez de firmas.</li><li>Procedimientos que exigen consentimiento escrito.</li><li>Plantilla, destinatarios y conservación del informe.</li></ul></article><article><h3>Clínico</h3><ul><li>Catálogo de instrumentos comparables.</li><li>Criterios institucionales de alarma, derivación y alta.</li><li>Seguimiento posterior y uso del gráfico evolutivo.</li></ul></article><article><h3>Operativo</h3><ul><li>Plazo para cierre administrativo sin atención.</li><li>Reapertura del episodio versus episodio nuevo.</li><li>Canales de entrega y recordatorios.</li><li>Permisos definitivos por rol.</li></ul></article><article><h3>Técnico</h3><ul><li>Firma electrónica e interoperabilidad.</li><li>Versionado, retención y auditoría.</li><li>Agenda, notificaciones y portal de pacientes.</li><li>Disponibilidad offline y sincronización.</li></ul></article></div></section>
}

export function E6Closure({viewport='tablet',onRecordState}){
  const params=new URLSearchParams(window.location.search)
  const initialCase=params.get('case')||'normal'
  const [view,setView]=useState(params.get('view')||'inicio')
  const [caseMode,setCaseMode]=useState(initialCase)
  const [route,setRoute]=useState(initialCase==='noeval'?'without':'evaluated')
  const [motive,setMotive]=useState(initialCase==='derive'?'referral':initialCase==='patient'?'patient':initialCase==='interrupt'?'interruption':initialCase==='other'?'other':'goals')
  const [state,setStateLocal]=useState(params.get('state')|| (initialCase==='pending'?'Pendiente de contacto':'Borrador'))
  const [comparison,setComparison]=useState(initialCase==='different'?'different':initialCase==='missing'?'missing':'same')
  const [reviewed,setReviewed]=useState(initialCase!=='unreviewed')
  const [delivered,setDelivered]=useState(true)
  const closed=state==='Cerrado'||state==='Cerrado administrativamente'
  const setState=value=>{setStateLocal(value);onRecordState?.(value)}
  useEffect(()=>{if(caseMode==='noeval'||caseMode==='pending')setRoute('without');else setRoute('evaluated');if(caseMode==='derive')setMotive('referral');if(caseMode==='patient')setMotive('patient');if(caseMode==='interrupt')setMotive('interruption');if(caseMode==='other')setMotive('other');if(caseMode==='different')setComparison('different');if(caseMode==='missing')setComparison('missing');if(caseMode==='closed')setState('Cerrado');if(caseMode==='request')setState('Cerrado');if(caseMode==='clarification')setState('Cerrado')},[caseMode])
  const body=view==='inicio'?<StartView route={route} setRoute={setRoute} motive={motive} setMotive={setMotive} closed={closed}/>:view==='resumen'?<SummaryView reviewed={reviewed} setReviewed={setReviewed}/>:view==='resultado'?<ResultView route={route} comparison={comparison} setComparison={setComparison}/>:view==='objetivos'?<ObjectivesView/>:view==='continuidad'?<ContinuityView/>:view==='informe'?<ReportView delivered={delivered} setDelivered={setDelivered}/>:view==='confirmacion'?<ConfirmationView route={route} state={state} setState={setState} reviewed={reviewed} caseMode={caseMode}/>:<ConsistencyView/>
  const order=views.map(v=>v[0]);const next=order[Math.min(order.indexOf(view)+1,order.length-1)]
  return <div className={`e6-page viewport-${viewport} ${closed?'episode-closed':''}`}>
    {caseMode==='clarification'&&<LinkedClarification state="Borrador" title="Aclaración posterior al cierre" text="Se precisa que el programa domiciliario entregado corresponde a la versión 4." audit="Cierre original protegido · Nota vinculada del 3 dic 2026"/>}
    <header className="e6-stage-head"><div className="e6-stage-title"><span>E6</span><div><strong>Alta o cierre del episodio</strong><small>Resultado, continuidad y trazabilidad</small></div></div><nav>{views.map(([id,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</nav></header>
    <div className="e6-controls"><div><span className="field-label">Estado visible</span>{['Vacío','Borrador','Pendiente de contacto','Cerrado','Cerrado administrativamente','Error'].map(value=><button key={value} className={state===value?'active':''} onClick={()=>setState(value)}>{value}</button>)}</div><label>Simular caso borde<select value={caseMode} onChange={e=>setCaseMode(e.target.value)}><option value="normal">Cierre con evaluación final</option><option value="noeval">Sin evaluación final</option><option value="derive">Motivo: derivación</option><option value="patient">Decisión del paciente</option><option value="interrupt">Interrupción</option><option value="other">Otro motivo</option><option value="different">Instrumento distinto</option><option value="missing">Sin línea de base</option><option value="pending">Pendiente de contacto</option><option value="drafts">Registros en borrador</option><option value="missingmotive">Motivo faltante</option><option value="closed">Episodio cerrado</option><option value="request">Solicitud posterior</option><option value="clarification">Aclaración posterior</option></select></label></div>
    {state==='Error'&&<div className="e6-global-error"><WarningCircle size={20}/><div><strong>El cierre requiere revisión</strong><p>Falta motivo, revisión del resumen o conducta para objetivos pendientes.</p></div><button onClick={()=>setView('confirmacion')}>Revisar</button></div>}
    {body}
    {view!=='consistencia'&&!(view==='confirmacion'&&closed)&&<footer className="e6-actions"><span><FloppyDisk size={16}/>Autoguardado 12:06</span><button className="button secondary">Guardar borrador</button><button className="button primary" onClick={()=>setView(next)}>{view==='confirmacion'?'Revisar cierre':'Continuar'}<CaretRight size={17}/></button></footer>}
  </div>
}
