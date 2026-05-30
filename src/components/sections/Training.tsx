import { useState, useEffect, useRef, useCallback } from 'react';
import { T } from '../T';
import { playFlip, playMatch, playMiss, playReady, playTooEarly, playReactionHit, playCrash, playScore } from '../../sounds';

// ── Game 1: Reaction Racer ──────────────────────────────────────────────────
function ReactionRacer() {
  const [state, setState] = useState<'idle'|'waiting'|'ready'|'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [best, setBest] = useState<number>(Infinity);
  const [round, setRound] = useState(0);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (state === 'idle' || state === 'result') {
      setState('waiting');
      const delay = 1500 + Math.random() * 3500;
      timerRef.current = setTimeout(() => {
        setState('ready');
        startRef.current = Date.now();
        playReady();
      }, delay);
    } else if (state === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('result');
      setReactionTime(-1);
      playTooEarly();
    } else if (state === 'ready') {
      const t = Date.now() - startRef.current;
      setReactionTime(t);
      if (t < best) setBest(t);
      setRound(r => r + 1);
      setState('result');
      playReactionHit(t);
    }
  };

  const color = state === 'waiting' ? '#0f1728' : state === 'ready' ? 'rgba(0,232,122,.12)' : 'var(--card-bg)';
  const borderColor = state === 'ready' ? 'var(--green)' : 'var(--border)';

  return (
    <div>
      <p style={{ fontSize:'.88rem', color:'var(--muted)', marginBottom:'1.5rem', lineHeight:1.65 }}>
        <T en="Click when the arena turns green. Test your reaction speed — just like an AI sensor responding to impact." np="क्षेत्र हरियो हुँदा क्लिक गर्नुहोस्। आफ्नो प्रतिक्रिया गति परीक्षण गर्नुहोस्।" />
      </p>
      <div onClick={handleClick} style={{ width:'100%', height:260, background:color, border:`2px solid ${borderColor}`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', transition:'background .15s, border-color .25s', position:'relative', overflow:'hidden', boxShadow: state === 'ready' ? '0 0 40px rgba(0,232,122,.2)' : 'none' }} data-testid="game1-arena">
        <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
          {[20,35,50,65,80].map(pct => (
            <div key={pct} style={{ position:'absolute', left:`${pct}%`, top:0, bottom:0, width:2, background:'rgba(255,255,255,.04)', borderRadius:2 }} />
          ))}
        </div>
        <div style={{ fontSize:'1.2rem', fontWeight:700, color: state === 'ready' ? 'var(--green)' : 'var(--muted)', textAlign:'center', zIndex:2, padding:'0 2rem' }}>
          {state === 'idle' && <T en="Click to Start" np="सुरु गर्न क्लिक गर्नुहोस्" />}
          {state === 'waiting' && <T en="Wait for green..." np="हरियोको प्रतीक्षा गर्नुहोस्..." />}
          {state === 'ready' && <span style={{ animation:'pulse-green 1s infinite', display:'inline-block' }}><T en="CLICK NOW!" np="अहिले क्लिक गर्नुहोस्!" /></span>}
          {state === 'result' && (
            reactionTime === -1
              ? <T en="⚠️ Too early! Click to retry." np="⚠️ धेरै चाँडो! फेरि प्रयास गर्नुहोस्।" />
              : reactionTime != null
                ? <>{reactionTime}ms — {reactionTime < 200 ? '🔥' : reactionTime < 300 ? '⚡' : '👍'} <T en="Click to retry." np="फेरि प्रयास गर्नुहोस्।" /></>
                : ''
          )}
        </div>
      </div>
      <div style={{ display:'flex', gap:16, marginTop:14, flexWrap:'wrap' }}>
        {[
          { en:'Rounds', np:'राउन्ड', val: round },
          { en:'Last', np:'अन्तिम', val: reactionTime && reactionTime > 0 ? `${reactionTime}ms` : '—' },
          { en:'Best', np:'सर्वश्रेष्ठ', val: best < Infinity ? `${best}ms` : '—' },
        ].map((s, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:100, padding:'6px 16px', fontSize:'.78rem', fontWeight:600, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ color:'var(--r)' }}><T en={s.en} np={s.np} />:</span> {s.val}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Game 2: SOS Memory Match ────────────────────────────────────────────────
const CARD_ICONS = ['🚑','🚓','🏥','⚠️','🔥','🆘','🛡','📡'];

interface MemCard { id: number; icon: string; flipped: boolean; matched: boolean; }

function MemoryMatch() {
  const [cards, setCards] = useState<MemCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);

  const init = useCallback(() => {
    const icons = [...CARD_ICONS, ...CARD_ICONS].sort(() => Math.random() - .5);
    setCards(icons.map((icon, i) => ({ id: i, icon, flipped: false, matched: false })));
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
  }, []);

  useEffect(() => { init(); }, [init]);

  const flip = (id: number) => {
    if (flipped.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    playFlip();
    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid)!);
      if (a.icon === b.icon) {
        setTimeout(() => playMatch(), 200);
        setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c));
        setMatches(m => m + 1);
        setScore(s => s + 10);
        setFlipped([]);
      } else {
        setTimeout(() => {
          playMiss();
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 750);
      }
    }
  };

  const won = matches === CARD_ICONS.length;

  return (
    <div>
      <p style={{ fontSize:'.88rem', color:'var(--muted)', marginBottom:'1.5rem', lineHeight:1.65 }}>
        <T en="Match emergency service pairs. Train your memory like an AI dispatch system identifying priority threats." np="आपतकालीन सेवा जोडीहरू मिलाउनुहोस्। एआई डिस्प्याच प्रणालीजस्तै आफ्नो सम्झना तालिम गर्नुहोस्।" />
      </p>
      {won && (
        <div style={{ textAlign:'center', padding:'1rem', background:'rgba(0,232,122,.08)', border:'1px solid rgba(0,232,122,.2)', borderRadius:12, marginBottom:16, color:'var(--green)', fontWeight:700 }}>
          🎉 <T en={`Excellent! All matched in ${moves} moves!`} np={`उत्कृष्ट! ${moves} चालमा सबै मिलाइयो!`} />
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:'1rem' }}>
        {cards.map(c => (
          <div key={c.id} onClick={() => flip(c.id)} style={{
            aspectRatio:'1', background: c.matched ? 'rgba(0,232,122,.1)' : c.flipped ? 'rgba(255,28,53,.1)' : 'rgba(255,255,255,.04)',
            border: c.matched ? '2px solid rgba(0,232,122,.4)' : c.flipped ? '2px solid rgba(255,28,53,.4)' : '1px solid var(--border)',
            borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: c.flipped || c.matched ? '1.8rem' : '1.4rem', cursor: c.matched ? 'default' : 'pointer',
            transition:'all .25s', transform: c.flipped ? 'scale(1.06)' : 'scale(1)',
          }} data-testid={`card-${c.id}`}>
            {c.flipped || c.matched ? c.icon : '?'}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:100, padding:'5px 14px', fontSize:'.78rem', color:'var(--cyan)', fontFamily:'var(--font-mono)' }}>
          <T en="Score" np="स्कोर" />: {score}
        </div>
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:100, padding:'5px 14px', fontSize:'.78rem', color:'var(--muted)' }}>
          <T en="Moves" np="चाल" />: {moves}
        </div>
        <button onClick={init} style={{ padding:'6px 14px', borderRadius:100, background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.2)', color:'var(--r)', fontFamily:'inherit', fontSize:'.78rem', fontWeight:600, cursor:'pointer' }} data-testid="btn-reset-memory">
          <T en="Restart" np="पुनः सुरु" />
        </button>
      </div>
    </div>
  );
}

