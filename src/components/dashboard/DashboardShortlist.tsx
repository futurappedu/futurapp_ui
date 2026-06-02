import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Check, Loader2, Lock, Plus, Search, X } from 'lucide-react';
import { adminApi } from '@/services/adminApi';

const TOTAL_SLOTS = 5;

interface UniversityOption {
  id_universidad: number;
  universidad: string;
}

interface SelectedUniversity {
  id: number;
  name: string;
}

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getAbbreviation = (name: string): string =>
  normalizeText(name)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('');

const getHighlightIndices = (text: string, query: string): Set<number> => {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query).replace(/\s+/g, '');

  if (!normalizedQuery) {
    return new Set<number>();
  }

  const indices = new Set<number>();
  let cursor = 0;

  for (const char of normalizedQuery) {
    const foundAt = normalizedText.indexOf(char, cursor);
    if (foundAt === -1) {
      return new Set<number>();
    }
    indices.add(foundAt);
    cursor = foundAt + 1;
  }

  return indices;
};

const rankUniversityMatch = (name: string, query: string): number => {
  const normalizedName = normalizeText(name);
  const normalizedQuery = normalizeText(query).trim();
  const abbreviation = getAbbreviation(name);

  if (!normalizedQuery) {
    return 0;
  }

  if (abbreviation.startsWith(normalizedQuery)) {
    return 400 - normalizedQuery.length;
  }

  if (abbreviation.includes(normalizedQuery)) {
    return 320 - abbreviation.indexOf(normalizedQuery);
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 260 - normalizedQuery.length;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 180 - normalizedName.indexOf(normalizedQuery);
  }

  const sequential = getHighlightIndices(name, normalizedQuery);
  if (sequential.size === normalizedQuery.replace(/\s+/g, '').length) {
    return 120 - Math.min(...sequential);
  }

  return -1;
};

const HighlightedName = ({ name, query }: { name: string; query: string }) => {
  const highlightIndices = getHighlightIndices(name, query);

  if (!query.trim() || highlightIndices.size === 0) {
    return <>{name}</>;
  }

  return (
    <>
      {Array.from(name).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={highlightIndices.has(index) ? 'text-brand-accent font-semibold' : undefined}
        >
          {char}
        </span>
      ))}
    </>
  );
};

