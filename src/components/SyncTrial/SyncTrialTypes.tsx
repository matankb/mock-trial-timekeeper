import { Trial } from '../../controllers/trial';

export const SYNC_TRIAL_KEY = 'mock_trial_timekeeper_sync_trial';
export const SYNC_TRIAL_SCHEMA_VERSION = '1.0.0';
export interface SyncTrialTransferredData {
  key: string;
  version: string;
  data: Pick<Trial, 'times' | 'name'>;
}

export enum SyncTrialMode {
  Import,
  Export,
}

export enum ScanError {
  NotJSON = 'not_json',
  WrongKey = 'wrong_key',
  WrongSchema = 'wrong_schema',
}
