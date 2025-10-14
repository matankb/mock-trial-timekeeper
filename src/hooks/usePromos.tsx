import { useEffect, useState } from 'react';

import {
  getPromos,
  PromoStorage,
  Promos,
  setPromos,
} from '../controllers/promos';

export const usePromo = (promo: Promos) => {
  const [promoStorage, setPromoStorage] = useState<PromoStorage | null>(null);

  useEffect(() => {
    getPromos().then((promos) => setPromoStorage(promos));
  }, []);

  const handleDismiss = () => {
    if (promoStorage) {
      setPromoStorage((s) => {
        const newPromos = {
          ...s,
          dismissed: [...s.dismissed, promo],
        };
        setPromos(newPromos); // save to storage
        return newPromos;
      });
    }
  };

  const handleUnDismiss = () => {
    if (promoStorage) {
      setPromoStorage((s) => {
        const newPromos = {
          ...s,
          dismissed: s.dismissed.filter((p) => p !== promo),
        };
        setPromos(newPromos); // save to storage
        return newPromos;
      });
    }
  };

  return {
    loading: !promoStorage,
    enabled: promoStorage && !promoStorage.dismissed.includes(promo),
    dismiss: handleDismiss,
    unDismiss: handleUnDismiss,
  };
};
