import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// Components
import { ModelKeychain, ModelSilicone, ModelPendant } from './components/Models3D';
import { MobileSimulator } from './components/MobileSimulator';
import { WebSimulator } from './components/WebSimulator';

// Services
import { sosService } from './services/sosService';
import { contactService } from './services/contactService';

// --- CONFIGURATION ---
const PRODUCTS = {
  keychain: { id: 'keychain', name: 'Keychain Wearable', price: '₱3,999', target: 'BPO & Commuters' },
  tracker: { id: 'tracker', name: 'Silicone Clip', price: '₱4,299', target: 'Children & Active' },
  pendant: { id: 'pendant', name: 'Jewelry Pendant', price: '₱4,499', target: 'Discreet / Luxury' }
};

// --- MAIN APPLICATION ---
export default function App() {
  const [activeTab, setActiveTab] = useState('keychain');
  const [isSOS, setIsSOS] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [swView, setSwView] = useState('web');
  const [geo, setGeo] = useState({ lat: 14.5547, lng: 121.0244 });
  const [logs, setLogs] = useState(['[SYSTEM]: Initialized', '[CLOUD]: Ready']);
  const [contacts, setContacts] = useState(() => contactService.loadContacts());
  
  // Twilio credentials
  const [twilioConfig, setTwilioConfig] = useState(() => {
    const saved = localStorage.getItem('twilio_config');
    return saved ? JSON.parse(saved) : {
      accountSid: '',
      authToken: '',
      fromNumber: ''
    };
  });

  // Log helper
  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 49)]);
  };

  // Sync contacts to localStorage
  useEffect(() => {
    contactService.saveContacts(contacts);
  }, [contacts]);

  // Sync Twilio config to localStorage
  useEffect(() => {
    localStorage.setItem('twilio_config', JSON.stringify(twilioConfig));
  }, [twilioConfig]);

  // Capture real GPS location - CONTINUOUS TRACKING
  useEffect(() => {
    if (navigator.geolocation) {
      // Start continuous GPS tracking
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          addLog('[!] GPS: Error - check permissions');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      addLog('[✓] GPS: Continuous tracking active');

      // Cleanup - stop watching when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Add new contact
  const handleAddContact = (contactData) => {
    const newContact = contactService.addContact(contactData);
    setContacts([...contacts, newContact]);
    addLog(`[+] Contact added: ${contactData.name}`);
  };

  // Delete contact
  const handleDeleteContact = (contactId) => {
    contactService.deleteContact(contactId);
    setContacts(contacts.filter(c => c.id !== contactId));
    addLog(`[-] Contact removed`);
  };

  // Trigger SOS blast
  const triggerSOS = async () => {
    setIsSOS(true);
    addLog('[ALERT]: 🚨 SOS BLAST INITIATED');
    
    await sosService.triggerSOSBlast(contacts, geo, twilioConfig, addLog);

    // Play alarm sound
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  return (
    <div className="w-full h-screen bg-[#020202] flex text-white font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR - COMPACT */}
      <div className="w-56 border-r border-gray-900 bg-black/50 p-6 flex flex-col gap-4 z-20 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">SENTINEL<span className="text-brand">CLICK</span></h1>
          <p className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">Prototype v7.0</p>
        </div>

        <div className="space-y-2">
          {Object.keys(PRODUCTS).map(k => (
            <button key={k} onClick={() => {setActiveTab(k); setIsSOS(false); setIsTrack(false);}} className={`w-full p-3 rounded-xl border-2 text-left transition-all text-[11px] ${activeTab === k ? 'border-brand bg-brand/5' : 'border-gray-900 hover:border-gray-800'}`}>
              <div className="font-black uppercase">{PRODUCTS[k].name}</div>
              <div className="text-[8px] text-gray-500 mt-0.5">{PRODUCTS[k].target}</div>
            </button>
          ))}
        </div>

        <div className="mt-auto p-3 bg-gray-900/30 rounded-xl border border-gray-800 text-[8px] leading-relaxed text-gray-400">
           <strong className="text-brand uppercase block mb-1 font-black text-[9px]">Quick Start:</strong>
           1. Mobile tab<br/>
           2. Add Twilio keys<br/>
           3. Add contacts<br/>
           4. Click 3D button
        </div>
      </div>

      {/* 2. MAIN HUB */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-8 bg-black/20">
          <div className="flex gap-3">
             <button onClick={() => setSwView('web')} className={`text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full border transition-all ${swView === 'web' ? 'bg-brand text-black border-brand' : 'text-gray-500 border-gray-800'}`}>Web</button>
             <button onClick={() => setSwView('mobile')} className={`text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full border transition-all ${swView === 'mobile' ? 'bg-brand text-black border-brand' : 'text-gray-500 border-gray-800'}`}>Mobile</button>
          </div>
          {isSOS && <button onClick={() => setIsSOS(false)} className="text-[9px] font-black bg-red-600 px-4 py-1.5 rounded-full animate-pulse">Resolve</button>}
        </div>

        <div className="flex-1 flex gap-2 p-2">
          {/* 3D VIEWER - SMALLER */}
          <div className="flex-1 relative border border-gray-900/50 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:32px_32px] rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
              <ambientLight intensity={1} />
              <Environment preset="city" />
              <Suspense fallback={null}>
                {activeTab === 'keychain' && <ModelKeychain trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(!isTrack)} />}
                {activeTab === 'tracker' && <ModelSilicone trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(!isTrack)} />}
                {activeTab === 'pendant' && <ModelPendant trigger={triggerSOS} tracking={isTrack} toggleTrack={() => setIsTrack(!isTrack)} />}
              </Suspense>
              <ContactShadows position={[0, -2.4, 0]} opacity={0.6} scale={10} blur={2} color={isSOS ? "red" : "black"} />
              <OrbitControls makeDefault enablePan={false} autoRotate={!isSOS && !isTrack} />
            </Canvas>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-gray-800 text-[8px] font-mono text-brand uppercase tracking-widest">{PRODUCTS[activeTab].price}</div>
          </div>

          {/* SOFTWARE PANEL - MUCH BIGGER */}
          <div className="flex-1 flex items-center justify-center bg-[#050505] rounded-lg border border-gray-900/50">
            {swView === 'mobile' ? 
              <MobileSimulator 
                isSOS={isSOS} 
                isTrack={isTrack} 
                geo={geo} 
                contacts={contacts} 
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
                twilioConfig={twilioConfig}
                onUpdateTwilio={setTwilioConfig}
              /> : 
              <WebSimulator 
                isSOS={isSOS} 
                isTrack={isTrack} 
                geo={geo} 
                logs={logs} 
                contacts={contacts}
                onDeleteContact={handleDeleteContact}
              />
            }
          </div>
        </div>
      </div>

    </div>
  );
}