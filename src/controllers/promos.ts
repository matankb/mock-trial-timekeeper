import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PromoStorage {
  dismissed: string[];
}

const defaultPromosStorage: PromoStorage = {
  dismissed: [],
};

export enum Promos {
  WITNESS_CALL = 'witness_call', // create trial inline witness call promo
}

const PROMOS_KEY = 'promos';
const PROMOS_SCHEMA_VERSION_KEY = 'promos_schema_version';
const PROMOS_SCHEMA_VERSION = '1.0.0';

export async function getPromos(): Promise<PromoStorage> {
  const promos = await AsyncStorage.getItem(PROMOS_KEY);

  if (!promos) {
    return defaultPromosStorage;
  }

  return JSON.parse(promos) as PromoStorage;
}

export async function setPromos(promos: PromoStorage) {
  await AsyncStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
  await AsyncStorage.setItem(PROMOS_SCHEMA_VERSION_KEY, PROMOS_SCHEMA_VERSION);
}
