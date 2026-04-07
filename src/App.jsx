
import './App.css'
import { Container } from './App.styled'
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { PokemonCacheProvider } from './context/PokemonCacheContext';
import { AbilitiesCacheProvider } from './context/AbilitiesCacheContext';
import { MovesCacheProvider } from './context/MovesCacheContext';
import { TypesCacheProvider } from './context/TypesCacheContext';
import AbilitiesLanding from './pages/Abilities/AbilitiesLanding';
import AbilityDetail from './pages/Abilities/AbilityDetail';
import MovesLanding from './pages/Moves/MovesLanding';
import MoveDetail from './pages/Moves/MoveDetail';
import TypesLanding from './pages/Types/TypesLanding';
import TypeDetail from './pages/Types/TypeDetail';
import BattlePage from './pages/Battle/BattlePage';
import TrendingPage from './pages/Trending/TrendingPage';

import Home from "./pages/Home/Home"
import Nav from "./components/Nav/Nav"
import Cart from './pages/Cart/Cart';
import PokemonCatalogFC from './pages/PokemonCatalogue/PokemonCatalogue';

import MoreInfoLanding from "./pages/PokemonDetail/MoreInfoLanding"
import BrowseLanding from './pages/Collection/BrowseLanding';
import Footer from "./components/Footer/Footer"
import CookieBanner from './components/CookieBanner/CookieBanner';
import { initGA, trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();
  const [bannerVisible, setBannerVisible] = useState(
    () => localStorage.getItem('analytics-consent') === null
  );

  // Initialize GA on mount if consent was already given on a previous visit
  useEffect(() => {
    if (localStorage.getItem('analytics-consent') === 'true') {
      initGA();
    }
  }, []);

  // Track page views on route change (consent check is inside trackPageView)
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
        <Container >
            <CartProvider>
            <PokemonCacheProvider>
            <AbilitiesCacheProvider>
            <MovesCacheProvider>
            <TypesCacheProvider>

              <Nav/>
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/collection" element={<BrowseLanding />}/>
                  <Route path="/collection/:id" element={<MoreInfoLanding/>}/>
                  <Route path="/pokemoncards" element={<PokemonCatalogFC />}/>
                  <Route path="/cart" element={<Cart />}/>
                  <Route path="/abilities" element={<AbilitiesLanding />}/>
                  <Route path="/abilities/:name" element={<AbilityDetail />}/>
                  <Route path="/moves" element={<MovesLanding />}/>
                  <Route path="/moves/:name" element={<MoveDetail />}/>
                  <Route path="/types" element={<TypesLanding />}/>
                  <Route path="/types/:name" element={<TypeDetail />}/>
                  <Route path="/battle" element={<BattlePage />}/>
                  <Route path="/trending" element={<TrendingPage />}/>
              </Routes>

            </TypesCacheProvider>
            </MovesCacheProvider>
            </AbilitiesCacheProvider>
            </PokemonCacheProvider>
            </CartProvider>
              <Footer onShowCookieSettings={() => setBannerVisible(true)} />
              {bannerVisible && (
                <CookieBanner onHide={() => setBannerVisible(false)} />
              )}
        </Container>
  )
}

export default App
