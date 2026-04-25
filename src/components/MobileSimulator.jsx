import React, { useState } from 'react';

const MapView = ({ active, geo }) => (
  <div className={`w-full h-full bg-[#0a0a0a] relative overflow-hidden transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}>
    {active ? (
      <iframe 
        width="100%" height="100%" frameBorder="0" scrolling="no" title="Map"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${geo.lng-0.01},${geo.lat-0.01},${geo.lng+0.01},${geo.lat+0.01}&layer=mapnik&marker=${geo.lat},${geo.lng}`}
        style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.6)' }}
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-700 animate-pulse">AWAITING_IOT_HANDSHAKE...</div>
    )}
  </div>
);

export const MobileSimulator = ({ isSOS, isTrack, geo, contacts, onAddContact, onDeleteContact, twilioConfig, onUpdateTwilio }) => {
  const [tab, setTab] = useState('map');
  const [form, setForm] = useState({ name: '', phone: '', email: '', facebook: '' });
  const [showTwilioInput, setShowTwilioInput] = useState(false);
  const [twilioInput, setTwilioInput] = useState(twilioConfig);

  const handleAddContact = () => {
    if (form.name && (form.phone || form.email)) {
      onAddContact(form);
      setForm({ name: '', phone: '', email: '', facebook: '' });
    }
  };

  const handleSaveTwilio = () => {
    onUpdateTwilio(twilioInput);
    setShowTwilioInput(false);
  };

  return (
    <div className={`w-[450px] h-[900px] bg-black rounded-[3rem] border-[12px] ${isSOS ? 'border-red-600 shadow-[0_0_60px_red]' : 'border-gray-700'} relative flex flex-col overflow-hidden`}>
      <div className="absolute top-0 w-32 h-7 bg-black rounded-b-3xl left-1/2 -translate-x-1/2 z-50"></div>
      
      <div className={`pt-16 pb-4 text-center text-[13px] font-black uppercase tracking-widest ${isSOS ? 'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse' : 'bg-gradient-to-r from-gray-900 to-black text-brand'}`}>
        {isSOS ? '🚨 SOS ACTIVE - EMERGENCY' : '📱 SentinelCare PH'}
      </div>

      <div className="flex-1 bg-gray-950 overflow-y-auto pb-24">
        {tab === 'map' && <MapView active={isSOS || isTrack} geo={geo} />}
        
        {tab === 'contacts' && (
          <div className="p-5 space-y-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Emergency Circle</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {contacts.map((c) => (
                <div key={c.id} className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border-2 border-gray-700 flex justify-between items-start hover:border-brand transition shadow-lg">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-brand font-mono mt-1">{c.type}</div>
                    {c.phone && <div className="text-[10px] text-gray-400 mt-1">📱 {c.phone}</div>}
                    {c.email && <div className="text-[10px] text-gray-400">✉️ {c.email}</div>}
                  </div>
                  <button 
                    onClick={() => onDeleteContact(c.id)}
                    className="ml-2 bg-red-600 hover:bg-red-500 text-white font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center transition shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* TWILIO CONFIG SECTION */}
            <div className="bg-gradient-to-b from-blue-900/30 to-black border-2 border-blue-700/50 p-4 rounded-lg text-[9px]">
              <button 
                onClick={() => setShowTwilioInput(!showTwilioInput)}
                className="text-blue-300 font-bold mb-3 text-sm hover:text-blue-200 transition flex items-center gap-2"
              >
                <span className="text-lg">{showTwilioInput ? '▼' : '▶'}</span> Twilio SMS Config
              </button>
              {showTwilioInput && (
                <div className="space-y-3">
                  <input 
                    type="text"
                    placeholder="Account SID"
                    className="w-full bg-black border-2 border-blue-600 p-2.5 rounded text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                    value={twilioInput.accountSid}
                    onChange={(e) => setTwilioInput({...twilioInput, accountSid: e.target.value})}
                  />
                  <input 
                    type="password"
                    placeholder="Auth Token"
                    className="w-full bg-black border-2 border-blue-600 p-2.5 rounded text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                    value={twilioInput.authToken}
                    onChange={(e) => setTwilioInput({...twilioInput, authToken: e.target.value})}
                  />
                  <input 
                    type="text"
                    placeholder="Twilio Phone (e.g., +1234567890)"
                    className="w-full bg-black border-2 border-blue-600 p-2.5 rounded text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                    value={twilioInput.fromNumber}
                    onChange={(e) => setTwilioInput({...twilioInput, fromNumber: e.target.value})}
                  />
                  <button 
                    onClick={handleSaveTwilio}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2.5 rounded text-[10px] hover:from-blue-500 hover:to-blue-400 transition shadow-lg"
                  >
                    ✓ Save Credentials
                  </button>
                  <div className="text-gray-600 text-[9px]">Get at: twilio.com</div>
                </div>
              )}
            </div>

            {/* ADD CONTACT FORM */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-5 rounded-2xl border-2 border-brand/50 space-y-3 shadow-lg">
              <div className="text-xs font-black text-brand uppercase tracking-wider">➕ Add Emergency Contact</div>
              <input 
                placeholder="Contact Name" 
                className="w-full bg-black border-2 border-gray-700 focus:border-brand p-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} 
              />
              <input 
                placeholder="Phone (+63...)" 
                className="w-full bg-black border-2 border-gray-700 focus:border-brand p-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none" 
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} 
              />
              <input 
                placeholder="Email" 
                className="w-full bg-black border-2 border-gray-700 focus:border-brand p-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} 
              />
              <input 
                placeholder="Facebook ID (opt)" 
                className="w-full bg-black border-2 border-gray-700 focus:border-brand p-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none" 
                value={form.facebook}
                onChange={e => setForm({...form, facebook: e.target.value})} 
              />
              <button onClick={handleAddContact} className="w-full bg-gradient-to-r from-brand to-yellow-400 text-black font-black py-4 rounded-xl text-[13px] uppercase tracking-wider shadow-lg hover:shadow-brand/50 transition-all hover:scale-105">
                ✓ Add Contact
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-20 bg-gradient-to-t from-black to-gray-900 border-t-2 border-gray-800 flex justify-around items-center z-50 gap-3 px-4">
        <button 
          onClick={() => setTab('map')} 
          className={`flex-1 py-3 rounded-lg font-black text-[12px] uppercase tracking-wider transition-all ${tab === 'map' ? 'bg-gradient-to-r from-brand to-yellow-400 text-black shadow-lg shadow-brand/50 scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'}`}
        >
          🗺️ MAP
        </button>
        <button 
          onClick={() => setTab('contacts')} 
          className={`flex-1 py-3 rounded-lg font-black text-[12px] uppercase tracking-wider transition-all ${tab === 'contacts' ? 'bg-gradient-to-r from-brand to-yellow-400 text-black shadow-lg shadow-brand/50 scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'}`}
        >
          👥 CIRCLE
        </button>
      </div>
    </div>
  );
};
