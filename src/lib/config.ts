/**
 * Application Configuration
 *
 * This configuration makes it straightforward to switch from static mock data
 * to a real Golang Backend API in the future without changing any UI code.
 *
 * To connect to your Golang Backend later:
 * Set NEXT_PUBLIC_USE_MOCK=false
 * Set NEXT_PUBLIC_API_URL=http://your-golang-server:8080/api/v1
 */

export const config = {
  isDev: process.env.NODE_ENV !== 'production',
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== 'false', // Default is true for static mode
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  apiTimeout: 10000,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://letuannhat.dev',
};
