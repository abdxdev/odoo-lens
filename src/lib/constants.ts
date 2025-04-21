export const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", // Adjusted Accept slightly based on faculty route
  "Accept-Language": "en-US,en;q=0.9",
  "Connection": "keep-alive",
  "Referer": `${process.env.NEXT_PUBLIC_ODOO_URL}/`,
  "Upgrade-Insecure-Requests": "1",
  "Content-Type": "application/json",
};
