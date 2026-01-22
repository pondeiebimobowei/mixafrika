export const REPAYMENT_DURATION_OPTIONS = [
  { label: 'Select duration', value: '' },
  { label: '30 days', value: '30' },
  { label: '60 days', value: '60' },
  { label: '90 days', value: '90' },
];

export const PAYMENT_PLAN_OPTIONS = [
  { label: 'Daily', value: 'daily' },
];

export const BUSINESS_LOCATION_OPTIONS = [
  { label: 'Select business location', value: '' },
  { label: 'Lagos', value: 'lagos' },
  { label: 'Abuja', value: 'abuja' },
  { label: 'Port Harcourt', value: 'port harcourt' },
  { label: 'Kano', value: 'kano' },
  { label: 'Ibadan', value: 'ibadan' },
];

export const STATE = [
  { label: 'Select state', value: '' },
  { label: 'Lagos', value: 'lagos' },
  { label: 'Abuja', value: 'abuja' },
  { label: 'Port Harcourt', value: 'port harcourt' },
  { label: 'Kano', value: 'kano' },
  { label: 'Ibadan', value: 'ibadan' },
];

export const COUNTRY = [
  { label: 'Select country', value: '' },
  { label: 'Nigeria', value: 'nigeria' },
];

export const BUSINESS_TYPE_OPTIONS = [
  { label: 'Select business type', value: '' },
  { label: 'Auto Mobile', value: 'auto_mobile' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Retail', value: 'retail' },
  { label: 'Technology', value: 'technology' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Manufacturing', value: 'manufacturing' },
];

export const ID_TYPES = [
    { label: "National ID / NIN", value: "national_id" },
    { label: "International Passport", value: "intl_passport" },
    { label: "Voters Card", value: "voters_card" },
    { label: "Driver's License", value: "drivers_license" },
] as const;
