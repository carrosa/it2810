/*
 * Klasse for å mocke AsyncStorage under testing
 * Alle funksjonene returnerer et promise sånn at vi kan teste async
 */
export default class MockAsyncStorage {
  constructor(cache = {}) {
    this.storageCache = cache;
  }

  setItem = jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      return (typeof key !== 'string' || typeof value !== 'string')
          ? reject(new Error('key and value must be string'))
          : resolve(this.storageCache[key] = value);
    });
  });

  getItem = jest.fn((key) => {
    return new Promise((resolve) => {
      return this.storageCache.hasOwnProperty(key)
          ? resolve(this.storageCache[key])
          : resolve(null);
    });
  });
}