// ── Game 3: Road Guardian ────────────────────────────────────────────────────
interface G3State { playerX: number; obstacles: { x: number; y: number; w: number }[]; score: number; running: boolean; }

function RoadGuardian() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<G3State>({ playerX: 200, obstacles: [], score: 0, running: false });
  const keysRef = useRef({ left: false, right: false });
  const rafRef = useRef<number>(0);
  const lastScoreSound = useRef(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, W, H);

    // Road
    ctx.fillStyle = '#111424';
    ctx.fillRect(60, 0, W - 120, H);

    // Lane lines
    ctx.strokeStyle = 'rgba(255,255,255,.07)';
    ctx.setLineDash([22, 14]);
    ctx.lineWidth = 2;
    [W/3, W*2/3].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Player car body
    const px = s.playerX, py = H - 80;
    ctx.fillStyle = '#FF1C35';
    ctx.beginPath(); ctx.roundRect(px - 17, py, 34, 54, 6); ctx.fill();
    // windshield
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.fillRect(px - 11, py + 5, 22, 13);
    // wheels
    ctx.fillStyle = '#060810';
    [[-17,6],[-17,36],[17-4,6],[17-4,36]].forEach(([ox,oy]) => {
      ctx.beginPath(); ctx.roundRect(px + ox, py + oy, 4, 10, 2); ctx.fill();
    });

    // Obstacles
    s.obstacles.forEach(ob => {
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath(); ctx.roundRect(ob.x - ob.w/2, ob.y, ob.w, 50, 5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.fillRect(ob.x - ob.w/2 + 5, ob.y + 5, ob.w - 10, 11);
    });

    // Score HUD
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(`Score: ${Math.floor(s.score)}`, 12, 24);
    const spd = 3 + Math.floor(s.score / 180) * 0.5;
    ctx.fillStyle = 'rgba(255,100,120,.8)';
    ctx.fillText(`Speed: ${spd.toFixed(1)}x`, 12, 42);
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    const speed = 4;
    if (keysRef.current.left)  s.playerX = Math.max(78, s.playerX - speed);
    if (keysRef.current.right) s.playerX = Math.min((canvasRef.current?.width ?? 500) - 78, s.playerX + speed);

    const obSpeed = 3 + Math.floor(s.score / 180) * 0.5;

    if (Math.random() < 0.016) {
      const laneW = ((canvasRef.current?.width ?? 500) - 120) / 3;
      const lane = Math.floor(Math.random() * 3);
      const x = 78 + lane * laneW + laneW / 2;
      s.obstacles.push({ x, y: -60, w: 34 });
    }

    const H = canvasRef.current?.height ?? 400;
    s.obstacles = s.obstacles.filter(ob => ob.y < H + 60);
    s.obstacles.forEach(ob => ob.y += obSpeed);

    const playerTop = H - 80;
    for (const ob of s.obstacles) {
      if (Math.abs(ob.x - s.playerX) < 26 && ob.y + 50 > playerTop && ob.y < playerTop + 54) {
        s.running = false;
        setRunning(false);
        setGameOver(true);
        setScore(Math.floor(s.score));
        playCrash();
        return;
      }
    }

    s.score += 0.5;
    const sc = Math.floor(s.score);
    setScore(sc);

    // Score milestone sound every 50 pts
    if (sc > 0 && sc % 50 === 0 && sc !== lastScoreSound.current) {
      lastScoreSound.current = sc;
      playScore();
    }

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current = { playerX: canvas.width / 2, obstacles: [], score: 0, running: true };
    lastScoreSound.current = 0;
    setScore(0);
    setRunning(true);
    setGameOver(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { keysRef.current.left = true;  e.preventDefault(); }
      if (e.key === 'ArrowRight') { keysRef.current.right = true; e.preventDefault(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [draw]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding:'10px 22px', borderRadius:10, background: active ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)', border:'1px solid var(--border)', color:'var(--text)', fontFamily:'inherit', fontSize:'.82rem', fontWeight:600, cursor:'pointer', userSelect:'none',
  });

  return (
    <div>
      <p style={{ fontSize:'.88rem', color:'var(--muted)', marginBottom:'1.5rem', lineHeight:1.65 }}>
        <T en="Dodge obstacle vehicles on the highway. Use arrow keys or on-screen buttons to control your car." np="राजमार्गमा अवरोध सवारीहरूलाई छल्नुहोस्। तीर कुञ्जी वा बटन प्रयोग गर्नुहोस्।" />
      </p>
      <canvas ref={canvasRef} width={500} height={340} style={{ display:'block', width:'100%', maxWidth:500, margin:'0 auto', borderRadius:16, border:'1px solid var(--border)' }} data-testid="game3-canvas" />
      <div style={{ display:'flex', gap:10, marginTop:12, justifyContent:'center', flexWrap:'wrap' }}>
        <button
          onMouseDown={() => keysRef.current.left = true} onMouseUp={() => keysRef.current.left = false}
          onTouchStart={e => { e.preventDefault(); keysRef.current.left = true; }} onTouchEnd={() => keysRef.current.left = false}
          style={btnStyle(keysRef.current.left)} data-testid="btn-left"
        >← <T en="Left" np="बायाँ" /></button>

        {!running ? (
          <button onClick={startGame} style={{ padding:'10px 24px', borderRadius:10, background:'linear-gradient(135deg, var(--r), #c0102a)', color:'#fff', border:'none', fontFamily:'inherit', fontSize:'.82rem', fontWeight:700, cursor:'pointer' }} data-testid="btn-start-game3">
            {gameOver
              ? <><T en={`Game Over (${score}pts)`} np={`खेल सकियो (${score} अंक)`} /> — <T en="Play Again" np="फेरि खेल्नुहोस्" /></>
              : <T en="Start Game" np="खेल सुरु गर्नुहोस्" />}
          </button>
        ) : (
          <div style={{ padding:'10px 24px', borderRadius:10, background:'rgba(255,28,53,.08)', border:'1px solid rgba(255,28,53,.2)', color:'var(--r)', fontFamily:'var(--font-mono)', fontSize:'.82rem', fontWeight:600 }}>
            <T en="Score" np="स्कोर" />: {score}
          </div>
        )}

        <button
          onMouseDown={() => keysRef.current.right = true} onMouseUp={() => keysRef.current.right = false}
          onTouchStart={e => { e.preventDefault(); keysRef.current.right = true; }} onTouchEnd={() => keysRef.current.right = false}
          style={btnStyle(keysRef.current.right)} data-testid="btn-right"
        ><T en="Right" np="दायाँ" /> →</button>
      </div>
    </div>
  );
}

