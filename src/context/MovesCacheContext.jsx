import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { sanitizeFlavorText } from '../utils/stringUtils';

const MovesCacheContext = createContext(null);
const BATCH_SIZE = 20;

export function MovesCacheProvider({ children }) {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const loadingRef = useRef(false);
    const loadedRef = useRef(false);
    const detailCacheRef = useRef(new Map());

    const fetchMoves = useCallback(async () => {
        if (loadedRef.current || loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            const listRes = await fetch('https://pokeapi.co/api/v2/move?limit=1000&offset=0');
            const listData = await listRes.json();
            const urls = listData.results.map(m => m.url);

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
                    if (shortEffect && d.effect_chance != null) {
                        shortEffect = shortEffect.replace(/\$effect_chance\$/g, d.effect_chance);
                    }

                    results.push({
                        name: d.name,
                        type: d.type?.name ?? null,
                        damageClass: d.damage_class?.name ?? null,
                        power: d.power ?? null,
                        accuracy: d.accuracy ?? null,
                        pp: d.pp ?? null,
                        generation: d.generation?.name ?? null,
                        shortEffect,
                    });

                    if (!detailCacheRef.current.has(d.name)) {
                        detailCacheRef.current.set(d.name, d);
                    }
                });
                setMoves([...results]);
            }

            loadedRef.current = true;
            setFullyLoaded(true);
        } catch (err) {
            console.error('Failed to fetch moves:', err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []);

    const fetchMoveDetail = useCallback(async (name) => {
        if (detailCacheRef.current.has(name)) {
            return detailCacheRef.current.get(name);
        }
        const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`);
        const data = await res.json();
        detailCacheRef.current.set(name, data);
        return data;
    }, []);

    return (
        <MovesCacheContext.Provider value={{ moves, loading, fullyLoaded, fetchMoves, fetchMoveDetail }}>
            {children}
        </MovesCacheContext.Provider>
    );
}

export function useMovesCache() {
    return useContext(MovesCacheContext);
}
