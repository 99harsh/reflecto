// encryption.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly SALT_KEY = 'user_salt'; // storage key for salt
  userPassphrase = new BehaviorSubject<string>("");
  userPassphrase$ = this.userPassphrase.asObservable();

  setUserPassphrase(passphrase: string) {
    this.userPassphrase.next(passphrase);
  }

  /**
   * Get existing salt or create a new one
   */
  getOrCreateSalt(): Uint8Array {
    let saltBase64 = localStorage.getItem(this.SALT_KEY);
    if (saltBase64) {
      return this.base64ToArrayBuffer(saltBase64);
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(this.SALT_KEY, this.arrayBufferToBase64(salt));
    return salt;
  }

  /**
   * Derive AES-GCM key from passphrase + salt
   */
  async deriveKey(passphrase: string, salt: string | Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const saltBuffer = typeof salt === 'string' ? this.base64ToArrayBuffer(salt) : salt;

    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 150000,
        hash: 'SHA-256',
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext with AES-GCM key
   */
  async encrypt(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encoded = enc.encode(plaintext);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      ciphertext: this.arrayBufferToBase64(ciphertextBuffer),
      iv: this.arrayBufferToBase64(iv)
    };
  }

  /**
   * Decrypt ciphertext with AES-GCM key
   */
  async decrypt(ciphertextBase64: string, ivBase64: string, key: CryptoKey): Promise<string> {
    try {
      const ciphertext = this.base64ToArrayBuffer(ciphertextBase64);
      const iv = this.base64ToArrayBuffer(ivBase64);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    } catch (error) {
      throw new Error('Decryption failed. Wrong passphrase or corrupted data.');
    }
  }

  /**
   * Convert ArrayBuffer/Uint8Array to Base64 string
   */
  arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    let binary = '';
    const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  /**
   * Convert Base64 string to Uint8Array
   */
  base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
