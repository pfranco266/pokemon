
import './App.css'
import { Container } from './App.styled'
import { Routes, Route} from 'react-router-dom';
import React from 'react';
import { CartProvider } from './context/CartContext';

import Home from "./pages/Home/Home"
import Nav from "./components/Nav/Nav"
import Cart from './pages/Cart/Cart';
import PokemonCatalogFC from './pages/PokemonCatalogue/PokemonCatalogue';

import MoreInfoLanding from "./pages/PokemonDetail/MoreInfoLanding"
import BrowseLanding from './pages/Collection/BrowseLanding';
import Footer from "./components/Footer"
function App() {
  return (
        <Container >
            <CartProvider>  
           

              <Nav/>
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/collection" element={<BrowseLanding />}/>
                  <Route path="/collection/:id" element={<MoreInfoLanding/>}/>
                  <Route path="/pokemoncards" element={<PokemonCatalogFC />}/>
                  <Route path="/cart" element={<Cart />}/>
              </Routes>

            </CartProvider>
              <Footer/>
        </Container>
  )
}

export default App
