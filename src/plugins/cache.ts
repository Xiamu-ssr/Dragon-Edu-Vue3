const sessionCache = {
  set(key: string, value: any) {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  },
  get(key: string) {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON(key: string) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key);
  }
};
const localCache = {
  set(key: string, value: any) {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value);
    }
  },
  setTTL(key: string, value: number) {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      const now = new Date();
      // ttl 单位是毫秒，`now.getTime()` 返回当前时间的毫秒数
      const expiry = now.getTime() + value;
      localStorage.setItem(key, expiry.toString());
    }
  },
  get(key: string) {
    if (!localStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return localStorage.getItem(key);
  },
  getTTL(key: string):boolean {
    if (!localStorage) {
      return false;
    }
    if (key == null) {
      return false;
    }
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return false;
    }
    const expiry = parseInt(itemStr);
    const now = new Date();
    // 比较当前时间和存储的过期时间
    if (now.getTime() > expiry) {
      // 如果已过期，删除存储项
      localStorage.removeItem(key);
      return false;
    }
    console.log(`[${key}]Remaining time: ${(expiry - now.getTime()) / 1000} seconds`);
    return true;
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON(key: string) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,
  /**
   * 本地缓存
   */
  local: localCache
};
