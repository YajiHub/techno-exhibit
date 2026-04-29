import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { createClient } from '@supabase/supabase-js';

import { ModelKeychain, ModelSilicone, ModelPendant } from './components/Models3D';
import { MobileSimulator } from './components/MobileSimulator';
import { WebSimulator } from './components/WebSimulator';
import { RecipientSimulator } from './components/RecipientSimulator';
import { sosService } from './services/sosService';
import { contactService } from './services/contactService';

const PRODUCTS = {
  keychain: { id: 'keychain', name: 'Keychain Tag',    price: '₱3,999', target: 'BPO & Commuters',     desc: 'Compact pebble-style tag with keyring attachment' },
  tracker:  { id: 'tracker',  name: 'Silicone Clip',   price: '₱4,299', target: 'Children & Active',   desc: 'Jiobit-style clip — attaches to belt loops, collars, bags' },
  pendant:  { id: 'pendant',  name: 'Gold Pendant',    price: '₱4,499', target: 'Discreet / Luxury',   desc: 'Elegant jewelry pendant with hidden SOS mechanism' }
};

const SUPABASE_URL      = 'https://dpksnvcfsqfkwgtdpbws.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwa3NudmNmc3Fma3dndGRwYndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDIzMzYsImV4cCI6MjA5MjY3ODMzNn0.X1ymhR4OgUO-fvjYqJF0VfbqGd8Ul2F680PWsqrU74o';
const CHANNEL_NAME      = 'sentinel-gps';

