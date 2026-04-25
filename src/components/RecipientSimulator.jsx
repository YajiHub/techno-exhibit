import React, { useState, useEffect } from 'react';

// Simulated SMS message preview (like Android Messages / iPhone iMessage)
const SMSBubble = ({ message, time, geo, victimName }) => {
  const trackingUrl = window.location.origin + '/track.html';
  const fullMsg = message
    .replace('{name}', victimName || 'Your contact')
    .replace('{tracking}', trackingUrl)
    .replace('{location}', trackingUrl)
    .replace('{time}', time);

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] rounded-2xl overflow-hidden">
      {/* SMS App header */}
      <div className="bg-[#2c2c2e] px-4 py-3 border-b border-[#3a3a3c] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm">S</div>
        <div>
          <div className="text-white text-[12px] font-semibold">SentinelClick Alert</div>
          <div className="text-[10px] text-green-400">+63 900 000 0000</div>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end gap-3">
        <div className="text-[9px] text-[#636366] text-center">{time}</div>

        {/* Incoming SMS bubble */}
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">S</div>
          <div className="max-w-[85%] bg-[#2c2c2e] rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="text-white text-[11px] leading-relaxed whitespace-pre-wrap break-words">
              {fullMsg}
            </div>
            {/* Tracking link preview */}
            <div className="mt-2 bg-[#1c1c1e] rounded-xl overflow-hidden border border-[#3a3a3c]">
              <div className="p-2">
                <div className="text-[9px] text-[#636366] uppercase tracking-wider mb-1">🚨 Live Tracking</div>
                <div className="text-blue-400 text-[10px] font-mono truncate">{trackingUrl}</div>
                <div className="text-[9px] text-[#636366] mt-1">Tap to track location in real-time →</div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery receipt */}
        <div className="text-[9px] text-[#636366] text-right">Delivered ✓✓</div>
      </div>

      {/* Reply bar (disabled) */}
      <div className="bg-[#2c2c2e] px-3 py-2 border-t border-[#3a3a3c] flex items-center gap-2">
        <div className="flex-1 bg-[#3a3a3c] rounded-full px-3 py-1.5 text-[11px] text-[#636366]">Message…</div>
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">▲</div>
      </div>
    </div>
  );
};

