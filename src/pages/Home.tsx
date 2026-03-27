import React from 'react';
import NewNavbar from '../components/NewNavbar';
import HeroSection from '../components/home/HeroSection';
import PopularDishes from '../components/home/PopularDishes';
import MenuSection from '../components/home/MenuSection';
import RecommendationsSection from '../components/home/RecommendationsSection';
import LoyaltySection from '../components/home/LoyaltySection';
import ReservationSection from '../components/home/ReservationSection';
import StorySection from '../components/home/StorySection';
import GallerySection from '../components/home/GallerySection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/home/Footer';
import CartModal from '../components/home/CartModal';
import ReservationModal from '../components/home/ReservationModal';
import { useCart } from '../context/CartContext';
import { useHomeData } from '../hooks/useHomeData';

const Home: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isCartOpen,
    setIsCartOpen,
    isReserving,
    setIsReserving,
    loyaltyEmail,
    setLoyaltyEmail,
    loyaltyPoints,
    menuItems,
    recommendations,
    categories,
    filteredMenu,
    fetchLoyalty,
    joinLoyalty,
    checkout
  } = useHomeData();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-100 selection:text-orange-600">
      <NewNavbar onCartClick={() => setIsCartOpen(true)} />

      <HeroSection />

      <PopularDishes 
        popularDishes={menuItems.filter(item => item.is_popular)} 
        addToCart={addToCart} 
      />

      <StorySection />

      <MenuSection 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMenu={filteredMenu}
        addToCart={addToCart}
      />

      <RecommendationsSection 
        recommendations={recommendations} 
        addToCart={addToCart} 
      />

      <GallerySection />

      <LoyaltySection 
        loyaltyEmail={loyaltyEmail}
        setLoyaltyEmail={setLoyaltyEmail}
        fetchLoyalty={fetchLoyalty}
        joinLoyalty={joinLoyalty}
        loyaltyPoints={loyaltyPoints}
      />

      <ReservationSection 
        isReserving={isReserving}
        setIsReserving={setIsReserving}
      />

      <ContactSection />

      <Footer />

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={total}
        clearCart={clearCart}
        onCheckout={checkout}
      />

      <ReservationModal 
        isOpen={isReserving}
        onClose={() => setIsReserving(false)}
      />
    </div>
  );
};

export default Home;
