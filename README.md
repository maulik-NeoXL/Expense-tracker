# Personal Expense Tracker

A comprehensive personal finance management application built with Next.js, ShadCN UI, and Prisma. Track your expenses, income, budgets, and get AI-powered financial insights.

## Features

- 📊 **Dashboard**: Overview of your financial health with charts and summaries
- 💰 **Expense Tracking**: Add, edit, and categorize your expenses
- 💵 **Income Management**: Track income sources and earnings
- 🏷️ **Categories & Sources**: Organize your financial data
- 💳 **Budget Planning**: Set and monitor budget goals
- 🤖 **AI Assistant**: Get insights and answer financial questions
- 👤 **Profile Management**: Personalize your experience
- 🌙 **Dark Mode**: Beautiful dark and light themes
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Collapsible Sidebar**: Space-efficient navigation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/personal-expense-tracker)

### Manual Deployment

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**:

   - `DATABASE_URL`: Use Vercel's built-in SQLite or external database
   - For SQLite: `file:./dev.db` (for development)
   - For production: Use PostgreSQL or MySQL

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

### Database Options

- **SQLite** (for development/testing)
- **PostgreSQL** (recommended for production)
- **MySQL** (alternative for production)

### Environment Variables

Create a `.env.local` file for local development:

```env
DATABASE_URL="file:./dev.db"
```

For production, set these in Vercel dashboard:

```env
DATABASE_URL="your-production-database-url"
```
