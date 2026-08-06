import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cash Canopy - Expense Tracker',
    short_name: 'Cash Canopy',
    description: 'Track your income, expenses, budgets, and savings goals seamlessly.',
    start_url: '/home?tab=dashboard',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}