# Prioty's Money Diary 💗

A cute personal money diary for **Sayeda Halida Eadib Prioty** — track income and expenses, wrapped in pink 🌸

## Features

- 🌷 Beautiful pink glassmorphism design
- 💗 Floating hearts ambient animation
- 📖 Income & expense tracking with categories
- 📅 Monthly navigation
- 💰 Summary cards (Income / Expenses / Balance) in ৳ (Taka)
- 🔒 Data stored in Supabase (with localStorage fallback)
- 📱 Fully responsive

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Render

## Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL Editor and run the contents of `supabase_setup.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Local Development

```bash
npm install
npm start
```

Set environment variables:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render will auto-detect settings from `render.yaml`
5. Add environment variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
6. Deploy!

## License

Made with 💞 for Prioty
