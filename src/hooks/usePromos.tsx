import { useEffect, useState } from 'react';

import {
  getPromos,
  PromoStorage,
  Promos,
  setPromos,
} from '../controllers/promos';

export const usePromo = (promo: Promos) => {
  const [promoStage, setPromoState] = useState<PromoStorage | null>(null);

  useEffect(() => {
    getPromos().then((promos) => setPromoState(promos));
  }, []);

  const handleDismiss = () => {
    if (promoStage) {
      setPromoState((s) => {
        const promosState = s ?? { dismissed: [] };
        const newPromosState = {
          ...promosState,
          dismissed: [...promosState.dismissed, promo],
        };
        setPromos(newPromosState); // save to storage
        return newPromosState;
      });
    }
  };

  return {
    loading: !promoStage,
    enabled: promoStage && !promoStage.dismissed.includes(promo),
    dismiss: handleDismiss,
  };
};
