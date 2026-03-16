import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonCache } from '../../../context/PokemonCacheContext';
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import {
    SearchWrapper,
    SearchForm,
    SearchInput,
    SearchDropDown,
    SearchDropDownItem,
    ResultSprite,
    ResultName,
    ResultNumber,
} from './Search.styled';

function getIdFromUrl(url) {
    return url.split('/').filter(Boolean).pop();
}

function Search() {
    const { listState } = usePokemonCache();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const wrapperRef = useRef(null);

    // Debounced filter — 150ms after last keystroke
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => {
            const q = query.toLowerCase().replace(/\s+/g, '-');
            const list = listState.list;
            const startsWith = list.filter(p => p.name.startsWith(q));
            const contains  = list.filter(p => !p.name.startsWith(q) && p.name.includes(q));
            setResults([...startsWith, ...contains].slice(0, 8));
        }, 150);
        return () => clearTimeout(timer);
    }, [query, listState.list]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setResults([]);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function navigateTo(pokemon) {
        const id = getIdFromUrl(pokemon.url);
        navigate(`/collection/${id}`);
        setResults([]);
        setQuery('');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (results.length > 0) navigateTo(results[0]);
        }
        if (e.key === 'Escape') {
            setResults([]);
        }
    }

    return (
        <SearchWrapper ref={wrapperRef}>
            <SearchForm onSubmit={(e) => { e.preventDefault(); if (results.length > 0) navigateTo(results[0]); }}>
                <SearchInput
                    type="text"
                    placeholder="Search for Pokémon..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
            </SearchForm>

            {results.length > 0 && (
                <SearchDropDown>
                    {results.map((pokemon) => {
                        const id = getIdFromUrl(pokemon.url);
                        return (
                            <SearchDropDownItem key={pokemon.name} onClick={() => navigateTo(pokemon)}>
                                <ResultSprite
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`}
                                    alt={pokemon.name}
                                    onError={(e) => {
                                        e.currentTarget.onError = null;
                                        e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                                    }}
                                />
                                <ResultName>{capitalizeFirstLetter(pokemon.name)}</ResultName>
                                <ResultNumber>#{String(id).padStart(3, '0')}</ResultNumber>
                            </SearchDropDownItem>
                        );
                    })}
                </SearchDropDown>
            )}
        </SearchWrapper>
    );
}

export default Search;
