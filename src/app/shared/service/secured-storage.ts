import { Injectable } from '@angular/core';
import {SessionStorageService} from "ngx-webstorage";
import * as CryptoJS from 'crypto-js';
import {environments} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SecuredStorage {
    constructor(private storage: SessionStorageService) {}

    store(key: string, value: any): void {
        // Encrypt the JSON string and store the ciphertext as a base64 string
        const encoded = CryptoJS.AES.encrypt(JSON.stringify(value), environments.secretKey).toString();
        this.storage.store(key, encoded);
    }

    retrieve<T>(key: string): T | null {
        const encoded = this.storage.retrieve(key) as string | null;
        if (!encoded) return null;
        try {
            // Decrypt and convert bytes to UTF-8 string, then parse JSON
            const bytes = CryptoJS.AES.decrypt(encoded, environments.secretKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) return null;
            return JSON.parse(decrypted) as T;
        } catch {
            return null;
        }
    }

    clear(key: string): void {
        this.storage.clear(key);
    }

    logout() {
        this.storage.clear();
    }
}
