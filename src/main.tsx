import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Document = { id: string | number; title: string; author?: string; year?: string; pages?: string; type?: string; tags?: string[]; status?: string; excerpt?: string; progress?: number };
type Source = { id?: string | number; documentId?: string | number; title: string; page?: number; passage?: string; score?: number };
type RagAnswer = { answer: string; sources: Source[]; findings?: string[] };

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const endpoint = (path: string) => `${API}${path}`;
const librarySeed: Document[] = [
  { id: 1, title: 'Attention Is All You Need', author: 'Vaswani et al.', year: '2017', pages: '15 pages', type: 'PAPER', tags: ['NLP', 'TRANSFORMERS'], status: 'Indexed', progress: 72, excerpt: 'The Transformer relies entirely on attention mechanisms to draw global dependencies.' },
  { id: 2, title: 'Retrieval-Augmented Generation', author: 'Lewis et al.', year: '2020', pages: '12 pages', type: 'PAPER', tags: ['RAG', 'RETRIEVAL'], status: 'Indexed', progress: 41, excerpt: 'Parametric and non-parametric memory work together for knowledge-intensive tasks.' },
  { id: 3, title: 'BERT: Pre-training of Deep Bidirectional Transformers', author: 'Devlin et al.', year: '2018', pages: '16 pages', type: 'PAPER', tags: ['LANGUAGE', 'NLP'], status: 'Indexed', progress: 88, excerpt: 'Deep bidirectional representations are pre-trained from unlabeled text.' },
  { id: 4, title: 'A Survey of Large Language Models', author: 'Zhao et al.', year: '2023', pages: '48 pages', type: 'SURVEY', tags: ['LLMs', 'EVALUATION'], status: 'Indexed', progress: 22, excerpt: 'A structured review of the development and capabilities of large language models.' },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: .14 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function Logo({ onClick }: { onClick?: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="NEXUS home"><span className="logo-mark">N</span><span><b>NEXUS</b><small>RESEARCH INTELLIGENCE</small></span></button>;
}

function ThemeToggle({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={`Use ${dark ? 'light' : 'dark'} theme`}><span>{dark ? 'LIGHT' : 'DARK'}</span><i /></button>;
}

function Landing({ enter, dark, setDark }: { enter: () => void; dark: boolean; setDark: (v: boolean) => void }) {
  useReveal();
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('');
  const [result, setResult] = useState<RagAnswer | null>(null);
  const [error, setError] = useState('');
  const ask = async () => {
    if (!query.trim() || phase) return;
    setError(''); setResult(null);
    const phases = ['UNDERSTANDING QUERY', 'SEARCHING KNOWLEDGE', 'RANKING EVIDENCE', 'GENERATING RESPONSE'];
    let i = 0; setPhase(phases[0]);
    const timer = window.setInterval(() => { i = Math.min(i + 1, phases.length - 1); setPhase(phases[i]); }, 850);
    try {
      const res = await fetch(endpoint('/api/query'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
      if (!res.ok) throw new Error(`Research service returned ${res.status}`);
      const data = await res.json();
      if (!data.answer || !Array.isArray(data.sources)) throw new Error('The research service returned an invalid response');
      setResult(data);
    } catch (e) {
      setError(`${e instanceof Error ? e.message : 'Research service unavailable'}. No answer was generated without evidence.`);
    } finally { clearInterval(timer); setPhase(''); }
  };
  return <div className="site-shell">
    <header className="site-header"><Logo/><nav aria-label="Main navigation"><a href="#method">Method</a><a href="#graph">Knowledge</a><a href="#ask">Ask</a><a href="#library">Library</a></nav><div className="header-end"><ThemeToggle dark={dark} setDark={setDark}/><button className="enter-link" onClick={enter}>ENTER WORKSPACE <span>↗</span></button></div></header>

    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-meta mono"><span>01 / INTRODUCTION</span><span>MUMBAI · 19°04'N</span></div>
        <div className="hero-stage">
          <p className="hero-kicker">YOUR KNOWLEDGE SHOULD CONNECT.</p>
          <h1 id="hero-title"><span>NEXUS</span><small>RESEARCH<br/>INTELLIGENCE</small></h1>
          <p className="hero-summary">Search your research library, interrogate documents, discover relationships, and generate answers grounded in evidence.</p>
          <button className="primary-action" onClick={enter}>ENTER YOUR WORKSPACE <span>↗</span></button>
          <div className="hero-constellation" aria-hidden="true">
            <svg viewBox="0 0 720 430"><g className="graph-lines"><path d="M112 118L330 205L548 80M330 205L603 310M330 205L165 340M548 80L603 310"/></g><g className="graph-dots"><circle cx="112" cy="118" r="5"/><circle cx="330" cy="205" r="8"/><circle cx="548" cy="80" r="5"/><circle cx="603" cy="310" r="5"/><circle cx="165" cy="340" r="5"/></g></svg>
            <span style={{left:'8%',top:'22%'}}>RETRIEVAL</span><span style={{left:'41%',top:'46%'}}>KNOWLEDGE</span><span style={{left:'74%',top:'13%'}}>ATTENTION</span><span style={{left:'80%',top:'71%'}}>EVIDENCE</span><span style={{left:'15%',top:'79%'}}>LANGUAGE</span>
            <article className="fragment fragment-a">PAPER / 2017<br/><b>ATTENTION<br/>IS ALL YOU NEED</b><small>Vaswani et al.</small></article>
            <article className="fragment fragment-b">SOURCE / 04<br/><b>RETRIEVAL<br/>AUGMENTED</b><small>Lewis et al.</small></article>
          </div>
        </div>
        <a href="#problem" className="scroll-cue mono">SCROLL TO ENTER THE SYSTEM <i>↓</i></a>
      </section>

      <section className="problem" id="problem">
        <div className="section-code mono">02 / THE PROBLEM</div><div className="problem-copy" data-reveal><h2>RESEARCH<br/>IS <em>SCATTERED.</em></h2><p>Your papers live in folders. Your notes live in apps. The idea you need is buried on page 47. NEXUS gives every source a place in one connected research memory.</p></div>
        <div className="scatter-field" aria-hidden="true"><span className="scatter-paper p1">NOTES_04.MD</span><span className="scatter-paper p2">PAPER_FINAL.PDF</span><span className="scatter-paper p3">CITATIONS.BIB</span><span className="scatter-paper p4">REVIEW_V2.DOCX</span><i className="thread"/></div>
      </section>

      <section className="method" id="method">
        <div className="method-intro"><div className="section-code mono">03 / HOW NEXUS THINKS</div><h2>FROM DOCUMENTS<br/><em>TO KNOWLEDGE.</em></h2><p>A transparent path from source material to a grounded answer. Nothing hidden. Nothing invented.</p></div>
        <div className="pipeline" data-reveal>
          {[
            ['01','DOCUMENTS','Your papers enter a private research library.'],['02','CHUNKING','Meaningful passages preserve their context.'],['03','EMBEDDINGS','Concepts become searchable coordinates.'],['04','RETRIEVAL','Relevant evidence rises above the noise.'],['05','GENERATION','The answer is composed from retrieved context.'],['06','CITATIONS','Every claim keeps a path to its source.']
          ].map(([n,t,d], i) => <article className="pipeline-step" key={t}><span className="step-num mono">{n}</span><div className={`step-visual visual-${i}`}><i/><i/><i/><i/></div><div><h3>{t}</h3><p>{d}</p></div></article>)}
        </div>
      </section>

      <section className="graph-section" id="graph">
        <div className="graph-copy" data-reveal><div className="section-code mono">04 / KNOWLEDGE GRAPH</div><h2>EVERYTHING<br/>IS CONNECTED.</h2><p>Ideas do not live in isolation. NEXUS reveals the papers, authors, and concepts surrounding every question.</p><button className="text-link" onClick={enter}>EXPLORE YOUR KNOWLEDGE <span>↗</span></button></div>
        <div className="knowledge-map" aria-label="Knowledge graph illustration">
          <svg viewBox="0 0 720 600"><g className="map-lines"><path d="M355 296L171 165M355 296L560 142M355 296L575 400M355 296L179 443M171 165L76 278M171 165L275 79M560 142L660 242M575 400L470 523M179 443L67 509"/></g>{[[355,296,11],[171,165,7],[560,142,7],[575,400,7],[179,443,7],[76,278,4],[275,79,4],[660,242,4],[470,523,4],[67,509,4]].map((x,i)=><circle key={i} cx={x[0]} cy={x[1]} r={x[2]}/>)}</svg>
          <span className="node center">NEXUS<small>38,492 CHUNKS</small></span><span className="node n1">ATTENTION<small>CONCEPT</small></span><span className="node n2">TRANSFORMERS<small>TOPIC</small></span><span className="node n3">RAG<small>METHOD</small></span><span className="node n4">EVIDENCE<small>CONCEPT</small></span><span className="node n5">VASWANI ET AL.</span><span className="node n6">LLMs</span>
        </div>
      </section>

      <section className="ask-section" id="ask">
        <div className="ask-heading" data-reveal><div className="section-code mono">05 / RETRIEVE & SYNTHESIZE</div><h2>ASK YOUR<br/><em>RESEARCH.</em></h2><p>Not the internet. Not a model's memory. Your indexed evidence.</p></div>
        <div className="ask-console">
          <label htmlFor="research-query" className="mono">WHAT DO YOU WANT TO UNDERSTAND?</label>
          <div className="ask-input"><textarea id="research-query" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}}} placeholder="Compare the attention mechanisms described in my papers."/><button onClick={ask} disabled={!query.trim() || !!phase} aria-label="Submit research question">↗</button></div>
          {phase && <div className="rag-progress"><i/><span>{phase}</span><small>Retrieval is active — waiting for grounded evidence</small></div>}
          {error && <div className="evidence-error"><b>INSUFFICIENT EVIDENCE</b><p>{error}</p><button onClick={enter}>CHECK WORKSPACE CONNECTION →</button></div>}
          {result && <AnswerArticle result={result}/>}
          {!phase && !error && !result && <div className="ask-foot mono"><span>↵ SUBMIT QUERY</span><span>ANSWERS REQUIRE CITED SOURCES</span></div>}
        </div>
      </section>

      <section className="library-story" id="library">
        <div className="library-sticky"><div className="section-code mono">06 / YOUR LIBRARY</div><h2>CONTINUE WHERE<br/>YOU LEFT OFF.</h2><p>Every source becomes part of a durable, searchable body of knowledge.</p></div>
        <div className="paper-rail">{librarySeed.map((d,i)=><DocumentCover key={d.id} doc={d} index={i}/>)}</div>
      </section>

      <Stats/>
      <section className="final-cta"><div className="final-ring"><span>N</span></div><div data-reveal><div className="section-code mono">08 / ENTER THE SYSTEM</div><h2>YOUR RESEARCH.<br/><em>CONNECTED.</em></h2><p>Turn a collection of documents into an evidence-backed research environment.</p><button className="primary-action light" onClick={enter}>OPEN NEXUS <span>↗</span></button></div></section>
    </main>
    <footer className="site-footer"><Logo/><span className="mono">BUILT FOR DEEPER QUESTIONS · 2026</span><a href="#hero-title">BACK TO TOP ↑</a></footer>
  </div>;
}

function AnswerArticle({ result }: { result: RagAnswer }) {
  return <article className="answer-article"><div className="answer-label mono">THE SHORT ANSWER</div><p className="answer-body">{result.answer}</p>{result.findings?.length ? <><div className="answer-label mono">KEY FINDINGS</div><ol>{result.findings.map(x=><li key={x}>{x}</li>)}</ol></> : null}<div className="answer-label mono">SOURCES / {result.sources.length}</div><div className="answer-sources">{result.sources.map((s,i)=><button key={s.id || i} title={s.passage || ''}><span>[{String(i+1).padStart(2,'0')}]</span><b>{s.title}</b><small>{s.page ? `PAGE ${s.page}` : 'SOURCE'} {s.score ? `· ${Math.round(s.score*100)}% MATCH` : ''}</small>{s.passage && <em>“{s.passage}”</em>}</button>)}</div></article>;
}

function DocumentCover({ doc, index }: { doc: Document; index: number }) {
  return <article className={`document-cover cover-${index}`}><div className="cover-top mono"><span>{doc.type} / {doc.year}</span><span>0{index+1}</span></div><div><h3>{doc.title}</h3><p>{doc.author}</p></div><div className="cover-tags mono">{doc.tags?.map(t=><span key={t}>{t}</span>)}</div><div className="reading-progress"><i style={{width:`${doc.progress}%`}}/><small>{doc.progress}% READ</small></div></article>;
}

function Stats() {
  const ref = useRef<HTMLElement>(null); const [active,setActive]=useState(false);
  useEffect(()=>{const io=new IntersectionObserver(([e])=>e.isIntersecting&&setActive(true),{threshold:.4});if(ref.current)io.observe(ref.current);return()=>io.disconnect()},[]);
  const items: [number,string][] = [[1284,'DOCUMENTS'],[38492,'KNOWLEDGE CHUNKS'],[2847,'QUESTIONS ANSWERED']];
  return <section className="stats-section" ref={ref}><div className="section-code mono">07 / THE KNOWLEDGE YOU BUILT</div><div className="stat-list">{items.map(([n,label],i)=><div key={label}><span className="mono">0{i+1}</span><strong>{active ? n.toLocaleString() : '0'}</strong><small>{label}</small></div>)}</div></section>;
}

const workspaceNav = ['Overview','Ask NEXUS','Library','Collections','Search','Saved Insights'];
function Workspace({ exit, dark, setDark }: { exit:()=>void; dark:boolean; setDark:(v:boolean)=>void }) {
  const [view,setView]=useState('Overview'); const [docs,setDocs]=useState<Document[]>(librarySeed); const [loadingDocs,setLoadingDocs]=useState(false);
  useEffect(()=>{setLoadingDocs(true);fetch(endpoint('/api/documents')).then(r=>r.ok?r.json():Promise.reject()).then(d=>Array.isArray(d)&&setDocs(d)).catch(()=>{}).finally(()=>setLoadingDocs(false))},[]);
  return <div className="workspace-shell"><aside className="workspace-sidebar"><Logo onClick={()=>setView('Overview')}/><div className="workspace-id"><span>AR</span><div><b>Alex Rivera</b><small>PERSONAL WORKSPACE</small></div></div><nav>{workspaceNav.map((n,i)=><button key={n} className={view===n?'active':''} onClick={()=>setView(n)}><span>0{i+1}</span>{n}</button>)}</nav><div className="side-bottom"><ThemeToggle dark={dark} setDark={setDark}/><button onClick={exit}>← VIEW STORY</button><small><i/> SYSTEM CONNECTION READY</small></div></aside><div className="workspace-main"><header className="workspace-header"><span className="mono">WORKSPACE / {view.toUpperCase()}</span><div><button className="icon-button" aria-label="Notifications">○</button><button className="profile-button">AR</button></div></header>{view==='Overview'&&<WorkspaceOverview docs={docs} setView={setView}/>} {view==='Ask NEXUS'&&<AskWorkspace/>} {view==='Library'&&<Library docs={docs} setDocs={setDocs} loading={loadingDocs}/>} {view==='Search'&&<SearchWorkspace docs={docs}/>} {view==='Collections'&&<Collections/>} {view==='Saved Insights'&&<Saved/>}</div></div>;
}

function PageHead({ code, title, children }: { code:string; title:string; children?:React.ReactNode }) { return <div className="page-head"><div><div className="section-code mono">{code}</div><h1>{title}</h1></div>{children}</div> }
function WorkspaceOverview({docs,setView}:{docs:Document[];setView:(v:string)=>void}) { return <div className="workspace-page"><PageHead code="01 / OVERVIEW" title="Your knowledge, in focus."><button className="outline-action" onClick={()=>setView('Ask NEXUS')}>ASK A QUESTION ↗</button></PageHead><div className="workspace-stats"><div><strong>{docs.length}</strong><span>DOCUMENTS</span></div><div><strong>38,492</strong><span>KNOWLEDGE CHUNKS</span></div><div><strong>2,847</strong><span>QUESTIONS</span></div><div><strong>146</strong><span>CONNECTED TOPICS</span></div></div><div className="workspace-block-head"><div><span className="mono">CONTINUE RESEARCH</span><h2>Pick up the thread.</h2></div><button onClick={()=>setView('Library')}>VIEW LIBRARY →</button></div><div className="workspace-docs">{docs.slice(0,4).map((d,i)=><DocumentCover key={d.id} doc={d} index={i}/>)}</div><div className="overview-lower"><article><span className="mono">RECENT ACTIVITY</span><h3>YOUR RESEARCH TRAIL</h3>{docs.slice(0,3).map((d,i)=><div className="activity" key={d.id}><span>0{i+1}</span><div><b>{d.title}</b><small>{i===0?'Read 14 minutes ago':'Indexed in your library'}</small></div></div>)}</article><article className="question-card"><span className="mono">SUGGESTED QUESTION</span><h3>How do retrieval quality and citation accuracy influence factual grounding?</h3><button onClick={()=>setView('Ask NEXUS')}>ASK THIS QUESTION ↗</button></article></div></div> }

function AskWorkspace() { const [q,setQ]=useState('');const [phase,setPhase]=useState('');const [result,setResult]=useState<RagAnswer|null>(null);const [error,setError]=useState(''); const ask=async()=>{if(!q.trim())return;setPhase('SEARCHING KNOWLEDGE');setError('');setResult(null);try{const r=await fetch(endpoint('/api/query'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q})});if(!r.ok)throw Error(`Service returned ${r.status}`);const d=await r.json();if(!d.answer||!Array.isArray(d.sources))throw Error('Invalid evidence response');setResult(d)}catch(e){setError(`${e instanceof Error?e.message:'Connection unavailable'}. NEXUS will not generate an uncited answer.`)}finally{setPhase('')}};return <div className="workspace-page"><PageHead code="02 / GROUNDED RETRIEVAL" title="Ask NEXUS."><span className="connection"><i/> EVIDENCE REQUIRED</span></PageHead><div className="research-workbench"><aside className="query-history"><span className="mono">RESEARCH THREADS</span><button className="new-thread">＋ NEW QUESTION</button>{['Retrieval and factual grounding','Compare attention methods','Evaluation benchmarks'].map((x,i)=><button key={x}><small>{i?'OCT 03':'TODAY'}</small>{x}</button>)}</aside><section className="research-center"><div className="large-query"><label>WHAT DO YOU WANT TO UNDERSTAND?</label><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question grounded in your library…"/><button onClick={ask} disabled={!q.trim()||!!phase}>RETRIEVE EVIDENCE <span>↗</span></button></div>{phase&&<div className="rag-progress"><i/><span>{phase}</span><small>Connecting query to indexed passages</small></div>}{error&&<div className="evidence-error"><b>INSUFFICIENT EVIDENCE</b><p>{error}</p></div>}{result&&<AnswerArticle result={result}/>}</section></div></div> }

function Library({docs,setDocs,loading}:{docs:Document[];setDocs:(d:Document[])=>void;loading:boolean}) {const [search,setSearch]=useState('');const [mode,setMode]=useState<'grid'|'list'>('grid');const [uploading,setUploading]=useState('');const shown=useMemo(()=>docs.filter(d=>`${d.title} ${d.author} ${d.tags?.join(' ')}`.toLowerCase().includes(search.toLowerCase())),[docs,search]);const upload=async(files:FileList|null)=>{if(!files?.length)return;setUploading('UPLOADING');const body=new FormData();Array.from(files).forEach(f=>body.append('files',f));try{const r=await fetch(endpoint('/api/documents'),{method:'POST',body});if(!r.ok)throw Error(`Upload failed (${r.status})`);setUploading('INDEXING');const data=await r.json();setDocs([...((Array.isArray(data)?data:data.documents)||[]),...docs]);setTimeout(()=>setUploading(''),700)}catch(e){setUploading(e instanceof Error?e.message:'Upload unavailable')}};return <div className="workspace-page"><PageHead code="03 / SOURCE LIBRARY" title="Documents."><label className="upload-button">＋ ADD DOCUMENTS<input type="file" multiple accept=".pdf,.docx,.txt,.md" onChange={e=>upload(e.target.files)}/></label></PageHead>{uploading&&<div className={uploading.includes('failed')||uploading.includes('unavailable')?'upload-status error':'upload-status'}><span>{uploading}</span><i/></div>}<div className="library-tools"><label><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents, authors, topics…"/></label><button>ALL TYPES ↓</button><button>RECENTLY ADDED ↓</button><div><button className={mode==='grid'?'active':''} onClick={()=>setMode('grid')}>GRID</button><button className={mode==='list'?'active':''} onClick={()=>setMode('list')}>LIST</button></div></div><div className="library-count mono">{loading?'SYNCING LIBRARY':`${shown.length} DOCUMENTS · ${shown.filter(d=>d.status==='Indexed').length} INDEXED`}</div>{mode==='grid'?<div className="editorial-grid">{shown.map((d,i)=><DocumentCover key={d.id} doc={d} index={i%4}/>)}</div>:<div className="document-list"><div className="list-head"><span>TITLE</span><span>AUTHOR</span><span>YEAR</span><span>STATUS</span></div>{shown.map(d=><article key={d.id}><div><b>{d.title}</b><small>{d.tags?.join(' · ')}</small></div><span>{d.author}</span><span>{d.year}</span><span className="status-dot"><i/>{d.status||'Indexed'}</span></article>)}</div>}</div> }

function SearchWorkspace({docs}:{docs:Document[]}) {const [q,setQ]=useState('');const shown=docs.filter(d=>`${d.title} ${d.author} ${d.excerpt}`.toLowerCase().includes(q.toLowerCase()));return <div className="workspace-page search-page"><PageHead code="04 / SEMANTIC SEARCH" title="Find something."/><div className="search-hero"><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your knowledge…"/><span>⌕</span></div><div className="search-groups"><div><div className="group-label mono">DOCUMENTS / {shown.length}</div>{shown.map(d=><article key={d.id}><span>{d.type}</span><div><h3>{d.title}</h3><p>{d.excerpt}</p><small>{d.author} · {d.year} · MATCHED BY CONCEPT</small></div></article>)}</div><aside><div className="group-label mono">TOPICS</div>{['ATTENTION','RETRIEVAL','LANGUAGE MODELS','EVALUATION','GROUNDING'].map((x,i)=><button key={x}>{x}<span>{34-i*4}</span></button>)}</aside></div></div> }
function Collections(){return <div className="workspace-page"><PageHead code="05 / RESEARCH SETS" title="Collections."><button className="outline-action">＋ NEW COLLECTION</button></PageHead><div className="folder-grid">{[['FINAL YEAR PROJECT','24','The active body of work for your final submission.'],['GENERATIVE AI','18','Models, methods, and evaluation frameworks.'],['NLP','32','Language, representation, and retrieval.'],['LITERATURE REVIEW','12','Sources selected for close reading.']].map(([n,c,d],i)=><article key={n}><div className={`folder-tab f${i}`}/><span className="mono">COLLECTION / 0{i+1}</span><h2>{n}</h2><p>{d}</p><footer><b>{c} DOCUMENTS</b><button>OPEN →</button></footer></article>)}</div></div>}
function Saved(){return <div className="workspace-page"><PageHead code="06 / RESEARCH ARCHIVE" title="Your research notes."/><div className="insight-list">{['How does retrieval improve factual grounding?','Why does self-attention scale better than recurrence?'].map((q,i)=><article key={q}><span className="mono">SAVED INSIGHT / 0{i+1}</span><h2>{q}</h2><p>{i?'Parallel computation and direct token-to-token paths reduce the sequential constraints of recurrent architectures.':'Retrieval separates knowledge storage from language generation and makes each claim traceable to current, domain-specific evidence.'}</p><footer><span>[02] CITED SOURCES · OCT 2026</span><button>OPEN NOTE ↗</button></footer></article>)}</div></div>}

function App(){const[workspace,setWorkspace]=useState(false);const[dark,setDark]=useState(()=>localStorage.getItem('nexus-theme')==='dark');useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('nexus-theme',dark?'dark':'light')},[dark]);return workspace?<Workspace exit={()=>setWorkspace(false)} dark={dark} setDark={setDark}/>:<Landing enter={()=>setWorkspace(true)} dark={dark} setDark={setDark}/>}

createRoot(document.getElementById('root')!).render(<App/>);
