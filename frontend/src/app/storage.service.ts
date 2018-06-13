import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_PREFIX } from '../shared/utilities/defines';

@Injectable()
export class StorageService {

  /**
  * add/set item to browser localstorage
  * @param key the identifier for the localstorage item
   * @param value the value of localstorage item
  */
  public setStorage(key: string, value: any) {
    const newKey = LOCAL_STORAGE_PREFIX + '.' + key;
    // Add to localstorage
    if (typeof value === 'object') {
      localStorage.setItem(newKey, JSON.stringify(value));
    } else {
      localStorage.setItem(newKey, String(value));
    }

  }

  /**
   * read certain item from the session storage or from the cachedSession and
   * parse the item to json if the item is a stringified object.
   * @param  {key} The key of the property to be detected
   * @returns {Object} the returned object holds the value for the detected property
  */
  public getStorage(key: string) {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX + '.' + key));
    } catch (error) {
      return localStorage.getItem(LOCAL_STORAGE_PREFIX + '.' + key);
    }
  }

  /**
   * remove certain item from the localStorage and from the cachedSession
   * @param  {key} The key of the property to be removed
  */
  public remove(key: string) {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + '.' + key);
  }

  /**
  * clear all the localStorage items and the cachedSession items
  */
  public empty() {
    localStorage.clear();
  }


  /**
   * list all items in the localStorage
   * @returns {Object} the returned object holds the cached Session object
  */
  public listAllItems() {
    const items = [];
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        items.push(items);
      }
    }
    return items;
  }




}
