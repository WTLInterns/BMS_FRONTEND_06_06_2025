import { DUMMY_VENDORS } from '../onboard-vendor/page';

export function getVendorsFromStorage() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('vendors');
    if (stored) return JSON.parse(stored);
  }
  return DUMMY_VENDORS;
}

export function setVendorsToStorage(vendors: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }
}
