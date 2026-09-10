'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para os ícones padrão do Leaflet no Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProjetoComGps {
  id: string;
  numero_projeto: string;
  nome_projeto?: string | null;
  latitude: number;
  longitude: number;
  clientes?: { nome: string } | null;
  motoristas?: { nome: string } | null;
  entregue_em?: string | null;
  comprovante_url?: string | null;
}

interface MapaProps {
  projetos: ProjetoComGps[];
}

export default function MapaEntregas({ projetos }: MapaProps) {
  // Posição central padrão (São Paulo / Região do projeto ou média das posições)
  const centroPadrao: [number, number] = projetos.length > 0 && projetos[0].latitude
    ? [projetos[0].latitude, projetos[0].longitude]
    : [-23.55052, -46.633308]; // São Paulo - SP

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer
        center={centroPadrao}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Camada de mapa em modo escuro (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {projetos.map((p) => {
          if (!p.latitude || !p.longitude) return null;

          return (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 text-slate-900 font-sans">
                  <p className="font-extrabold text-sm border-b pb-1 mb-1 text-emerald-700">
                    {p.numero_projeto} {p.nome_projeto ? `— ${p.nome_projeto}` : ''}
                  </p>
                  <p className="text-xs font-semibold">👤 Cliente: {p.clientes?.nome || '—'}</p>
                  <p className="text-xs text-slate-600">🚚 Motorista: {p.motoristas?.nome || '—'}</p>
                  {p.entregue_em && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      📅 {new Date(p.entregue_em).toLocaleString('pt-BR')}
                    </p>
                  )}
                  {p.comprovante_url && (
                    <a
                      href={p.comprovante_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-center bg-emerald-600 text-white font-bold text-[11px] py-1 px-2 rounded hover:bg-emerald-700"
                    >
                      Ver Comprovante
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}