// Simulated Email client (like Gmail in dark mode)
const EmailView = ({ message, time, geo, contacts, victimName }) => {
  const trackingUrl = window.location.origin + '/track.html';
  const [expanded, setExpanded] = useState(true);

  const recipientEmail = contacts[0]?.email || 'contact@example.com';
  const fullMsg = message
    .replace('{name}', victimName || 'Your contact')
    .replace('{tracking}', trackingUrl)
    .replace('{location}', trackingUrl)
    .replace('{time}', time);

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] rounded-2xl overflow-hidden text-gray-100 text-[11px] border border-gray-800">
      {/* Dark Gmail-style header */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <div className="text-[13px] font-black text-red-500">🔴</div>
        <span className="text-[12px] font-bold text-gray-200 flex-1 truncate">
          🚨 SENTINELCLICK SOS ALERT 🚨
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Sender info */}
        <div className="px-4 py-3 border-b border-gray-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">S</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[12px] text-gray-100">SentinelClick System</span>
                <span className="text-[9px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">noreply@sentinelclick.ph</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">to: <span className="text-blue-400">{recipientEmail}</span></div>
              <div className="text-[9px] text-gray-600 mt-0.5">{time}</div>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-gray-400 text-lg">
            {expanded ? '▲' : '▼'}
          </button>
        </div>

        {expanded && (
          <div className="px-5 py-4 space-y-4">
            {/* Alert banner */}
            <div className="bg-red-950 border-l-4 border-red-700 rounded-r-lg p-3">
              <div className="text-red-400 font-black text-[13px] uppercase tracking-wide">⚠ Emergency Alert</div>
              <div className="text-red-500 text-[10px] mt-1">This message was automatically generated by a SentinelClick device activation.</div>
            </div>

            {/* Message body */}
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[12px]">
              {fullMsg}
            </div>

            {/* Tracking link card */}
            <div className="border border-gray-700 rounded-xl overflow-hidden shadow-sm bg-gray-950">
              <div className="bg-gray-900 px-3 py-2 border-b border-gray-800">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">🚨 Real-Time Location Tracking</div>
              </div>
              <div className="p-3 space-y-2">
                <div className="font-mono text-[10px] text-gray-500 break-all">{trackingUrl}</div>
                <div className="bg-blue-950 border border-blue-800 rounded-lg p-2">
                  <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold text-[11px] flex items-center gap-1 hover:text-blue-300">
                    🗺️ View Live Tracking Map →
                  </a>
                  <div className="text-[9px] text-gray-500 mt-1">Updated every 2 seconds via GPS beacon</div>
                </div>
              </div>
            </div>

            {/* Coords */}
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-[10px] text-gray-400 space-y-1 border border-gray-800">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-600">LAT</span> {geo.lat.toFixed(6)}</div>
                <div><span className="text-gray-600">LNG</span> {geo.lng.toFixed(6)}</div>
              </div>
              <div className="text-gray-600 text-[9px]">Device: SentinelClick v7 · {time}</div>
            </div>

            {/* Footer */}
            <div className="text-[9px] text-gray-600 border-t border-gray-800 pt-3">
              This is an automated emergency message from SentinelClick Technology. Do not reply to this email.
              If this was a test, please contact the device owner.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Recipient Simulator Panel
export const RecipientSimulator = ({ isSOS, geo, contacts, customMessage, victimName }) => {
  const [activeTab, setActiveTab] = useState('sms');
  const [showPing, setShowPing] = useState(false);
  const time = new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const defaultMessage = `🚨 EMERGENCY ALERT 🚨\n{name} needs help!\n\n📍 LIVE TRACKING:\n{tracking}\n\n⏰ Time: {time}\n\nPlease respond immediately!`;
  const activeMessage = customMessage || defaultMessage;

  useEffect(() => {
    if (isSOS) {
      setShowPing(true);
      const t = setTimeout(() => setShowPing(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isSOS]);

  return (
    <div className={`w-full h-full flex flex-col bg-[#0a0a0a] rounded-xl border-2 transition-all duration-500 overflow-hidden
      ${isSOS ? 'border-red-500 shadow-[0_0_40px_rgba(255,0,0,0.15)]' : 'border-zinc-800'}`}>

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">📨 Recipient Preview</div>
            <div className="text-[9px] text-zinc-600 mt-0.5">What contacts receive when SOS triggers</div>
          </div>
          {isSOS && (
            <div className="flex items-center gap-1.5 text-[9px] text-red-400 font-bold animate-pulse bg-red-900/30 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span> SENT
            </div>
          )}
        </div>
        {/* Tab bar */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
              ${activeTab === 'sms' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            💬 SMS
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
              ${activeTab === 'email' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            ✉️ Email
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
              ${activeTab === 'map' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-400'}`}
          >
            🗺️ Live Map
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 min-h-0 overflow-hidden">
        {activeTab === 'sms' && (
          <SMSBubble
            message={activeMessage}
            time={time}
            geo={geo}
            victimName={victimName}
          />
        )}
        {activeTab === 'email' && (
          <EmailView
            message={activeMessage}
            time={time}
            geo={geo}
            contacts={contacts}
            victimName={victimName}
          />
        )}
        {activeTab === 'map' && (
          <div className="h-full flex flex-col gap-2">
            <div className="bg-zinc-900 rounded-xl p-2 border border-zinc-800 flex-shrink-0">
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Public tracking page — shared via SOS link</div>
              <div className="text-[10px] text-orange-400 font-mono mt-0.5 truncate">
                https://sentinel.click/track/{geo.lat.toFixed(3)},{geo.lng.toFixed(3)}
              </div>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden border border-zinc-700">
              <iframe
                key={`recipient-${geo.lat.toFixed(5)}-${geo.lng.toFixed(5)}`}
                width="100%" height="100%" frameBorder="0" scrolling="no" title="Recipient Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${geo.lng - MAP_DELTA},${geo.lat - MAP_DELTA},${geo.lng + MAP_DELTA},${geo.lat + MAP_DELTA}&layer=mapnik&marker=${geo.lat},${geo.lng}`}
                style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.65)' }}
              />
            </div>
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-2 flex-shrink-0">
              <div className="text-[9px] text-red-400 font-bold">🔴 LIVE — Updates every 2s</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">GPS coords: {geo.lat.toFixed(5)}, {geo.lng.toFixed(5)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Recipient info strip */}
      {contacts.length > 0 && (
        <div className="bg-zinc-900 border-t border-zinc-800 px-3 py-2 flex items-center gap-2 flex-wrap flex-shrink-0">
          <span className="text-[9px] text-zinc-500">Sent to:</span>
          {contacts.slice(0, 3).map(c => (
            <span key={c.id} className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
              {c.name}
            </span>
          ))}
          {contacts.length > 3 && (
            <span className="text-[9px] text-zinc-500">+{contacts.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
};

const MAP_DELTA = 0.0003;