import AsyncStorage from '@react-native-async-storage/async-storage';

interface Migration<FromSchema, ToSchema> {
  fromVersion: string;
  toVersion: string;
  migrate: (data: FromSchema) => ToSchema;
}

// TODO: is better typing than any needed?
// TOOD: maybe a dev-only check here to assert that there are complete migrations would be helpful here?
export function migrate<CurrentSchema>(
  data: CurrentSchema,
  storedVersion: string,
  migrations: Migration<any, any>[],
): CurrentSchema {
  let version = storedVersion;

  const eligibleMigrations = migrations.filter(
    (m) => m.fromVersion === version,
  );

  if (eligibleMigrations.length > 1) {
    const toVersions = eligibleMigrations.map((m) => m.toVersion).join(', ');
    throw new Error(
      `Attempting to migrate from version ${version} multiple migrations found (to ${toVersions})`,
    );
  }

  // No more migrations to apply
  if (eligibleMigrations.length === 0) {
    return data;
  }

  const migration = eligibleMigrations[0];
  const newData = migration.migrate(data);
  const newVersion = migration.toVersion;
  return migrate(newData, newVersion, migrations);
}

/**
 * Create a migration for a piece of data
 * @param migrate - The migration function to apply to the data directly
 */
export function createMigration<FromSchema, ToSchema>({
  from,
  to,
  migrate,
}: {
  from: string;
  to: string;
  migrate: (data: FromSchema) => ToSchema;
}) {
  return {
    fromVersion: from,
    toVersion: to,
    migrate,
  };
}

/**
 * Create a migration for an array of items
 * @param migrate - The migration function to apply to each item
 */
export function createArrayMigration<FromSchema, ToSchema>({
  from,
  to,
  migrate,
}: {
  from: string;
  to: string;
  migrate: (item: FromSchema) => ToSchema;
}) {
  return {
    fromVersion: from,
    toVersion: to,
    migrate: (items: FromSchema[]) => items.map(migrate),
  };
}

/**
 * Get an item from AsyncStorage, applying migrations if necessary
 */
export async function getStorageItem<T>({
  key,
  schemaVersionKey,
  currentSchemaVersion,
  migrations,
  defaultValue,
}: {
  key: string;
  schemaVersionKey: string;
  currentSchemaVersion: string;
  migrations: Migration<any, any>[];
  defaultValue: T;
}): Promise<T> {
  const data = await AsyncStorage.getItem(key);
  const storedSchemaVersion = await AsyncStorage.getItem(schemaVersionKey);

  // if schema version is missing, won't be able to migrate/recover the stored data, so
  // return the default data
  if (!data || !storedSchemaVersion) {
    await AsyncStorage.setItem(key, JSON.stringify(defaultValue));
    await AsyncStorage.setItem(schemaVersionKey, currentSchemaVersion);

    return defaultValue;
  }

  if (storedSchemaVersion !== currentSchemaVersion) {
    const newData = migrate(JSON.parse(data), storedSchemaVersion, migrations);

    await AsyncStorage.setItem(key, JSON.stringify(newData));
    await AsyncStorage.setItem(schemaVersionKey, currentSchemaVersion);

    return newData;
  }

  return JSON.parse(data) as T;
}
