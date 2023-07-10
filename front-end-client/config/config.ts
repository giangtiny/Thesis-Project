declare global {
  interface Window {
    env: any;
  }
}

const config = {
  API_HOST:
    process.env.NEXT_PUBLIC_API_HOST ||
    (typeof window !== 'undefined' && window.env.NEXT_PUBLIC_API_HOST),
  IMAGE_URL:
    process.env.NEXT_PUBLIC_IMAGE_URL ||
    (typeof window !== 'undefined' && window.env.NEXT_PUBLIC_IMAGE_URL)
};

export default config;
