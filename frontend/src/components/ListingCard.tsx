'use client';

import { useState } from 'react';
import { Listing } from '@/types/listing';
import {
  calculateListingMatch,
  isSingleRoomListing,
  getEffectiveRooms,
  getMaxCprCapacity,
} from '@/lib/recommendationScore';
import {
  formatRelativeTime,
  formatPrice,
  formatPricePerM2,
  calculateMoveInCost,
  calculateCostPerPerson,
  generateGoogleMapsRouteUrl,
  generateQuickApplyText,
  generateWhatsAppShareText,
  cleanDisplayTitle,
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

  // Room offer & capacity detection
  const isRoomOnly = isSingleRoomListing(listing);
  const effectiveRooms = getEffectiveRooms(listing);
  const maxCpr = getMaxCprCapacity(listing);
  const displayTitle = cleanDisplayTitle(listing.title);

  // Algorithm scoring for Working Holiday applicants
  const match = calculateListingMatch(listing, peopleCount);

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
    const text = generateQuickApplyText(displayTitle, listing.location_name);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppShareText(
      displayTitle,
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
      
      {/* Header Bar (no images for legal compliance) */}
      <div className="relative px-4 pt-4 pb-3 bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/60 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between gap-2">
          {/* Score Badge */}
          <div className={`px-2.5 py-1 rounded-xl text-[11px] font-black shadow-sm flex items-center gap-1.5 ${scoreBadgeColors[match.badgeVariant]}`}>
            <span>{match.score}%</span>
            <span>·</span>
            <span>{match.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Platform Badge */}
            <span className={`${platformColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-white/10`}>
              {listing.source_platform}
            </span>

            {/* Favorite Star Button */}
            <button
              onClick={() => onToggleFavorite(listing.id, listing.is_favorite)}
              className={`p-1.5 rounded-lg transition-all ${
                listing.is_favorite
                  ? 'bg-amber-400 text-slate-900 shadow-sm scale-105'
                  : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105'
              }`}
              title={listing.is_favorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
            >
              ★
            </button>
          </div>
        </div>

        {/* Price */}
        {listing.price_dkk && (
          <div className="mt-2">
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {priceFormatted}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">/ mes</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        
        {/* Title */}
        <h2 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug mb-3 line-clamp-2" title={displayTitle}>
          {displayTitle}
        </h2>

        {/* Metric Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs text-slate-700 dark:text-slate-300 mb-3">
          {listing.size_m2 && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              📐 {listing.size_m2} m²
            </span>
          )}
          <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
            🛏️ {isRoomOnly ? '1 hab. (Privada)' : `${effectiveRooms} hab.`}
          </span>
          {listing.location_name && (
            <span className="bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              📍 {listing.location_name}
            </span>
          )}

          {/* CPR Badge */}
          {listing.cpr_allowed !== null && (
            <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
              listing.cpr_allowed 
                ? maxCpr >= 3
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700/80'
                  : maxCpr === 2
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700/80'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80' 
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/80'
            }`}>
              {listing.cpr_allowed 
                ? maxCpr >= 3
                  ? '🪪 Apto 3+ CPR'
                  : maxCpr === 2
                  ? '🪪 Apto 2 CPR'
                  : '🪪 1 CPR (Habitación)'
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

        {/* 💵 COST BREAKDOWN BOX (WITH USD) */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-slate-900 p-3 rounded-xl mb-3 space-y-1.5 border border-blue-200/80 dark:border-blue-900/50 shadow-sm">
          <div className="flex justify-between items-center font-bold text-blue-950 dark:text-blue-100">
            <span className="text-xs">
              {peopleCount > 1 ? `👥 Desglose por persona (÷ ${peopleCount}):` : '👤 Costo mensual:'}
            </span>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-black">{monthlyPerPerson} / mes</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-300">
            <span>🔑 Costo inicial {peopleCount > 1 ? 'por persona' : 'total'}:</span>
            <span className="font-bold">{moveInPerPerson} total</span>
          </div>
        </div>

        {/* Financial Breakdown (Move-in Cost Total) */}
        <div className="bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-3 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-900 dark:text-white">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Propiedad:</span>
            <span className="text-slate-900 dark:text-white font-bold">{moveInCostFormatted} inicial</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[10px]">
            <span>Alquiler + Depósito ({formatPrice(listing.deposit_dkk)})</span>
            {listing.price_dkk && listing.size_m2 && (
              <span>💰 {pricePerM2}</span>
            )}
          </div>
        </div>

        {/* Expandable Recommendation Pros & Cons */}
        <div className="mb-4">
          <button
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="w-full text-left text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1">
              🎯 Evaluación del alojamiento ({match.pros.length} pros / {match.cons.length} contras)
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

        {/* Status & Notes Bar */}
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

        {/* Note Preview if exists */}
        {listing.notes && (
          <div className="mb-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 p-2.5 rounded-xl text-[11px] text-amber-900 dark:text-amber-200">
            <span className="font-bold">{listing.contacted_by || 'Nota'}:</span> "{listing.notes}"
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
              title="Compartir resumen formateado por WhatsApp"
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

          {/* Legal compliance: prominent attribution and deep link */}
          <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-2.5 text-center">
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center justify-center gap-1"
            >
              🔗 Ver publicación original en {listing.source_platform} →
            </a>
            <p className="text-[10px] text-blue-600/70 dark:text-blue-400/60 mt-0.5">
              Datos agregados — consulte el portal para info completa y actualizada
            </p>
          </div>
        </div>

      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                💬 Bitácora y Notas
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guarda notas de seguimiento para este departamento (ej. fecha de visita o respuesta del arrendador).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de contacto / Quién escribió:
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
                placeholder="Ej. Contactado por el portal. Respondieron que se puede visitar el jueves a las 18hs."
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
