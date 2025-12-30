"use client";

import { useState, useEffect } from "react";

export interface FavoriteItem {
  id: string | number;
  name: string;
  image?: string;
  price: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: FavoriteItem) => {
    const exists = favorites.some((fav) => fav.id === product.id);

    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const isFavorite = (id: string | number) => {
    return favorites.some((f) => f.id === id);
  };

  return { favorites, toggleFavorite, isFavorite };
};
