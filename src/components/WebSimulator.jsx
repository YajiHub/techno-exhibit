import React, { useState, useEffect } from 'react';

// ±0.0003 degrees ≈ 30 meters — tight enough to show walking movement
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
        <div className="absolute inset-0 flex items-center justify-center text-[12px] font-mono text-gray-700 animate-pulse">AWAITING_IOT_HANDSHAKE...</div>
      )}
    </div>
  );
};

export const WebSimulator = ({ isSOS, isTrack, geo, logs, contacts, onDeleteContact }) => {
  const [expandedContact, setExpandedContact] = useState(null);

  return (
    <div className={`w-full h-full bg-[#0a0a0a] border-2 ${isSOS ? 'border-red-600 shadow-[0_0_60px_rgba(255,0,0,0.2)]' : 'border-gray-700'} rounded-2xl flex flex-col shadow-2xl overflow-hidden`}>

      {/* HEADER */}
      <div className="h-16 border-b-2 border-gray-800 flex items-center px-8 justify-between bg-gradient-to-r from-black to-gray-900">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isSOS ? 'bg-red-500 animate-pulse' : 'bg-brand'} shadow-lg`}></div>
          <div>
            <span className="text-base font-black uppercase tracking-tight">SENTINEL DISPATCH</span>
            <span className="text-xs text-gray-500 ml-3">REAL-TIME ALERT SYSTEM</span>
          </div>
        </div>
        <div className="flex gap-6 font-mono text-[12px] text-brand bg-black/50 px-6 py-2 rounded-xl border border-gray-700">
          <div className="flex flex-col"><span className="text-gray-500 text-[10px]">LATITUDE</span>{geo.lat.toFixed(5)}</div>
          <div className="border-l border-gray-700"></div>
          <div className="flex flex-col"><span className="text-gray-500 text-[10px]">LONGITUDE</span>{geo.lng.toFixed(5)}</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-3 p-4 min-h-0 overflow-hidden">

        {/* TOP — BIG MAP */}
        <div className="h-1/2 bg-black border-2 border-gray-700 rounded-xl overflow-hidden shadow-xl hover:border-brand/30 transition">
          <MapView active={isSOS || isTrack} geo={geo} />
        </div>

        {/* MIDDLE — CONTACTS */}
        <div className="h-1/4 bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4 flex flex-col overflow-hidden shadow-lg hover:border-brand/30 transition">
          <div className="text-xs font-black uppercase tracking-widest text-brand mb-2">🎯 Emergency Targets ({contacts.length})</div>
          <div className="flex-1 overflow-x-auto flex gap-3 pr-2">
            {contacts.length === 0 ? (
              <div className="text-gray-600 text-sm flex items-center">No contacts added</div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setExpandedContact(expandedContact === c.id ? null : c.id)}
                  className="group flex-shrink-0 p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-brand rounded-lg cursor-pointer transition-all hover:shadow-lg hover:shadow-brand/20 w-48"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white group-hover:text-brand transition truncate">{c.name}</div>
                      <div className="text-xs text-brand font-mono mt-1">{c.type}</div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ml-2 ${isSOS ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                  </div>
                  {expandedContact === c.id && (
                    <div className="mt-2 pt-2 border-t border-gray-700 space-y-1 text-xs">
                      {c.phone    && <div className="flex items-center gap-2"><span>📱</span><span className="text-gray-300 truncate">{c.phone}</span></div>}
                      {c.email    && <div className="flex items-center gap-2"><span>✉️</span><span className="text-gray-300 truncate">{c.email}</span></div>}
                      {c.facebook && <div className="flex items-center gap-2"><span>📘</span><span className="text-gray-300 truncate">{c.facebook}</span></div>}
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteContact(c.id); setExpandedContact(null); }}
                        className="mt-1.5 w-full bg-red-900/40 hover:bg-red-900/60 text-red-300 py-1.5 rounded font-bold text-[9px] transition"
                      >REMOVE</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM — EVENT LOG */}
        <div className="h-1/4 bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 rounded-xl p-4 flex flex-col overflow-hidden shadow-lg hover:border-brand/30 transition">
          <div className="text-xs font-black uppercase tracking-widest text-brand mb-2">📡 Kernel Event Stream</div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden font-mono text-[10px] space-y-1 pr-2">
            {logs.length === 0 ? (
              <div className="text-gray-600 text-center">Initializing system...</div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="text-gray-400 leading-relaxed break-words hover:text-gray-300 transition">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {l}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};