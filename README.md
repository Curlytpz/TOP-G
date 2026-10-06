# TOP-G Auto Seat

## Temporary client preview

This project can be shared temporarily through a Cloudflare quick tunnel. The Vite server remains on this computer and no permanent deployment or Cloudflare tunnel configuration is created.

1. In the project folder, start the local Vite server:

   ```bash
   npm run dev
   ```

2. In a second terminal, start the temporary tunnel:

   ```bash
   npm run tunnel
   ```

3. Copy the `https://...trycloudflare.com` URL that Cloudflare prints in the terminal and send that URL to the client. Keep both terminals open during review.

4. When the review is complete, press `Ctrl+C` in the tunnel terminal first, then press `Ctrl+C` in the Vite terminal. The preview URL stops working immediately.

The dev server binds only to `127.0.0.1`; only the tunnel can reach it from another network. `/admin` is intentionally unavailable through the preview URL and remains local-only. Do not put secrets or admin credentials in `VITE_` variables, since Vite exposes those values to browser code.