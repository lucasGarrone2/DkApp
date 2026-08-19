'use client';

import { useState } from 'react';
import { Listing } from '@/types/listing';
import { calculateListingMatch, supportsThreeCpr } from '@/lib/recommendationScore';
import {
  formatRelativeTime,
  formatPrice,
  formatPricePerM2,
  calculateMoveInCost,
  calculateCostPerPerson,
  generateGoogleMapsRouteUrl,
  generateQuickApplyText,
  generateWhatsAppShareText,
} from '@/utils/format';

interface ListingCardProps {
  listing: Listing;
  peopleCount: number;
  onStatusChange: (id: string, newStatus: Listing['status']) => void;
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onUpdateNotes: (id: string, notes: string, contactedBy: string) => void;
}

export default function ListingCard({
  listing,
  peopleCount,
  onStatusChange,
  onToggleFavorite,
  onUpdateNotes,
}: ListingCardProps) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [noteText, setNoteText] = useState(listing.notes || '');
  const [contactedByText, setContactedByText] = useState(listing.contacted_by || '');
  const [copied, setCopied] = useState(false);

  // Algorithm scoring for Working Holiday group
  const match = calculateListingMatch(listing, peopleCount);
  const is3CprValid = supportsThreeCpr(listing);

  const image = listing.images && listing.images.length > 0 ? listing.images[0] : null;
  const priceFormatted = formatPrice(listing.price_dkk);
  const pricePerM2 = formatPricePerM2(listing.price_dkk, listing.size_m2);
  const timeAgo = formatRelativeTime(listing.scraped_at);

  // Financial Calculations
  const moveInCostDkk = calculateMoveInCost(listing.price_dkk, listing.deposit_dkk, listing.prepaid_rent_dkk);
  const moveInCostFormatted = formatPrice(moveInCostDkk);

  // Cost Per Person Calculations (with USD inline)
  const monthlyPerPerson = formatPrice(calculateCostPerPerson(listing.price_dkk, peopleCount));
  const moveInPerPerson = formatPrice(calculateCostPerPerson(moveInCostDkk, peopleCount));

  const platformColor =
    listing.source_platform.toLowerCase() === 'dba'
      ? 'bg-[#0066CC]'
      : listing.source_platform.toLowerCase() === 'lejebolig'
      ? 'bg-[#059669]'
      : listing.source_platform.toLowerCase() === 'edc'
      ? 'bg-amber-600'
      : listing.source_platform.toLowerCase().includes('kvik')
      ? 'bg-indigo-600'
      : 'bg-blue-600';

  const scoreBadgeColors = {
    success: 'bg-emerald-500/90 text-white shadow-emerald-500/20 border border-emerald-400/30',
    info: 'bg-blue-600/90 text-white shadow-blue-600/20 border border-blue-400/30',
    warning: 'bg-amber-500/90 text-slate-900 shadow-amber-500/20 border border-amber-400/30',
    destructive: 'bg-rose-600/90 text-white shadow-rose-600/20 border border-rose-400/30',
  };

  const statusColors = {
    new: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    interested: 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
    applied: 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60',
    rejected: 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
  };

  const handleCopyApply = () => {
    const text = generateQuickApplyText(listing.title, listing.location_name);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppShareText(
      listing.title,
      listing.url,
      listing.price_dkk,
      moveInCostDkk,
      match.score,
      peopleCount
    );
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSaveNotes = () => {
    onUpdateNotes(listing.id, noteText, contactedByText);
    setShowNotesModal(false);
  };

  const mapsRouteUrl = generateGoogleMapsRouteUrl(listing.location_name, listing.postal_code);

  return (
    <div className="group bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-2xl/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/80">
            <svg className="w-10 h-10 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[11px] font-medium">Sin foto disponible</span>
          </div>
        )}

        {/* Gradient Bottom Shadow for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Phase 3 Recommendation Match Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <div className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md flex items-center gap-1.5 backdrop-blur-md ${scoreBadgeColors[match.badgeVariant]}`}>
            <span>{match.score}%</span>
            <span>·</span>
            <span>{match.label}</span>
          </div>
        </div>

        {/* Favorite Star Button */}
        <button
          onClick={() => onToggleFavorite(listing.id, listing.is_favorite)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            listing.is_favorite
              ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
              : 'bg-slate-900/60 text-white/90 hover:bg-slate-900/90 hover:scale-105'
          }`}
          title={listing.is_favorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
        >
          ★
        </button>

        {/* Price Tag Overlay */}
        {listing.price_dkk && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md border border-white/10">
              {priceFormatted} / mes
            </span>
            <span className={`${platformColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/10`}>
              {listing.source_platform}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        
        {/* Title */}
        <h2 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug mb-3 line-clamp-2" title={listing.title}>
          {listing.title}
        </h2>

        {/* Metric Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs text-slate-700 dark:text-slate-300 mb-3">
          {listing.size_m2 && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              📐 {listing.size_m2} m²
            </span>
          )}
          {listing.rooms && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              🛏️ {listing.rooms} hab.
            </span>
          )}
          {listing.location_name && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              📍 {listing.location_name}
            </span>
          )}

          {/* CPR Badge */}
          {listing.cpr_allowed !== null && (
            <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
              listing.cpr_allowed 
                ? is3CprValid
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700/80'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80' 
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/80'
            }`}>
              {listing.cpr_allowed 
                ? (is3CprValid ? '🪪 Apto 3 CPR' : '🪪 CPR OK') 
                : '⚠️ No CPR'}
            </span>
          )}

          {/* Rental Period Badge */}
          {listing.rental_period_type !== 'unknown' && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              ⏳ {listing.rental_period_type === 'unlimited' ? 'Ilimitado' : 'Temporal'}
            </span>
          )}
        </div>

        {/* 💵 COST PER PERSON BREAKDOWN BOX (WITH USD) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-slate-900 p-3 rounded-xl mb-3 space-y-1.5 border border-blue-200/80 dark:border-blue-900/50 shadow-sm">
          <div className="flex justify-between items-center font-bold text-blue-950 dark:text-blue-100">
            <span className="text-xs">👥 Cada uno paga (÷ {peopleCount}):</span>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-black">{monthlyPerPerson} / mes</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-300">
            <span>🔑 Costo inicial por persona:</span>
            <span className="font-bold">{moveInPerPerson} total</span>
          </div>
        </div>

        {/* Financial Breakdown (Move-in Cost Total) */}
        <div className="bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-3 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-900 dark:text-white">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Departamento:</span>
            <span className="text-slate-900 dark:text-white font-bold">{moveInCostFormatted} inicial</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[10px]">
            <span>Alquiler + Depósito ({formatPrice(listing.deposit_dkk)})</span>
            {listing.price_dkk && listing.size_m2 && (
              <span>💰 {pricePerM2}</span>
            )}
          </div>
        </div>

        {/* Expandable Group Recommendation Pros & Cons */}
        <div className="mb-4">
          <button
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="w-full text-left text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1">
              🎯 Evaluación del grupo ({match.pros.length} pros / {match.cons.length} contras)
            </span>
            <span className="text-xs">{showScoreDetails ? '▲' : '▼'}</span>
          </button>

          {showScoreDetails && (
            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              {match.pros.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] block">Puntos a favor:</span>
                  {match.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                      <span className="text-emerald-500 font-bold">✓</span> {pro}
                    </div>
                  ))}
                </div>
              )}

              {match.cons.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-[11px] block">Advertencias / Contras:</span>
                  {match.cons.map((con, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                      <span className="text-rose-500 font-bold">⚠️</span> {con}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Group Collaboration Bar: Status & Notes */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 mb-3.5">
          <select
            value={listing.status}
            onChange={(e) => onStatusChange(listing.id, e.target.value as Listing['status'])}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer transition-colors ${statusColors[listing.status]}`}
          >
            <option value="new">⚪ Sin revisar</option>
            <option value="interested">🟡 Interesado</option>
            <option value="applied">🔵 Aplicado</option>
            <option value="rejected">🔴 Descartado</option>
          </select>

          <button
            onClick={() => setShowNotesModal(true)}
            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
              listing.notes
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            💬 {listing.notes ? 'Nota guardada' : '+ Nota'}
          </button>
        </div>

        {/* Group Note Preview if exists */}
        {listing.notes && (
          <div className="mb-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 p-2.5 rounded-xl text-[11px] text-amber-900 dark:text-amber-200">
            <span className="font-bold">{listing.contacted_by || 'Amigo'}:</span> "{listing.notes}"
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-auto space-y-2 pt-1">
          
          <div className="flex gap-1.5">
            <button
              onClick={handleCopyApply}
              className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 border-transparent shadow-sm'
              }`}
            >
              {copied ? '✓ ¡Copiado!' : '📋 Postulación'}
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
              title="Compartir resumen formateado por WhatsApp al grupo"
            >
              💬 WhatsApp
            </button>

            {/* Cycling Route to Station Link */}
            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
              title="Ruta en bicicleta hasta la Estación Central (København H)"
            >
              🚲 Ruta
            </a>
          </div>

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 text-xs font-bold text-center text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
          >
            Ver publicación en {listing.source_platform} →
          </a>
        </div>

      </div>

      {/* Group Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                💬 Bitácora del Grupo
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guarda notas compartidas para este departamento (ej. quién contactó al dueño o qué respondió).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tu nombre / Nombre de quien envió el mensaje:
              </label>
              <input
                type="text"
                placeholder="Ej. Lucas, Mateo, Sofia..."
                value={contactedByText}
                onChange={(e) => setContactedByText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nota / Comentario:
              </label>
              <textarea
                rows={3}
                placeholder="Ej. Envié mensaje por DBA el lunes. Respondieron que se puede visitar el jueves a las 18hs."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-md"
              >
                Guardar nota
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