export function DashboardShortlist() {
  const { getAccessTokenSilently } = useAuth0();

  const [slots, setSlots] = useState<Array<SelectedUniversity | null>>(() =>
    Array.from({ length: TOTAL_SLOTS }, () => null)
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UniversityOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const filled = slots.filter(Boolean).length;
  const isUnlocked = filled === TOTAL_SLOTS;

  const selectedUniversityIds = useMemo(
    () => new Set(slots.filter((slot): slot is SelectedUniversity => slot !== null).map((slot) => slot.id)),
    [slots]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (activeSlotIndex === null) {
        return;
      }

      if (!debouncedQuery) {
        setSearchResults([]);
        setSearchError(null);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);
        const data = await adminApi.getUniversities(1, 20, debouncedQuery, getAccessTokenSilently);
        const items = Array.isArray(data?.items) ? (data.items as UniversityOption[]) : [];

        const ranked = items
          .map((item) => ({ item, score: rankUniversityMatch(item.universidad, debouncedQuery) }))
          .filter((entry) => entry.score >= 0)
          .sort((a, b) => b.score - a.score)
          .map((entry) => entry.item);

        setSearchResults(ranked);
      } catch (error) {
        console.error('Failed to search universities', error);
        setSearchError('No pudimos buscar universidades. Intenta de nuevo.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchUniversities();
  }, [activeSlotIndex, debouncedQuery, getAccessTokenSilently]);

  const openSlotSearch = (slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setQuery(slots[slotIndex]?.name ?? '');
    setDebouncedQuery(slots[slotIndex]?.name ?? '');
    setSearchResults([]);
    setSearchError(null);
  };

  const closeSlotSearch = () => {
    setActiveSlotIndex(null);
    setQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  const selectUniversity = (slotIndex: number, university: UniversityOption) => {
    setSlots((currentSlots) => {
      const nextSlots = [...currentSlots];
      nextSlots[slotIndex] = { id: university.id_universidad, name: university.universidad };
      return nextSlots;
    });
    closeSlotSearch();
  };

  const removeUniversity = (slotIndex: number) => {
    setSlots((currentSlots) => {
      const nextSlots = [...currentSlots];
      nextSlots[slotIndex] = null;
      return nextSlots;
    });

    if (activeSlotIndex === slotIndex) {
      closeSlotSearch();
    }
  };

  return (
    <div className="bg-brand-deep text-brand-deep-foreground rounded-3xl p-6 sticky top-8">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-lg font-bold">Mi Shortlist</h2>
        <span className="text-[11px] text-white/50 font-mono tabular-nums">
          {filled}/{TOTAL_SLOTS}
        </span>
      </div>
      <p className="text-xs text-white/60 mb-6 leading-relaxed">
        Define tus 5 opciones finales para desbloquear requisitos, fechas y tu plan de aplicación.
      </p>

      <ol className="space-y-2.5">
        {slots.map((slot, i) => (
          <li key={i}>
            <div className="relative">
              <button
                type="button"
                onClick={() => openSlotSearch(i)}
                className={[
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors',
                  slot
                    ? 'bg-white/10 border-white/30 hover:bg-white/15'
                    : 'bg-white/[0.03] border-dashed border-white/15 hover:bg-white/[0.07]'
                ].join(' ')}
              >
                <span className="size-6 flex items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/70 shrink-0">
                  {i + 1}
                </span>

                {slot ? (
                  <span className="text-xs font-semibold text-white leading-snug pr-2">
                    {slot.name}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-white/40 italic">
                    Selecciona una universidad...
                  </span>
                )}

                {slot ? (
                  <span className="ml-auto size-5 rounded-full bg-emerald-400/15 text-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </span>
                ) : (
                  <Plus className="ml-auto size-4 text-white/30 shrink-0" />
                )}
              </button>

              {slot && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeUniversity(i);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center"
                  aria-label={`Eliminar ${slot.name}`}
                >
                  <X className="size-3.5" />
                </button>
              )}

              {activeSlotIndex === i && (
                <div className="absolute left-0 right-0 mt-2 z-20 rounded-xl border border-white/20 bg-brand-deep shadow-2xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
                    <Search className="size-3.5 text-white/50 shrink-0" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Busca por nombre o iniciales (ej. EA, IE)..."
                      className="w-full bg-transparent text-xs text-white placeholder:text-white/45 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={closeSlotSearch}
                      className="text-white/50 hover:text-white"
                      aria-label="Cerrar búsqueda"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  <div className="max-h-52 overflow-y-auto overscroll-contain">
                    {!debouncedQuery ? (
                      <p className="text-[11px] text-white/50 px-3 py-3">
                        Empieza a escribir para buscar universidades.
                      </p>
                    ) : isSearching ? (
                      <div className="px-3 py-3 text-[11px] text-white/60 flex items-center gap-2">
                        <Loader2 className="size-3.5 animate-spin" />
                        Buscando universidades...
                      </div>
                    ) : searchError ? (
                      <p className="text-[11px] text-rose-200 px-3 py-3">{searchError}</p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-[11px] text-white/50 px-3 py-3">
                        No encontramos resultados para &quot;{debouncedQuery}&quot;.
                      </p>
                    ) : (
                      <ul>
                        {searchResults.map((university) => {
                          const alreadySelected = selectedUniversityIds.has(university.id_universidad);

                          return (
                            <li key={university.id_universidad}>
                              <button
                                type="button"
                                disabled={alreadySelected}
                                onClick={() => selectUniversity(i, university)}
                                className={[
                                  'w-full text-left px-3 py-2.5 text-xs border-b border-white/5 last:border-b-0',
                                  alreadySelected
                                    ? 'text-white/35 cursor-not-allowed'
                                    : 'text-white hover:bg-white/10'
                                ].join(' ')}
                              >
                                <span className="block leading-relaxed">
                                  <HighlightedName name={university.universidad} query={debouncedQuery} />
                                </span>
                                {alreadySelected && (
                                  <span className="text-[10px] text-white/45">Ya añadida en otro slot</span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        disabled={!isUnlocked}
        className="w-full mt-6 py-3 bg-white text-brand-deep rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="size-3.5" />
        Desbloquear calendario de aplicación
      </button>
      <p className="text-[10px] text-center text-white/50 mt-3 leading-relaxed">
        {isUnlocked
          ? 'Shortlist completa. Ya puedes activar la etapa 2.'
          : `Faltan ${TOTAL_SLOTS - filled} selecciones para activar la etapa 2.`}
      </p>
    </div>
  );
}
