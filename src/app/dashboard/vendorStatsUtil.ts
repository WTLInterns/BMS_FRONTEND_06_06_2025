import DUMMY_VENDORS from '../onboard-vendor/page';

export function getVendorStats() {
  const total = DUMMY_VENDORS.length;
  const active = DUMMY_VENDORS.filter(v => v.status === 'Active').length;
  const inactive = DUMMY_VENDORS.filter(v => v.status === 'Inactive').length;
  return { total, active, inactive };
}
