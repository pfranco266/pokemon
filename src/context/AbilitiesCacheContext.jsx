import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { sanitizeFlavorText } from '../utils/stringUtils';

const AbilitiesCacheContext = createContext(null);

const BATCH_SIZE = 20;

export function AbilitiesCacheProvider({ children }) {
    const [abilities, setAbilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const loadingRef = useRef(false);
    const loadedRef = useRef(false);
    const detailCacheRef = useRef(new Map());

    const fetchAbilities = useCallback(async () => {
        if (loadedRef.current || loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            const listRes = await fetch('https://pokeapi.co/api/v2/ability?limit=400&offset=0');
            const listData = await listRes.json();
            const urls = listData.results.map(a => a.url);

            const results = [];
            for (let i = 0; i < urls.length; i += BATCH_SIZE) {
                const batch = urls.slice(i, i + BATCH_SIZE);
                const batchData = await Promise.all(
                    batch.map(url => fetch(url).then(r => r.json()))
                );
                batchData.forEach(d => {
                    const enEffect = d.effect_entries?.find(e => e.language.name === 'en');
                    let shortEffect = enEffect?.short_effect
                        ? sanitizeFlavorText(enEffect.short_effect)
                        : null;

                    if (!shortEffect) {
                        const enFlavors = d.flavor_text_entries?.filter(e => e.language.name === 'en') ?? [];
                        const latestFlavor = enFlavors[enFlavors.length - 1];
                        shortEffect = latestFlavor?.flavor_text
                            ? sanitizeFlavorText(latestFlavor.flavor_text)
                            : null;
                    }

                    results.push({
                        name: d.name,
                        generation: d.generation?.name ?? null,
                        shortEffect,
                    });
                });
                const sorted = [...results].sort((a, b) => a.name.localeCompare(b.name));
                setAbilities(sorted);
            }

            loadedRef.current = true;
            setFullyLoaded(true);
        } catch (err) {
            console.error('Failed to fetch abilities:', err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []);

    const fetchAbilityDetail = useCallback(async (name) => {
        if (detailCacheRef.current.has(name)) {
            return detailCacheRef.current.get(name);
        }
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${name}`);
        const data = await res.json();
        detailCacheRef.current.set(name, data);
        return data;
    }, []);

    return (
        <AbilitiesCacheContext.Provider value={{ abilities, loading, fullyLoaded, fetchAbilities, fetchAbilityDetail }}>
            {children}
        </AbilitiesCacheContext.Provider>
    );
}

export function useAbilitiesCache() {
    return useContext(AbilitiesCacheContext);
}
