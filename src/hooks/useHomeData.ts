import { useState, useEffect, useMemo } from 'react';

export const useHomeData = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [loyaltyEmail, setLoyaltyEmail] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, recsRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/recommendations')
        ]);
        const menuData = await menuRes.json();
        const recsData = await recsRes.json();
        setMenuItems(menuData.items || []);
        setRecommendations(recsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(menuItems.map(item => item.category))], [menuItems]);

  const filteredMenu = useMemo(() => {
    let filtered = menuItems;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [menuItems, activeCategory, searchQuery]);

  const fetchLoyalty = async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/loyalty/${email}`);
      const data = await res.json();
      setLoyaltyPoints(data ? data.points : 0);
    } catch (err) {
      console.error('Error fetching loyalty:', err);
      setLoyaltyPoints(0);
    }
  };

  const joinLoyalty = async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch('/api/loyalty/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        fetchLoyalty(email);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Join loyalty error:', err);
      return false;
    }
  };

  const checkout = async (cart: any[], total: number, email?: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: "Guest",
          customer_email: email || "guest@example.com",
          address: "123 Sample St, Mumbai",
          items: cart,
          total: total + 40
        })
      });
      if (!res.ok) throw new Error('Checkout failed');
      return await res.json();
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  };

  return {
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
  };
};
