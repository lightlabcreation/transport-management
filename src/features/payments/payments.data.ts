import type { SubscriptionPlan, Invoice, PaymentCard } from './payments.types';

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Standard Monthly',
    price: 19.99,
    interval: 'mo',
    features: [
      'Simulated Real-time GPS Tracking',
      'Up to 3 Active Vehicle Groups',
      'Overspeed Visual Alerts & Voice Warnings',
      'Basic Daily/Weekly CSV Performance Audits',
      'Email Customer Support',
    ],
  },
  {
    id: 'yearly',
    name: 'Enterprise Yearly',
    price: 179.99,
    interval: 'yr',
    features: [
      'All Standard Monthly Features Included',
      'Unlimited Vehicle Groups Management',
      'Advanced Monthly PDF Compliance Reports',
      'Priority Support (24/7 Response Mock)',
      '12 Months Historical Telemetry Retention',
      'Save 25% compared to Monthly Plan',
    ],
    isPopular: true,
  },
  {
    id: 'lifetime',
    name: 'Operator Lifetime',
    price: 499.99,
    interval: 'one-time',
    features: [
      'All Enterprise Features Included',
      'One-time Payment (No recurring charges)',
      'Unlimited Operators and Sub-Admin Delegations',
      'Early access to native mobile app preview',
      'Dedicated Customer Success Assistant (Mock)',
    ],
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    date: '2026-07-15',
    amount: 179.99,
    status: 'Paid',
    planName: 'Enterprise Yearly',
    billingMethod: 'Visa ending in 4242',
  },
  {
    id: 'INV-2026-002',
    date: '2026-06-15',
    amount: 19.99,
    status: 'Paid',
    planName: 'Standard Monthly',
    billingMethod: 'Mastercard ending in 5555',
  },
  {
    id: 'INV-2026-003',
    date: '2026-05-15',
    amount: 19.99,
    status: 'Failed',
    planName: 'Standard Monthly',
    billingMethod: 'Amex ending in 8871',
  },
];

export const MOCK_CARDS: PaymentCard[] = [
  {
    id: 'card-1',
    brand: 'visa',
    last4: '4242',
    expDate: '12/28',
    isDefault: true,
  },
  {
    id: 'card-2',
    brand: 'mastercard',
    last4: '5555',
    expDate: '08/29',
    isDefault: false,
  },
];
