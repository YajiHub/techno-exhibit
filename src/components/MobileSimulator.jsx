import React, { useState, useEffect } from 'react';

const MAP_DELTA = 0.0003;

const MapView = ({ active, geo }) => {
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    // Only set the map URL once when it becomes active.
    if (active && !iframeSrc) {
      setIframeSrc(
        `https://www.openstreetmap.org/export/embed.html?bbox=${geo.lng - MAP_DELTA},${geo.lat - MAP_DELTA},${geo.lng + MAP_DELTA},${geo.lat + MAP_DELTA}&layer=mapnik&marker=${geo.lat},${geo.lng}`
      );
    }
  }, [active, geo, iframeSrc]);

  return (
    <div className={`w-full h-full bg-[#0a0a0a] relative overflow-hidden transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}>
      {active ? (
        <iframe
          width="100%" height="100%" frameBorder="0" scrolling="no" title="Map"
          src={iframeSrc}
          style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.6)' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 animate-pulse">
          AWAITING_IOT_HANDSHAKE...
        </div>
      )}
    </div>
  );
};

export const MobileSimulator = ({
  isSOS, isTrack, geo, contacts,
  onAddContact, onDeleteContact,
  customMessage, onUpdateMessage,
  victimName, onResolve
}) => {
  const [tab, setTab] = useState('map');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [showMsgEditor, setShowMsgEditor] = useState(false);
  const [msgDraft, setMsgDraft] = useState(customMessage || '');
  const [simLowBattery, setSimLowBattery] = useState(false);

  const batteryLevel = simLowBattery ? 12 : 86;

  const getPreviewMessage = () => {
    const trackingUrl = window.location.origin + '/track.html';
    const time = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
    
    if (!customMessage) {
      return `🚨 EMERGENCY ALERT 🚨\n${victimName} needs help!\n\n📍 LIVE TRACKING:\n${trackingUrl}\n\n⏰ Time: ${time}\n\nPlease respond immediately!`;
    }
    
    return customMessage
      .replace(/{name}/g, victimName || 'the device owner')
      .replace(/{location}/g, trackingUrl)
      .replace(/{tracking}/g, trackingUrl)
      .replace(/{time}/g, time);
  };

  const handleAddContact = () => {
    if (form.name && (form.phone || form.email)) {
      onAddContact(form);
      setForm({ name: '', phone: '', email: '' });
    }
  };

  const handleSaveMessage = () => {
    onUpdateMessage(msgDraft);
    setShowMsgEditor(false);
  };

  return (
    <div className={`w-[430px] h-[880px] bg-black rounded-[3rem] border-[10px] ${isSOS ? 'border-red-600 shadow-[0_0_60px_rgba(255,0,0,0.5)]' : 'border-zinc-700'} relative flex flex-col overflow-hidden`}>
      {/* Notch */}
      <div className="absolute top-0 w-28 h-6 bg-black rounded-b-3xl left-1/2 -translate-x-1/2 z-50" />

      {/* Status bar */}
      <div className={`pt-10 pb-3 px-5 text-center text-[11px] font-black uppercase tracking-widest flex items-center justify-between
        ${isSOS ? 'bg-red-700 text-white' : 'bg-zinc-900 text-orange-400'}`}>
        <span className="text-[9px] font-mono opacity-60">{new Date().toLocaleTimeString()}</span>
        <span>{isSOS ? '🚨 SOS ACTIVE' : 'SentinelClick'}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${batteryLevel <= 15 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
            🔋 {batteryLevel}%
          </span>
          <span className="text-[9px] opacity-80" title="LTE-M Signal">📶 LTE</span>
        </div>
      </div>

      {/* Low Battery Push Notification Simulation */}
      {batteryLevel <= 15 && !isSOS && (
        <div className="absolute top-20 left-4 right-4 bg-zinc-800 border border-red-500/50 rounded-xl p-3 shadow-2xl z-40 flex items-start gap-3">
          <div className="text-xl">🪫</div>
          <div className="flex-1">
            <div className="text-zinc-100 text-[11px] font-bold">Device Battery Critical</div>
            <div className="text-zinc-400 text-[10px] leading-tight mt-0.5">SentinelClick is at {batteryLevel}%. Please recharge immediately to ensure emergency readiness.</div>
          </div>
        </div>
      )}

      {/* Floating SOS Alert Overlay for Mobile */}
      {isSOS && (
        <div className="absolute top-20 left-4 right-4 bg-red-600 border-2 border-red-400 rounded-2xl p-4 shadow-[0_0_30px_rgba(220,38,38,0.8)] z-50 flex flex-col gap-3 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="text-3xl animate-bounce">🚨</div>
            <div className="flex flex-col">
              <span className="text-white font-black text-[16px] uppercase tracking-wider">SOS Triggered!</span>
              <span className="text-red-100 text-[11px] leading-tight mt-0.5">Device user needs help. Monitoring live location.</span>
            </div>
          </div>
          <button 
            onClick={onResolve}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-2 rounded-lg text-[11px] uppercase tracking-wider transition shadow-lg border border-green-300"
          >
            ✓ Mark as Resolved
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 bg-zinc-950 overflow-y-auto pb-20">
        {tab === 'map' && (
          <div className="h-full min-h-[400px]">
            <MapView active={isSOS || isTrack} geo={geo} />
            <div className="p-4 space-y-3 border-t border-zinc-800">
              
              {/* Dev Tool: Simulate Low Battery */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setSimLowBattery(!simLowBattery)}
                  className="text-[9px] text-zinc-500 hover:text-zinc-300 underline"
                >
                  [Dev] Toggle Low Battery Warning
                </button>
              </div>

              {/* Message config section */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
                <button
                  onClick={() => setShowMsgEditor(!showMsgEditor)}
                  className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-black text-orange-400 uppercase tracking-wider hover:bg-zinc-800 transition"
                >
                  <span>✏️ Customize SOS Message</span>
                  <span>{showMsgEditor ? '▲' : '▼'}</span>
                </button>
                {showMsgEditor && (
                  <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
                    <div className="text-[9px] text-zinc-500 mt-2">
                      Variables: <span className="text-orange-400">{'{name}'}</span> = victim name, <span className="text-orange-400">{'{location}'}</span> = map link, <span className="text-orange-400">{'{time}'}</span> = time
                    </div>
                    <textarea
                      className="w-full bg-black border border-zinc-700 focus:border-orange-500 rounded-lg p-3 text-[11px] text-white placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
                      rows={5}
                      value={msgDraft}
                      onChange={e => setMsgDraft(e.target.value)}
                      placeholder="🚨 EMERGENCY — {name} needs help!&#10;Location: {location}&#10;Time: {time}&#10;&#10;Please respond immediately."
                    />
                    <button
                      onClick={handleSaveMessage}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition"
                    >
                      ✓ Save Message Template
                    </button>
                  </div>
                )}
              </div>

              {/* Current message preview */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Current Template Preview</div>
                <div className="text-[10px] text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {getPreviewMessage()}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="p-4 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Emergency Circle</h3>

            {/* Contact list */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {contacts.length === 0 && (
                <div className="text-zinc-600 text-xs text-center py-4">No contacts yet</div>
              )}
              {contacts.map((c) => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-xl p-3 flex items-center gap-3 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0
                    ${isSOS ? 'bg-red-600 animate-pulse' : 'bg-orange-500/20 text-orange-400'}`}>
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-white truncate">{c.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {c.email && (
                        <span className="text-[9px] text-zinc-400 flex items-center gap-1">
                          <span>✉️</span> {c.email.split('@')[0]}…
                        </span>
                      )}
                      {c.phone && (
                        <span className="text-[9px] text-zinc-400 flex items-center gap-1">
                          <span>📱</span> {c.phone.slice(-4).padStart(c.phone.length, '•')}
                        </span>
                      )}
                    </div>
                    {/* Channel icons */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {c.email && (
                        <div title="Email" className="w-5 h-5 rounded bg-blue-900/60 flex items-center justify-center text-[9px]">✉️</div>
                      )}
                      {c.phone && (
                        <div title="SMS" className="w-5 h-5 rounded bg-green-900/60 flex items-center justify-center text-[9px]">💬</div>
                      )}
                      {/* Greyed-out future channels */}
                      <div title="Facebook (coming soon)" className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[9px] opacity-30 cursor-not-allowed">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-blue-400"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <div title="WhatsApp (coming soon)" className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[9px] opacity-30 cursor-not-allowed">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteContact(c.id)}
                    className="w-7 h-7 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg flex items-center justify-center text-sm transition flex-shrink-0"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Add contact form */}
            <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-4 space-y-3">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-wider">＋ Add Emergency Contact</div>

              <input
                placeholder="Full Name *"
                className="w-full bg-black border border-zinc-700 focus:border-orange-500 p-2.5 rounded-xl text-[12px] text-white placeholder-zinc-600 focus:outline-none transition"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email Address"
                type="email"
                className="w-full bg-black border border-zinc-700 focus:border-orange-500 p-2.5 rounded-xl text-[12px] text-white placeholder-zinc-600 focus:outline-none transition"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone Number (09xxxxxxxxx)"
                type="tel"
                className="w-full bg-black border border-zinc-700 focus:border-orange-500 p-2.5 rounded-xl text-[12px] text-white placeholder-zinc-600 focus:outline-none transition"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />

              {/* Channel info */}
              <div className="flex items-center gap-3 text-[9px] text-zinc-500 py-1">
                <span className="flex items-center gap-1 text-blue-400">✉️ Email</span>
                <span className="flex items-center gap-1 text-green-400">💬 SMS</span>
                <span className="flex items-center gap-1 opacity-30">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-blue-400 inline"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  FB
                </span>
                <span className="flex items-center gap-1 opacity-30">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-green-400 inline"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WA
                </span>
                <span className="ml-auto text-zinc-600 italic">(FB & WA: soon)</span>
              </div>

              <button
                onClick={handleAddContact}
                disabled={!form.name || (!form.phone && !form.email)}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black py-3 rounded-xl text-[12px] uppercase tracking-wider transition"
              >
                ✓ Add to Circle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center px-4 gap-3 z-50">
        <button
          onClick={() => setTab('map')}
          className={`flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all
            ${tab === 'map' ? 'bg-orange-500 text-black shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          🗺️ Map
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all
            ${tab === 'contacts' ? 'bg-orange-500 text-black shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          👥 Circle
        </button>
      </div>
    </div>
  );
};