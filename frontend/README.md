# Lipi — frontend for IndicXlit

A Next.js site for the IndicXlit transliteration model in `../IndicXlit-master`. It has:

- **Playground**: type Roman text and get native script back, or the reverse, in 21 languages. Click any output word to pick from the model's top-5 suggestions, then **Save** it.
- **Saved**: a public feed of saved translations, stored in Supabase.
- **Language index**: the 21 languages and their scripts. Clicking one loads it into the playground.
- **How it works** and **Accuracy**: the corpus, the model, and the per-language benchmark results from the IndicXlit README.
- **API**: the backend's endpoints.

## Run locally

1. Start the backend (Python, with the packages in `IndicXlit-master/app/dependencies.txt`):

   ```bash
   cd IndicXlit-master/app
   python start_server.py        # serves on http://localhost:8888
   ```

   The first run downloads the model weights.

2. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev                   # http://localhost:3000
   ```

The browser calls `/xlit/*`, and Next.js forwards those requests to the backend (see `next.config.ts`), so no CORS setup is needed.

## Environment variables

Copy `.env.example` to `.env.local`. It already contains the values for this project's Supabase database.

| Variable | What it is |
|---|---|
| `XLIT_API_URL` | Where the Flask backend runs. Requests to `/xlit/*` are forwarded here. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key. Safe to expose: the database only allows reading and adding rows (see below). |

If the Supabase variables are missing, the Save button and the Saved section are hidden.

## Saved translations (Supabase)

The table and its security rules are in `../supabase/migrations/`. Anyone can read the feed and add to it, but no one can edit or delete rows through the API. Row Level Security and column-level grants enforce this, and check constraints cap the input size. To clear rows, use the Supabase dashboard's Table Editor.

## Deploy on Vercel

1. Import the GitHub repo in Vercel and set **Root Directory** to `frontend`.
2. Under **Settings → Environment Variables**, add the three variables from `.env.example`. Set `XLIT_API_URL` to your deployed backend, for example a Hugging Face Space URL.
3. Deploy. The site, saving, and the Saved feed work right away. The playground needs the backend to be reachable.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Motion · lucide-react.
