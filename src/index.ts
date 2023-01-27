import { StorageClass, Key, Expire, Data, Result } from './type';
import { Dictionaries } from './enum';

export class Storage implements StorageClass {
  set<T>(key: Key, value: T, expire: Expire = Dictionaries.permanet) {
    const data = {
      value,
      [Dictionaries.expire]: expire,
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: Key): Result<T | null> {
    const value = localStorage.getItem(key);
    if (value) {
      const data: Data<T> = JSON.parse(value);
      const now = new Date().getTime();
      if (typeof data[Dictionaries.expire] === 'number' && data[Dictionaries.expire] < now) {
        this.remove(key);
        return {
          message: `your ${key} has expired`,
          value: null,
        };
      } else {
        return {
          message: 'success',
          value: data.value,
        };
      }
    } else {
      return {
        message: 'invalid value',
        value: null,
      };
    }
  }

  remove(key: Key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