// ── Main Training Section ────────────────────────────────────────────────────
export function Training() {
  const [active, setActive] = useState(1);

  const GAMES = [
    { id:1, icon:'⚡', en:'Reaction Racer', np:'प्रतिक्रिया रेसर' },
    { id:2, icon:'🧩', en:'SOS Memory Match', np:'SOS सम्झना खेल' },
    { id:3, icon:'🚗', en:'Road Guardian', np:'सडक संरक्षक' },
  ];

  return (
    <section id="training" style={{ padding:'clamp(60px,9vw,110px) clamp(1rem,5vw,4rem)' }}>
      <div style={{ maxWidth:1140, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--r2)', marginBottom:12 }}>
          <span style={{ width:18, height:2, background:'var(--r)', borderRadius:2, display:'inline-block' }} />
          <T en="Training Simulation" np="तालिम सिमुलेसन" />
        </div>
        <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:800, color:'var(--text)', letterSpacing:'-.03em', marginBottom:14 }}>
          <T en="Experience RoadSoS Through Play" np="खेलमार्फत RoadSoS अनुभव गर्नुहोस्" />
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.98rem', maxWidth:480, lineHeight:1.7, marginBottom:'2.5rem' }}>
          <T en="Three interactive simulations that let you feel what our AI system does — from reaction speed to emergency dispatch." np="तीन अन्तरक्रियात्मक सिमुलेसनहरू जसले तपाईंलाई हाम्रो एआई प्रणाली के गर्छ भन्ने अनुभव गराउँछ।" />
        </p>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', padding:5, borderRadius:14, width:'fit-content', marginBottom:'2rem', flexWrap:'wrap' }}>
          {GAMES.map(g => (
            <button key={g.id} onClick={() => setActive(g.id)} style={{
              padding:'8px 18px', borderRadius:10, border:'none', fontFamily:'inherit', fontWeight:700, fontSize:'.85rem', cursor:'pointer', transition:'all .25s',
              background: active === g.id ? 'var(--r)' : 'transparent',
              color: active === g.id ? '#fff' : 'var(--muted)',
              display:'flex', alignItems:'center', gap:7,
            }} data-testid={`tab-game-${g.id}`}>
              <span>{g.icon}</span><T en={g.en} np={g.np} />
            </button>
          ))}
        </div>

        {/* Game panel */}
        <div style={{ background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:24, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
          <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:'1.1rem' }}>{GAMES.find(g => g.id === active)?.icon}</span>
            <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--text)' }}>
              {(() => { const g = GAMES.find(g => g.id === active)!; return <T en={g.en} np={g.np} />; })()}
            </span>
          </div>
          <div style={{ padding:22 }}>
            {active === 1 && <ReactionRacer />}
            {active === 2 && <MemoryMatch />}
            {active === 3 && <RoadGuardian />}
          </div>
        </div>
      </div>
    </section>
  );
}
