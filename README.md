# Finance Dashboard (React + Vite + Tailwind)

A clean, responsive finance dashboard UI built with React (Vite) and Tailwind CSS.

## Features

### Dashboard overview
- Summary cards: **Total Balance**, **Income**, **Expenses**
- **Line chart**: balance trend over time (cumulative monthly net)
- **Pie chart**: spending by category (top categories + Other)

### Transactions
- Table columns: **date**, **amount**, **category**, **type** (`income` / `expense`)
- Search (by date/category/type)
- Filter by type (All / Income / Expense)
- Sorting (by date or amount, asc/desc)
- Empty state when no transactions match
- Admin-only: add a transaction via modal form

### Insights
- Highest spending category
- Monthly comparison: latest month expenses vs previous month expenses
- Additional insight: latest month **savings rate** and net cash flow

### Optional enhancements (included)
- Dark mode toggle
- Persist role/theme/transactions in `localStorage`
- Export transactions as **CSV** (exports the currently displayed/sorted list)

## Project structure
- `src/App.jsx` - app state + page layout
- `src/components/` - `Navbar`, `SummaryCards`, `Charts`, `Transactions`, `Insights`
- `src/data/` - mock dataset
- `src/utils/` - formatting, calculations, CSV export, localStorage helpers

## Setup & Run

1. Open the project folder: `c:\Users\manur\OneDrive\Desktop\Zorvyn Assignment`
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   ```
4. Open the displayed local URL (usually `http://localhost:5173/`).

## Notes
- Transactions are stored in `localStorage` under `finance.transactions`.
- Change role using the navbar:
  - **Viewer**: can only view data
  - **Admin**: can add transactions

