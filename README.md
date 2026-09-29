# Count Her In Liberia

Responsive NGO website built with Vue 3, Vite, Vue Router, Tailwind CSS, and Lucide. The contact page uses an Express API and Resend for inquiry notifications and sender confirmations.

## Local development

Requirements: Node.js 20.19+ or 22.12+.

1. Install frontend dependencies: `npm install`
2. In `backend/.env`, set `RESEND_API_KEY` to your Resend key. Do not send the key in chat or commit the `.env` file; it is git-ignored.
3. In the Resend dashboard, verify the sender domain and ensure `RESEND_FROM_EMAIL` uses an address on that verified domain.
4. Start the backend in one terminal: `npm run api:dev`
5. Start the frontend in another terminal: `npm run dev`

The API listens on port 3001. Vite proxies `/api` requests to it during local development. The backend refuses to start until its required Resend settings are present. Production also requires a shared Redis service for cross-instance rate limiting.

Run checks with `npm run api:test` and `npm run build`.

## Contact API

`POST /api/contact` accepts `fullName`, `email`, optional `phone` and `organization`, `category`, `subject`, `message`, and the hidden spam-trap field. Categories are validated server-side. Successful requests are sent to `countherin2023@gmail.com` with subject `New Website Inquiry - [Category]`; the API then attempts a confirmation email to the sender.

Responses use `{ success, message }` on success and `{ success: false, error: { code, message, fields? } }` for errors. Requests are limited to five per IP per 15 minutes. The health endpoint is `GET /health`.

## Environment variables

`backend/.env` is created locally and ignored by Git. The shareable variable template is `backend/.env.example`.

- `PORT`: API port, defaults to 3001.
- `NODE_ENV`: use `production` for deployment.
- `RESEND_API_KEY`: secret Resend API key; keep server-side only.
- `RESEND_FROM_EMAIL`: sender address on a domain verified in Resend.
- `CONTACT_EMAIL`: destination inbox; set to `countherin2023@gmail.com`.
- `CLIENT_ORIGINS`: comma-separated allowed frontend origins; required in production.
- `REDIS_URL`: Redis/Valkey connection URL; required in production for shared rate limiting.
- `VITE_CONTACT_API_URL`: frontend build-time API origin for deployment. Set it to the Render service URL; leave unset locally to use Vite's proxy.

## Deployment

- Render: deploy using the root `render.yaml`. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CLIENT_ORIGINS`, and `REDIS_URL` as Render environment variables. `CONTACT_EMAIL` is preconfigured in the blueprint; provision managed Redis before deploying.
- Vercel and Netlify: deploy the Vite frontend from the repository root. Set `VITE_CONTACT_API_URL` to the deployed backend origin and set that exact frontend origin in the backend's `CLIENT_ORIGINS`.
- Keep the Resend API key out of all frontend variables and client bundles. Verify the sender domain with Resend before sending production email.

## Routes

`/`, `/about`, `/programs`, `/programs/:slug`, `/impact`, `/team`, `/gallery`, `/news`, `/events`, `/contact`, `/volunteer`, and `/donate`.

## Other launch checks

- Confirm the supplied photos are approved for publication.
- Confirm team bios, partner names, impact figures, contact details, and sample stories with CHI.
- The donation page is still a UI only and needs a verified payment provider before it can accept gifts.
- Replace generic social links with CHI's official accounts.