export default function App() {
  const [activeTab,     setActiveTab]     = useState('keychain');
  const [isSOS,         setIsSOS]         = useState(false);
  const [isTrack,       setIsTrack]       = useState(false);
  const [swView,        setSwView]        = useState('web');
  const [recipientCollapsed, setRecipientCollapsed] = useState(false);
  const [geo,           setGeo]           = useState({ lat: 14.5547, lng: 121.0244 });
  const [logs,          setLogs]          = useState(['[SYSTEM]: SentinelClick v7 initialized', '[CLOUD]: Supabase bridge ready']);
  const [contacts,      setContacts]      = useState(() => contactService.loadContacts());
  const [customMessage, setCustomMessage] = useState(() => localStorage.getItem('sentinel_msg') || '');
  const [victimName,    setVictimName]    = useState(() => localStorage.getItem('sentinel_victim') || 'the device owner');

  const addLog = (msg) => setLogs(prev => [msg, ...prev.slice(0, 49)]);

  useEffect(() => { contactService.saveContacts(contacts); }, [contacts]);
  useEffect(() => { localStorage.setItem('sentinel_msg', customMessage); }, [customMessage]);
  useEffect(() => { localStorage.setItem('sentinel_victim', victimName); }, [victimName]);
  
  // Save GPS location to localStorage for tracking page
  useEffect(() => { localStorage.setItem('sentinel_geo', JSON.stringify(geo)); }, [geo]);
  
  // Save SOS state to localStorage for tracking page
  useEffect(() => { localStorage.setItem('sentinel_sos_active', JSON.stringify(isSOS)); }, [isSOS]);

  // Supabase Realtime GPS
  useEffect(() => {
    let channel = null;
    const setupRealtime = async () => {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        channel = supabase.channel(CHANNEL_NAME);
        channel
          .on('broadcast', { event: 'gps' }, ({ payload }) => {
            if (typeof payload.lat === 'number' && typeof payload.lng === 'number') {
              setGeo({ lat: payload.lat, lng: payload.lng });
              addLog(`[📱] Phone GPS: ${payload.lat.toFixed(5)}, ${payload.lng.toFixed(5)}`);
            }
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') addLog('[📡] GPS bridge connected — waiting for phone beacon...');
          });
      } catch (err) {
        addLog(`[!] Supabase error: ${err.message}`);
      }
    };
    setupRealtime();
    return () => { if (channel) channel.unsubscribe(); };
  }, []);

  const handleAddContact    = (data) => { const c = contactService.addContact(data); setContacts(p => [...p, c]); addLog(`[+] Contact added: ${data.name}`); };
  const handleDeleteContact = (id)   => { contactService.deleteContact(id); setContacts(p => p.filter(c => c.id !== id)); addLog(`[-] Contact removed`); };
  
  const handleResolveSOS = () => {
    setIsSOS(false);
    localStorage.setItem('sentinel_sos_active', 'false');
    addLog('[✓] SOS cleared by operator');
  };

  const triggerSOS = async () => {
    if (isSOS) return;
    setIsSOS(true);
    localStorage.setItem('sentinel_sos_active', 'true');
    addLog('[ALERT]: 🚨 SOS BLAST INITIATED');
    await sosService.triggerSOSBlast(contacts, geo, customMessage || null, victimName, addLog);
    try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch {}
  };

  return (
    <div className="w-full h-screen bg-[#020202] flex text-white font-sans overflow-hidden">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
      <div className="w-52 border-r border-zinc-900 bg-black/60 p-5 flex flex-col gap-4 z-20 overflow-y-auto flex-shrink-0">
        {/* Brand */}
        <div className="mb-1">
          <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">SentinelClick</div>
          <h1 className="text-[18px] font-black tracking-tighter leading-tight">
            TECHNOLOGY
          </h1>
          <div className="w-8 h-0.5 bg-orange-500 mt-1.5 rounded-full" />
          <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-2">Prototype v7.0 · Exhibit</p>
        </div>

        {/* Product selector */}
        <div className="space-y-2">
          <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Form Factors</div>
          {Object.keys(PRODUCTS).map(k => (
            <button
              key={k}
              onClick={() => { setActiveTab(k); setIsSOS(false); setIsTrack(false); }}
              className={`w-full p-3 rounded-xl border text-left transition-all text-[11px] group
                ${activeTab === k
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-zinc-800 hover:border-zinc-600 text-zinc-400'}`}
            >
              <div className="font-black uppercase text-[10px] tracking-wide">{PRODUCTS[k].name}</div>
              <div className="text-[8px] opacity-60 mt-0.5">{PRODUCTS[k].target}</div>
              {activeTab === k && <div className="text-[8px] text-zinc-500 mt-1 leading-tight">{PRODUCTS[k].desc}</div>}
            </button>
          ))}
        </div>

        {/* Victim name config */}
        <div className="mt-2">
          <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1.5">Device Owner Name</div>
          <input
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-lg px-2.5 py-2 text-[10px] text-white placeholder-zinc-600 focus:outline-none transition"
            placeholder="e.g. Maria Santos"
            value={victimName}
            onChange={e => setVictimName(e.target.value)}
          />
          <div className="text-[8px] text-zinc-600 mt-1">Used in SOS message templates</div>
        </div>

        {/* Guide */}
        <div className="mt-auto p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[8px] leading-relaxed text-zinc-500 space-y-1">
          <div className="text-orange-400 font-black text-[9px] uppercase tracking-wider mb-1.5">Demo Flow:</div>
          <div>1. Add contacts in Mobile</div>
          <div>2. Set SOS message template</div>
          <div>3. Click the red button on device</div>
          <div>4. Watch Recipient preview →</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-6 bg-black/30 flex-shrink-0">
          <div className="flex gap-2">
            {['web', 'mobile'].map(v => (
              <button
                key={v}
                onClick={() => setSwView(v)}
                className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full border transition-all uppercase
                  ${swView === v ? 'bg-orange-500 text-black border-orange-500' : 'text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
              >
                {v === 'web' ? '🖥 Web' : '📱 Mobile'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isSOS && (
              <div className="text-[9px] text-red-400 font-black bg-red-900/30 border border-red-700/50 px-3 py-1 rounded-full animate-pulse">
                🚨 SOS ACTIVE
              </div>
            )}
            {isSOS && (
              <button
                onClick={handleResolveSOS}
                className="text-[9px] font-black bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-3 py-1 rounded-full transition"
              >
                ✓ Resolve
              </button>
            )}            
            <button
              onClick={() => setRecipientCollapsed(!recipientCollapsed)}
              className="text-[9px] font-black bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-3 py-1 rounded-full transition"
              title={recipientCollapsed ? 'Show Recipient View' : 'Hide Recipient View'}
            >
              {recipientCollapsed ? '📬 Show' : '📪 Hide'}
            </button>            
            <div className="text-[9px] text-zinc-600 font-mono">
              {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* 3-panel area */}
        <div className="flex-1 flex gap-2 p-2 min-h-0 overflow-hidden">

          {/* Panel 1: 3D Viewer */}
          <div className="flex-1 relative border border-zinc-900/80 bg-[radial-gradient(ellipse_at_center,#111_0%,#020202_70%)] rounded-xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}>
              <ambientLight intensity={0.8} />
              <Environment preset="city" />
              <Suspense fallback={null}>
                {activeTab === 'keychain' && <ModelKeychain trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(t => !t)} />}
                {activeTab === 'tracker'  && <ModelSilicone trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(t => !t)} />}
                {activeTab === 'pendant'  && <ModelPendant  trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(t => !t)} />}
              </Suspense>
              <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={8} blur={2.5} color={isSOS ? '#ff0000' : '#000'} />
              <OrbitControls makeDefault enablePan={false} autoRotate={!isSOS && !isTrack} autoRotateSpeed={1.2} />
            </Canvas>

            {/* Device info overlay */}
            <div className="absolute bottom-3 inset-x-3 flex justify-between items-end pointer-events-none">
              <div className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800 text-[9px] font-mono text-orange-400">
                {PRODUCTS[activeTab].price}
              </div>
              <div className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800 text-[8px] text-zinc-500">
                {isTrack ? '🟢 tracking' : '⚫ standby'}
              </div>
            </div>

            {/* Hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-[8px] text-zinc-600 pointer-events-none">
              Click red button → SOS · Drag to rotate · Toggle switch → tracking
            </div>
          </div>

          {/* Panel 2: Software view */}
          <div className="flex-1 flex items-center justify-center bg-[#050505] rounded-xl border border-zinc-900/80 overflow-hidden">
            {swView === 'mobile' ? (
              <MobileSimulator
                isSOS={isSOS} isTrack={isTrack} geo={geo}
                contacts={contacts}
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
                customMessage={customMessage}
                onUpdateMessage={setCustomMessage}
                victimName={victimName}
                onResolve={handleResolveSOS}
              />
            ) : (
              <WebSimulator
                isSOS={isSOS} isTrack={isTrack} geo={geo} logs={logs}
                contacts={contacts} onDeleteContact={handleDeleteContact}
                onResolve={handleResolveSOS}
              />
            )}
          </div>

          {/* Panel 3: Recipient Simulator */}
          {!recipientCollapsed && (
            <div className="flex-1 min-w-0">
              <RecipientSimulator
                isSOS={isSOS}
                geo={geo}
                contacts={contacts}
                customMessage={customMessage}
                victimName={victimName}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}