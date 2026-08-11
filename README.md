# Selling Film - Programming Course Platform

## 🚀 Quick Start

1. Clone repository:
```bash
git clone https://github.com/msyafa-alg/sellingfilm.git
cd sellingfilm
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local dengan credentials kamu
```

4. Run development server:
```bash
npm run dev
```

## 📋 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

SAYA_BAYAR_API_KEY=sk_live_xxxx
SAYA_BAYAR_WEBHOOK_SECRET=whsec_xxxx

NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 🔧 Database Setup

Run SQL di Supabase SQL Editor:

1. `sql/schema.sql` - Create tables & RLS
2. `sql/seed.sql` - Create initial tiers

## 🚢 Deploy to Vercel

1. Push code ke GitHub
2. Import project ke [Vercel](https://vercel.com)
3. Add environment variables di Vercel Dashboard
4. Deploy! 🎉

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Saya Bayar API](https://sayabayar.com/docs)
