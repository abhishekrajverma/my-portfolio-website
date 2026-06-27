import type { BlogPost } from "@/types";

/**
 * SEO-focused blog articles — simple language, practical examples.
 * Merged into the main blog feed via data/blog.ts
 */
export const seoBlogArticles: BlogPost[] = [
  {
    slug: "what-is-data-analyst-career-guide-india",
    title: "What Is a Data Analyst? A Simple Career Guide for Beginners in India (2026)",
    excerpt:
      "New to data analytics? Learn what a Data Analyst actually does, skills you need, salary range in India, and how to start — explained in plain English.",
    category: "Interview",
    date: "2026-06-28",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    content: `## What does a Data Analyst do?

Think of a Data Analyst as a **translator between raw business data and clear decisions**.

Companies collect huge amounts of information every day — sales numbers, inventory levels, customer feedback, website clicks, and more. Most of that data sits in Excel files, SQL databases, or ERP systems. A Data Analyst's job is to:

1. **Collect** the right data
2. **Clean** messy or incomplete records
3. **Analyze** patterns and trends
4. **Present** insights in dashboards and reports
5. **Help teams act** — not just show numbers, but answer business questions

### A simple real-world example

Imagine a retail company asks: *"Which product category is losing sales this month?"*

A Data Analyst would:
- Pull sales data from SQL Server or Excel
- Compare this month vs last month
- Break results by category, city, and store
- Build a Power BI chart showing the drop
- Explain **why** it might be happening (seasonality, stock-out, pricing)

That is the core of the role — **turn questions into answers using data**.

## Skills you need (in simple terms)

You do **not** need a PhD in statistics to start. Most entry-level roles in India focus on:

| Skill | Why it matters |
|-------|----------------|
| **SQL** | To pull data from databases |
| **Excel** | Still used daily in MIS teams |
| **Power BI** | To build interactive dashboards |
| **Basic statistics** | Averages, growth %, trends |
| **Communication** | To explain insights to non-technical managers |

Python is a **plus**, not always required for MIS Analyst or junior Data Analyst roles.

## Data Analyst vs MIS Executive vs Data Engineer

These titles confuse many beginners:

- **MIS Executive** — Focuses on regular reports (daily/weekly/monthly), often in Excel and SQL. Heavy on operations and reporting deadlines.
- **Data Analyst** — More analysis, dashboards, ad-hoc questions, and storytelling with data.
- **Data Engineer** — Builds data pipelines and infrastructure. More coding, less dashboard design.

Many professionals in India start as MIS Executive and grow into Data Analyst or Data Engineer.

## Salary expectations in India (2026, approximate)

Salaries vary by city, company, and experience:

- **Fresher / 0–1 year:** ₹3.5 – ₹6 LPA
- **1–3 years:** ₹6 – ₹10 LPA
- **3+ years (Gurgaon, Noida, Bangalore):** ₹10 – ₹18+ LPA

Power BI + SQL + domain knowledge (finance, sales, operations) significantly improves your package.

## How to start (step-by-step)

1. **Learn SQL basics** — SELECT, WHERE, JOIN, GROUP BY (2–3 weeks)
2. **Master Excel** — Pivot tables, Power Query, basic formulas (2 weeks)
3. **Build one Power BI dashboard** — Use free public datasets (1–2 weeks)
4. **Create a portfolio** — 2–3 project case studies on GitHub or a personal website
5. **Apply for MIS Analyst / Data Analyst roles** — Gurgaon, Noida, Bangalore, Pune, Hyderabad

## Common mistakes beginners make

- Learning 10 tools at once instead of going deep on SQL + one BI tool
- Only watching tutorials without building projects
- Ignoring business context — always ask *"What decision will this metric support?"*

## Final takeaway

A Data Analyst helps businesses make **smarter, faster decisions** using data. If you enjoy solving puzzles, working with numbers, and explaining insights clearly, this career is a strong fit — especially in India's growing analytics market.

**Next step:** Pick one dataset (sales, HR, or inventory) and build a simple dashboard this week. That single project teaches more than 20 hours of passive video watching.`,
  },
  {
    slug: "build-power-bi-dashboard-from-sql-server",
    title: "How to Build a Power BI Dashboard from SQL Server (Step-by-Step for Beginners)",
    excerpt:
      "A beginner-friendly walkthrough: connect SQL Server to Power BI, model your data, create KPIs, and publish a dashboard your manager will actually use.",
    category: "Power BI",
    date: "2026-06-27",
    readTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    content: `## Why connect Power BI to SQL Server?

Most companies store business data in **SQL Server** — sales, inventory, finance, HR. Power BI turns that data into **live, visual dashboards** instead of static Excel exports.

When done right, you get:
- **Automatic refresh** — no more manual copy-paste
- **One source of truth** — everyone sees the same numbers
- **Interactive filters** — slice by date, region, product instantly

## What you need before starting

- SQL Server database access (or SQL Server Express for practice)
- Power BI Desktop (free download from Microsoft)
- A clear business question — e.g. *"What are our top 10 products by revenue this quarter?"*

## Step 1: Prepare your SQL data

Good dashboards start with **clean SQL views**, not messy raw tables.

Example: a simple sales summary view

\`\`\`sql
CREATE VIEW vw_SalesSummary AS
SELECT
  OrderDate,
  ProductCategory,
  Region,
  SUM(SalesAmount) AS TotalSales,
  COUNT(DISTINCT OrderID) AS OrderCount
FROM SalesOrders
GROUP BY OrderDate, ProductCategory, Region;
\`\`\`

**Tip:** Create views in SQL so Power BI pulls pre-aggregated data. This keeps dashboards fast.

## Step 2: Connect Power BI to SQL Server

1. Open **Power BI Desktop**
2. Click **Get Data** → **SQL Server**
3. Enter server name and database name
4. Choose **Import** (for smaller datasets) or **DirectQuery** (for very large live data)
5. Select your views/tables — start with \`vw_SalesSummary\`

## Step 3: Build a simple data model

In **Model view**:
- Link tables using common keys (e.g. \`ProductID\`, \`Date\`)
- Use a **Date table** — one row per day — for time-based analysis
- Mark the Date table as a **Date table** in Power BI (Modeling tab)

Avoid many-to-many relationships unless you understand bridge tables.

## Step 4: Create KPI measures with DAX

DAX looks scary at first, but you only need a few measures to start:

\`\`\`dax
Total Sales = SUM(Sales[SalesAmount])

Sales Last Month =
CALCULATE(
  [Total Sales],
  DATEADD('Date'[Date], -1, MONTH)
)

Growth % =
DIVIDE([Total Sales] - [Sales Last Month], [Sales Last Month])
\`\`\`

**Simple rule:** Use measures for anything you calculate (totals, averages, growth). Use columns for labels (product name, region).

## Step 5: Design the dashboard page

Follow this layout:

1. **Top row** — 3–4 KPI cards (Total Sales, Orders, Growth %)
2. **Middle** — Trend line chart (sales over time)
3. **Bottom** — Bar chart (sales by category) + slicers (Date, Region)

Design rules:
- Maximum **5–7 metrics** per page
- Put the most important number **top-left**
- Use **one color** for positive trends, **another** for alerts

## Step 6: Add slicers and filters

Slicers let users explore data without asking you for new reports.

Add slicers for:
- Date range
- Region / branch
- Product category

Set **cross-filtering** so clicking a bar in one chart filters others.

## Step 7: Publish and schedule refresh

1. Click **Publish** to Power BI Service (needs a work or school account, or Pro license)
2. In Power BI Service → **Settings** → **Scheduled refresh**
3. Set daily refresh after your SQL data updates (e.g. 7 AM)

Now your dashboard updates automatically every morning.

## Common beginner mistakes

| Mistake | Fix |
|---------|-----|
| Importing 50 tables at once | Start with 2–3 related tables |
| No date table | Create a proper calendar table |
| Too many visuals on one page | Split into multiple report pages |
| Hard-coded Excel exports | Connect directly to SQL |

## Final takeaway

Building a Power BI dashboard from SQL Server is a **high-value skill** for MIS and Data Analyst roles in India. Start small: one view, three KPIs, one trend chart. Expand only after stakeholders confirm they use it daily.`,
  },
  {
    slug: "sql-server-queries-mis-analyst-daily",
    title: "10 SQL Server Queries Every MIS Analyst Uses Daily (With Simple Examples)",
    excerpt:
      "Master the SQL patterns MIS teams use every day — filtering, joins, aggregations, duplicates, and month-over-month comparisons explained simply.",
    category: "SQL",
    date: "2026-06-26",
    readTime: "11 min read",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    content: `## Why SQL matters for MIS reporting

If you work in MIS (Management Information Systems), you probably spend hours in Excel. But behind most automated reports is **SQL** — the language that pulls data from databases.

Learning these 10 query patterns will save you time and make you stand out in Data Analyst interviews.

## 1. Basic SELECT with filters

**Use when:** You need today's or this month's data.

\`\`\`sql
SELECT OrderID, CustomerName, OrderDate, SalesAmount
FROM SalesOrders
WHERE OrderDate >= '2026-06-01'
  AND Region = 'North';
\`\`\`

**Think of it as:** "Show me these columns, only for rows that match my conditions."

## 2. GROUP BY for summaries

**Use when:** You need totals by category, region, or month.

\`\`\`sql
SELECT
  ProductCategory,
  SUM(SalesAmount) AS TotalSales,
  COUNT(*) AS OrderCount
FROM SalesOrders
WHERE YEAR(OrderDate) = 2026
GROUP BY ProductCategory
ORDER BY TotalSales DESC;
\`\`\`

This is the foundation of almost every MIS report.

## 3. INNER JOIN to combine tables

**Use when:** Data is split across tables (orders + customers).

\`\`\`sql
SELECT
  c.CustomerName,
  o.OrderDate,
  o.SalesAmount
FROM SalesOrders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID;
\`\`\`

**Simple analogy:** JOIN is like matching rows in two Excel sheets using a common ID column.

## 4. LEFT JOIN to find missing data

**Use when:** You want all customers, even those with no orders.

\`\`\`sql
SELECT
  c.CustomerName,
  o.OrderID
FROM Customers c
LEFT JOIN SalesOrders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL;
\`\`\`

This finds customers who **never placed an order** — useful for sales follow-up reports.

## 5. Find duplicate records

**Use when:** Data quality checks before reporting.

\`\`\`sql
SELECT InvoiceNo, COUNT(*) AS DuplicateCount
FROM Invoices
GROUP BY InvoiceNo
HAVING COUNT(*) > 1;
\`\`\`

Duplicates cause wrong totals in dashboards. Always check before publishing KPIs.

## 6. Month-over-month comparison

**Use when:** Management asks "How did we do vs last month?"

\`\`\`sql
SELECT
  FORMAT(OrderDate, 'yyyy-MM') AS SalesMonth,
  SUM(SalesAmount) AS MonthlySales
FROM SalesOrders
GROUP BY FORMAT(OrderDate, 'yyyy-MM')
ORDER BY SalesMonth;
\`\`\`

Export this to Excel or Power BI for a trend chart.

## 7. Top N products or customers

**Use when:** "Show top 10 products by revenue."

\`\`\`sql
SELECT TOP 10
  ProductName,
  SUM(SalesAmount) AS TotalRevenue
FROM SalesOrders
GROUP BY ProductName
ORDER BY TotalRevenue DESC;
\`\`\`

## 8. CASE WHEN for categorization

**Use when:** You need custom buckets (High / Medium / Low sales).

\`\`\`sql
SELECT
  ProductName,
  SalesAmount,
  CASE
    WHEN SalesAmount >= 100000 THEN 'High'
    WHEN SalesAmount >= 50000 THEN 'Medium'
    ELSE 'Low'
  END AS SalesBand
FROM SalesOrders;
\`\`\`

## 9. NULL handling

**Use when:** Missing values break your averages.

\`\`\`sql
SELECT
  AVG(ISNULL(SalesAmount, 0)) AS AvgSales
FROM SalesOrders;
\`\`\`

\`ISNULL\` replaces blank values with zero (or another default).

## 10. CREATE VIEW for reusable reports

**Use when:** You run the same query every day.

\`\`\`sql
CREATE VIEW vw_DailyMIS AS
SELECT
  CAST(OrderDate AS DATE) AS ReportDate,
  Region,
  SUM(SalesAmount) AS TotalSales
FROM SalesOrders
GROUP BY CAST(OrderDate AS DATE), Region;
\`\`\`

Now Power BI or Excel can connect to \`vw_DailyMIS\` instead of rewriting SQL daily.

## Practice plan (1 week)

| Day | Focus |
|-----|-------|
| Mon–Tue | SELECT, WHERE, GROUP BY |
| Wed | JOINs |
| Thu | TOP N, CASE, NULL |
| Fri | Build one VIEW for a mock MIS report |

## Final takeaway

You do not need to memorize every SQL function. Master these **10 patterns** and you can handle 80% of MIS reporting work. Practice on free datasets like AdventureWorks or your company's test database.`,
  },
  {
    slug: "excel-vba-vs-power-query-automation",
    title: "Excel VBA vs Power Query: Which Should You Use to Automate Reports?",
    excerpt:
      "Confused between VBA macros and Power Query? Learn the difference, when to use each, and how to cut manual reporting time — explained without jargon.",
    category: "Excel",
    date: "2026-06-25",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    content: `## The problem: manual Excel reports

Many MIS teams spend **2–4 hours daily** copying data, cleaning columns, and emailing the same report. Automation fixes this — but should you use **VBA** or **Power Query**?

## What is Excel VBA?

**VBA** (Visual Basic for Applications) is a programming language inside Excel. You write macros to:

- Click buttons automatically
- Copy data between sheets
- Send emails with attachments
- Format reports with one click

**Best for:** Custom workflows, button-driven reports, tasks Power Query cannot do (like sending emails).

**Example use case:** A macro that exports 5 sheets to PDF and emails them to managers at 8 AM.

## What is Power Query?

**Power Query** is Excel's built-in **ETL tool** (Extract, Transform, Load). It lets you:

- Connect to SQL Server, folders, CSV files, web APIs
- Clean data (remove duplicates, split columns, unpivot)
- Refresh with one click — no coding required

**Best for:** Pulling and transforming data from databases or multiple files.

**Example use case:** Connect to SQL Server, filter this month's sales, load into a pivot table — refresh daily in 10 seconds.

## Simple comparison

| Feature | Power Query | VBA |
|---------|-------------|-----|
| Learning curve | Easier | Harder |
| Connect to SQL | Yes | Possible but complex |
| Clean/transform data | Excellent | Manual coding |
| Send emails | No | Yes |
| Refresh data | One click | Needs macro run |
| Modern Excel standard | Yes | Legacy but still used |

## When to use Power Query (start here)

Choose Power Query if you need to:
- Pull data from **SQL Server** or multiple Excel files
- **Clean** messy data (dates, text, duplicates)
- Build reports that **refresh** when source data changes
- Avoid writing code

**Real example:** A weekly sales report from 3 branch Excel files merged into one dashboard sheet.

## When to use VBA

Choose VBA if you need to:
- **Automate clicks** and formatting steps
- **Email** reports automatically
- Control **workbook logic** that Power Query cannot handle
- Integrate with other Office apps (Outlook, Word)

**Real example:** After Power Query loads data, a VBA macro formats headers, hides columns, and saves a PDF copy.

## The best approach: use both together

In modern MIS teams, the winning combo is:

1. **Power Query** — pulls and cleans data
2. **Pivot tables / charts** — summarize for managers
3. **VBA (optional)** — handles export, email, and final formatting

This is how many teams reduce manual effort by **50–60%** without rebuilding everything in Power BI.

## Step-by-step: automate a weekly report with Power Query

1. **Data** tab → **Get Data** → **From Database** → SQL Server
2. Enter query or select tables
3. In Power Query Editor: remove nulls, fix date columns, filter current year
4. **Close & Load** to a worksheet
5. Build pivot table linked to the query output
6. Right-click query → **Refresh** every Monday

Total setup time: 1–2 hours. Weekly time saved: 2+ hours.

## Common mistakes

- Using VBA to copy-paste when Power Query would be faster
- Not documenting macro steps (only one person knows how it works)
- Skipping error handling in VBA (report breaks when file path changes)

## Final takeaway

**Learn Power Query first.** It solves the most common MIS problem — getting clean data into Excel quickly.

Add **VBA later** for email automation and custom buttons. Together, they make you far more productive than analysts who only use manual copy-paste.`,
  },
  {
    slug: "choose-kpis-sales-inventory-finance-dashboards",
    title: "How to Choose the Right KPIs for Sales, Inventory & Finance Dashboards",
    excerpt:
      "Stop building dashboards nobody uses. Learn how to pick KPIs for sales, inventory, and finance teams — with simple definitions and examples.",
    category: "Power BI",
    date: "2026-06-24",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    content: `## Why most dashboards fail

A dashboard fails when it shows **too many numbers** and answers **no clear question**.

Before opening Power BI, ask stakeholders:
- *What decision do you make with this report?*
- *How often do you need it?* (daily, weekly, monthly)
- *What action do you take when a number goes red?*

Good KPIs are **few, clear, and tied to action**.

## What is a KPI?

**KPI** = Key Performance Indicator.

It is a number that tells you if the business is doing well or poorly.

**Bad KPI:** "Total rows in database" — nobody can act on this.

**Good KPI:** "On-time delivery rate %" — if it drops, logistics team investigates.

Every KPI needs:
1. **Clear definition** (how is it calculated?)
2. **Owner** (who is responsible?)
3. **Target** (what is "good"?)
4. **Frequency** (daily/weekly/monthly)

## Sales dashboard KPIs

| KPI | Formula (simple) | Why it matters |
|-----|------------------|----------------|
| **Total Revenue** | Sum of sales amount | Overall performance |
| **Revenue Growth %** | (This month − Last month) / Last month | Trend direction |
| **Average Order Value** | Total revenue ÷ Number of orders | Basket size health |
| **Conversion Rate** | Orders ÷ Leads × 100 | Sales funnel efficiency |
| **Top 10 Customers %** | Revenue from top 10 ÷ Total revenue | Dependency risk |

**Design tip:** Show revenue trend as a **line chart** and category breakdown as a **bar chart**. Keep one page for executives (4 KPIs max).

## Inventory dashboard KPIs

| KPI | Formula (simple) | Why it matters |
|-----|------------------|----------------|
| **Stock on Hand** | Current quantity by SKU | Availability |
| **Days of Inventory** | Stock ÷ Avg daily sales | How long stock lasts |
| **Stock-out Rate** | Items with zero stock ÷ Total SKUs | Lost sales risk |
| **Inventory Turnover** | COGS ÷ Average inventory | Efficiency |
| **Dead Stock Value** | Value of items not sold in 90+ days | Cash blocked |

**Design tip:** Use **conditional formatting** — red when stock-out rate exceeds 5%.

## Finance dashboard KPIs

| KPI | Formula (simple) | Why it matters |
|-----|------------------|----------------|
| **Gross Margin %** | (Revenue − COGS) / Revenue | Profitability |
| **Operating Expenses** | Sum of OPEX lines | Cost control |
| **Cash Balance** | Bank + liquid assets | Liquidity |
| **Accounts Receivable Days** | (AR ÷ Revenue) × 365 | Collection speed |
| **Budget vs Actual %** | Actual ÷ Budget × 100 | Planning accuracy |

**Design tip:** Finance users often want **drill-down to voucher level** — plan for detail pages behind summary KPIs.

## The 5–7 rule

Never show more than **5–7 KPIs on one screen**.

If stakeholders ask for 20 metrics, create:
- **Page 1:** Executive summary (5 KPIs)
- **Page 2:** Sales detail
- **Page 3:** Inventory detail
- **Page 4:** Finance detail

## How to document KPIs (template)

For each KPI, write a one-page definition:

\`\`\`
KPI Name: On-Time Delivery Rate
Formula: On-time shipments / Total shipments × 100
Data Source: SQL view vw_ShipmentStatus
Owner: Logistics Manager
Target: ≥ 95%
Refresh: Daily at 7 AM
\`\`\`

Store this in a shared document or Power BI tooltip. It prevents arguments about "wrong numbers."

## Workshop exercise (do this with your team)

1. List all metrics stakeholders currently receive
2. Mark each as **Must have**, **Nice to have**, or **Remove**
3. Keep only **Must have** on the main dashboard
4. Validate formulas against Excel reports for 2 weeks before go-live

## Final takeaway

Great dashboards are not about fancy charts — they are about **the right KPIs for the right audience**. Start with one department, nail 5 KPIs, get daily usage, then expand.`,
  },
  {
    slug: "python-pandas-for-data-analysts-beginners",
    title: "Python Pandas for Data Analysts: A Beginner Guide in Simple Terms",
    excerpt:
      "New to Python? Learn Pandas step by step — read CSV files, clean data, filter rows, and create charts. No advanced coding required.",
    category: "Python",
    date: "2026-06-23",
    readTime: "11 min read",
    image:
      "https://images.unsplash.com/photo-1526374965288-7f61d4dc18c5?w=800&h=500&fit=crop",
    content: `## Why Python for a Data Analyst?

SQL and Excel handle most MIS work. But Python becomes useful when you need to:

- Clean **very messy** datasets
- Automate **repetitive** analysis
- Work with **large files** Excel cannot open
- Build **machine learning** models later

**Pandas** is the most important Python library for data analysis. Think of it as **Excel for programmers** — tables, filters, formulas, but faster and repeatable.

## Setup (5 minutes)

1. Install Python from python.org
2. Open terminal and run:

\`\`\`bash
pip install pandas matplotlib openpyxl
\`\`\`

3. Create a file \`analysis.py\` and start coding

## Step 1: Read data

\`\`\`python
import pandas as pd

# From CSV
df = pd.read_csv("sales_data.csv")

# From Excel
df = pd.read_excel("mis_report.xlsx", sheet_name="Sales")

print(df.head())   # First 5 rows
print(df.info())   # Column names and data types
\`\`\`

\`df\` is a **DataFrame** — like an Excel sheet in Python.

## Step 2: Inspect data quality

\`\`\`python
print(df.isnull().sum())      # Missing values per column
print(df.duplicated().sum())  # Duplicate rows
print(df.describe())          # Min, max, average for numbers
\`\`\`

Always inspect before analyzing. Dirty data = wrong insights.

## Step 3: Filter rows (like Excel filters)

\`\`\`python
# Sales in North region above 10,000
north_high = df[(df["Region"] == "North") & (df["SalesAmount"] > 10000)]

# This month only
june_sales = df[df["OrderDate"] >= "2026-06-01"]
\`\`\`

## Step 4: Group and summarize (like pivot tables)

\`\`\`python
summary = df.groupby("ProductCategory")["SalesAmount"].agg(
    TotalSales="sum",
    AvgSales="mean",
    OrderCount="count"
).reset_index()

print(summary.sort_values("TotalSales", ascending=False))
\`\`\`

## Step 5: Handle missing values

\`\`\`python
# Fill missing region with "Unknown"
df["Region"] = df["Region"].fillna("Unknown")

# Drop rows with no sales amount
df = df.dropna(subset=["SalesAmount"])
\`\`\`

## Step 6: Create a simple chart

\`\`\`python
import matplotlib.pyplot as plt

top_products = df.groupby("ProductName")["SalesAmount"].sum().nlargest(10)

top_products.plot(kind="bar", title="Top 10 Products by Sales")
plt.ylabel("Sales Amount")
plt.tight_layout()
plt.savefig("top_products.png")
\`\`\`

Share the PNG in emails or PowerPoint — quick visual for managers.

## Step 7: Export results

\`\`\`python
summary.to_excel("monthly_summary.xlsx", index=False)
summary.to_csv("monthly_summary.csv", index=False)
\`\`\`

## Pandas vs SQL vs Excel — when to use what

| Task | Best tool |
|------|-----------|
| Daily MIS from database | SQL + Power BI |
| Quick ad-hoc analysis | Excel |
| Messy CSV from multiple sources | Pandas |
| Reproducible monthly analysis | Pandas script |
| Interactive dashboard | Power BI |

## 7-day learning plan

1. **Day 1–2:** read_csv, head, info, describe
2. **Day 3:** Filtering with conditions
3. **Day 4:** groupby and aggregations
4. **Day 5:** Missing values and duplicates
5. **Day 6:** Basic matplotlib charts
6. **Day 7:** One full project — clean a Kaggle dataset and export summary

## Final takeaway

Pandas is not magic — it is a faster, repeatable way to do what you already do in Excel. Start with one real work dataset, automate one boring weekly task, and build from there.`,
  },
  {
    slug: "genai-for-data-analysts-practical-guide",
    title: "GenAI for Data Analysts: 10 Practical Ways to Save Hours Every Week",
    excerpt:
      "How to use ChatGPT and GenAI safely for SQL, Excel, Power BI, and report writing — with prompt examples any analyst can copy and use.",
    category: "Python",
    date: "2026-06-22",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    content: `## What is GenAI for data analysts?

**GenAI** (Generative AI) tools like ChatGPT, Claude, and Copilot can help you write SQL, explain errors, draft report summaries, and learn new tools faster.

They do **not** replace your thinking. They speed up tasks you already understand.

**Important:** Never paste confidential company data, customer PII, or passwords into public AI tools. Use anonymized samples or enterprise versions with data policies.

## 1. Write SQL queries from plain English

**Prompt:**
*"Write a SQL Server query to show monthly sales by region for 2026, with total revenue and order count."*

Review the output, test on sample data, then run on production.

## 2. Explain confusing SQL or DAX code

**Prompt:**
*"Explain this DAX measure line by line like I'm a beginner: [paste formula]"*

Great when you inherit a dashboard built by someone else.

## 3. Debug error messages

**Prompt:**
*"I get this SQL error: 'Invalid column name CustomerID'. My query is: [paste query]. What is wrong?"*

Faster than searching forums for cryptic error codes.

## 4. Generate Excel formulas

**Prompt:**
*"I need an Excel formula to calculate month-over-month growth % in column D using sales in column C and previous month in column B."*

Double-check the formula on a few rows before dragging down.

## 5. Draft stakeholder email summaries

**Prompt:**
*"Write a short email to management summarizing: sales up 12% MoM, inventory stock-outs increased in Category A, suggest review with supply team. Tone: professional, under 100 words."*

You add the real numbers — AI helps with structure.

## 6. Create KPI definitions

**Prompt:**
*"Write a KPI definition document for 'Inventory Turnover Ratio' including formula, data sources, target, and owner. Audience: non-technical managers."*

## 7. Learn Power BI step by step

**Prompt:**
*"I'm a beginner. How do I create a date table in Power BI and use TOTALYTD? Give steps in simple language."*

Use as a tutor, then practice in Power BI Desktop.

## 8. Convert VBA ideas to Power Query logic

**Prompt:**
*"I currently use VBA to merge 3 Excel files from a folder. How can I do this in Power Query instead?"*

Helps modernize legacy reports.

## 9. Prepare for interviews

**Prompt:**
*"Give me 5 SQL interview questions for a junior Data Analyst role with sample answers."*

Practice speaking answers out loud, not just reading.

## 10. Document your own projects

**Prompt:**
*"Turn these bullet points into a portfolio case study: built Power BI dashboard, SQL views, reduced reporting time 60%. Audience: recruiters."*

## Prompt tips that actually work

1. **Be specific** — include tool names (SQL Server, Power BI, Excel)
2. **Give context** — "I am an MIS Executive with 1 year experience"
3. **Ask for simple language** — "Explain like I'm new to DAX"
4. **Iterate** — "Make it shorter" or "Add an example with sample data"
5. **Always verify** — AI can hallucinate wrong SQL syntax

## What GenAI cannot do for you

- Replace understanding of your business
- Guarantee correct numbers without your validation
- Access your private database directly (unless integrated securely)
- Take responsibility for report accuracy — you do

## Safe usage checklist

- [ ] Remove customer names, emails, phone numbers from prompts
- [ ] Use sample or masked data only
- [ ] Test all generated SQL on dev environment first
- [ ] Follow your company's AI usage policy

## Final takeaway

GenAI is a **productivity multiplier** for Data Analysts — not a replacement. Use it to draft, explain, and learn faster. Your value is still in **asking the right business questions** and validating results.`,
  },
  {
    slug: "data-analyst-interview-questions-india-2026",
    title: "Data Analyst Interview Questions in India (SQL, Power BI & MIS) — 2026 Edition",
    excerpt:
      "Prepare for Data Analyst and MIS interviews with real questions asked in India — SQL, Power BI, Excel, case studies, and HR rounds explained simply.",
    category: "Interview",
    date: "2026-06-21",
    readTime: "14 min read",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
    content: `## How Data Analyst interviews work in India

Most interviews have **3–4 rounds**:

1. **HR screening** — background, salary, notice period
2. **Technical** — SQL, Excel, Power BI (often a test or live questions)
3. **Case study / assignment** — take-home dashboard or SQL test
4. **Manager round** — domain fit, communication, stakeholder handling

This guide covers questions from each round with **simple sample answers**.

## SQL interview questions

### Q1: What is the difference between WHERE and HAVING?

**Simple answer:** WHERE filters rows **before** grouping. HAVING filters **after** GROUP BY.

\`\`\`sql
-- WHERE: filter individual orders
SELECT Region, SUM(Sales) AS Total
FROM Orders
WHERE OrderDate >= '2026-01-01'
GROUP BY Region;

-- HAVING: filter grouped results
SELECT Region, SUM(Sales) AS Total
FROM Orders
GROUP BY Region
HAVING SUM(Sales) > 100000;
\`\`\`

### Q2: Explain INNER JOIN vs LEFT JOIN

- **INNER JOIN** — only matching rows from both tables
- **LEFT JOIN** — all rows from left table + matches from right (NULL if no match)

Use LEFT JOIN when you need to find **missing** relationships (e.g. customers with no orders).

### Q3: How do you find duplicate records?

\`\`\`sql
SELECT Email, COUNT(*) FROM Customers
GROUP BY Email HAVING COUNT(*) > 1;
\`\`\`

### Q4: What is a window function?

A calculation across related rows **without collapsing** the result into one row.

Example: rank employees by salary within each department using \`RANK() OVER (PARTITION BY department ORDER BY salary DESC)\`.

## Power BI interview questions

### Q5: Import vs DirectQuery?

- **Import** — data copied into Power BI (faster visuals, scheduled refresh)
- **DirectQuery** — queries live database (always current, can be slower)

Use Import for most MIS dashboards under a few million rows.

### Q6: What is a measure vs a calculated column?

- **Measure** — calculated on the fly (SUM, AVG, ratios) — use for KPIs
- **Calculated column** — computed row by row, stored in the table — use for labels/categories

### Q7: How do you handle slow dashboards?

- Reduce imported columns
- Use SQL views for pre-aggregation
- Remove unnecessary visuals
- Check relationship cardinality
- Use Performance Analyzer in Power BI

## Excel / MIS questions

### Q8: VLOOKUP vs INDEX-MATCH?

Both lookup values. INDEX-MATCH is more flexible (lookup left or right, handles insert/delete better). In modern Excel, **XLOOKUP** is preferred.

### Q9: What is Power Query?

Excel's tool to connect, clean, and refresh data from databases and files. Mention you use it to automate weekly MIS instead of manual copy-paste.

## Case study questions

### Q10: "Sales dropped 15% this month. How would you investigate?"

Use the **structured approach**:

1. **Confirm the number** — check SQL query, date filters, duplicates
2. **Segment** — by region, product, channel, customer type
3. **Compare time** — vs last month, same month last year
4. **Check external factors** — holidays, stock-outs, price changes
5. **Recommend action** — with data-backed hypothesis

Interviewers care about **your thinking process**, not a perfect answer.

## Behavioral questions (STAR method)

### Q11: Tell me about a time you improved a report process.

**STAR template:**
- **Situation:** Manual Excel report took 4 hours weekly
- **Task:** Reduce time and errors
- **Action:** Built SQL view + Power Query pipeline + Power BI dashboard
- **Result:** Cut time to 45 minutes, fewer revision requests from management

### Q12: How do you handle unclear requirements?

Sample answer: *"I schedule a 15-minute call to confirm the decision the stakeholder needs, list proposed KPIs, share a draft, and iterate before building the full dashboard."*

## Questions to ask the interviewer

- What tools does the team use daily?
- How is success measured in the first 90 days?
- What does the data stack look like (SQL Server, cloud, ERP)?
- Is there opportunity to work on automation and dashboards?

## 1-week interview prep plan

| Day | Activity |
|-----|----------|
| Mon | Review SQL JOINs, GROUP BY, window functions |
| Tue | Practice 5 DAX measures |
| Wed | Rebuild one Power BI dashboard from scratch |
| Thu | Do one case study out loud |
| Fri | Prepare 3 STAR stories from your experience |
| Sat | Mock interview with a friend |
| Sun | Rest and review your portfolio link |

## Final takeaway

Indian Data Analyst interviews test **practical skills** — SQL, Excel, Power BI, and clear communication. Practice explaining your projects simply, and always connect technical work to **business impact** (time saved, faster decisions, fewer errors).`,
  },
  {
    slug: "mis-executive-to-data-analyst-roadmap-2026",
    title: "From MIS Executive to Data Analyst: A Simple Skills Roadmap for 2026",
    excerpt:
      "Already working in MIS? Follow this step-by-step roadmap to transition into a Data Analyst role — skills, projects, timeline, and portfolio tips.",
    category: "Interview",
    date: "2026-06-20",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    content: `## You are closer than you think

If you are an **MIS Executive**, you already do half the Data Analyst job:

- Pull data from systems
- Build reports for management
- Work with SQL or Excel daily
- Understand business KPIs

The gap is usually **deeper analysis**, **better dashboards**, and **portfolio proof** — not starting from zero.

## MIS Executive vs Data Analyst (honest comparison)

| MIS Executive | Data Analyst |
|---------------|--------------|
| Scheduled reports (daily/weekly) | Ad-hoc analysis + dashboards |
| Excel-heavy | SQL + Power BI + sometimes Python |
| Operational focus | Insight and recommendation focus |
| Reactive ("send the report") | Proactive ("here is what the data means") |

## 6-month roadmap (while working full-time)

### Month 1–2: Strengthen SQL

**Goal:** Write queries without asking IT every time.

Learn:
- JOINs (INNER, LEFT)
- GROUP BY and HAVING
- Window functions (ROW_NUMBER, RANK)
- Views and stored procedures basics

**Practice:** Rebuild one existing Excel report using SQL only.

### Month 2–3: Master Power BI

**Goal:** Replace at least one static Excel report with a live dashboard.

Learn:
- Data modeling and relationships
- Basic DAX (SUM, CALCULATE, time intelligence)
- Slicers, drill-through, bookmarks
- Publish and schedule refresh

**Practice:** Dashboard for sales OR inventory — pick one domain you know well.

### Month 3–4: Add Python basics

**Goal:** Automate one messy data task.

Learn:
- Pandas (read, filter, groupby)
- Export to Excel
- Simple charts with matplotlib

**Practice:** Clean a CSV export that currently takes you 30 minutes in Excel.

### Month 4–5: Build portfolio projects

Create **3 case studies** on your portfolio website:

1. **MIS automation** — "Reduced manual reporting by X%"
2. **SQL + Power BI dashboard** — ERP or operations data
3. **EDA project** — public dataset (Zomato, sales, HR attrition)

Each project should include: problem, tools, SQL snippet, dashboard screenshot, outcome.

### Month 5–6: Job search and interviews

- Update LinkedIn headline: "MIS Executive | Aspiring Data Analyst | SQL · Power BI · Python"
- Apply to hybrid roles: MIS Analyst, Reporting Analyst, Junior Data Analyst
- Target cities: Gurgaon, Noida, Bangalore, Pune, Hyderabad

## Skills priority matrix

| Priority | Skill | Why |
|----------|-------|-----|
| Must have | SQL Server | Core of Indian MIS roles |
| Must have | Power BI | Most requested BI tool |
| Must have | Advanced Excel + Power Query | Still used everywhere |
| Should have | Python (Pandas) | Differentiator |
| Nice to have | GenAI for productivity | Speeds up learning |
| Later | Azure / cloud data engineering | For Data Engineer path |

## How to talk about your MIS experience in interviews

Do not undersell MIS work. Frame it as:

- *"I built 30+ MIS reports used by leadership daily"*
- *"I automated reporting with Power Query and reduced manual effort by 60%"*
- *"I translated business questions into trackable KPIs"*

That is **Data Analyst work** — just name it confidently.

## Common blockers and fixes

| Blocker | Fix |
|---------|-----|
| "I only know Excel" | Start Power Query → then SQL → then Power BI |
| "No time to learn" | 45 minutes daily beats 5 hours on Sunday |
| "No portfolio" | Document your current work projects (anonymized) |
| "Imposter syndrome" | You already solve data problems — learn tools to scale |

## Certifications — worth it?

Helpful but **not required** for most junior roles:
- Microsoft PL-300 (Power BI)
- Google Data Analytics Certificate
- Azure Data Fundamentals (DP-900)

A strong **portfolio + real project impact** often beats certificates alone.

## Final takeaway

The MIS → Data Analyst path is one of the **most natural transitions** in analytics. You already know the business. Add SQL depth, Power BI dashboards, and 2–3 portfolio projects — and you are interview-ready within 6 months.`,
  },
  {
    slug: "reduce-manual-mis-reporting-automation-playbook",
    title: "How to Reduce Manual MIS Reporting by 60% (A Practical Automation Playbook)",
    excerpt:
      "A real-world playbook to cut manual reporting time — SQL views, Power Query, Excel VBA, and Power BI working together. Simple steps any MIS team can follow.",
    category: "Excel",
    date: "2026-06-19",
    readTime: "11 min read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    content: `## Why manual reporting hurts the business

Manual MIS reporting causes:

- **Late reports** — copy-paste errors delay decisions
- **Version conflicts** — "which Excel file is final?"
- **Burnout** — analysts spend nights fixing formulas
- **Wrong KPIs** — one broken link, wrong numbers in meetings

Automation does not mean replacing people. It means **freeing time for analysis** instead of data copying.

## The 60% reduction framework

Based on a typical MIS workflow, time is spent on:

| Activity | % of time | Automation tool |
|----------|-----------|-----------------|
| Extracting data | 35% | SQL views + Power Query |
| Cleaning/transforming | 25% | Power Query |
| Formatting/layout | 20% | Templates + VBA (optional) |
| Distribution | 10% | Power BI publish / scheduled email |
| Analysis | 10% | Human (this should grow!) |

Automate the top 3 rows first — that is where 60%+ savings come from.

## Phase 1: Standardize SQL (Week 1–2)

**Problem:** Everyone writes slightly different queries.

**Fix:** Create shared SQL views.

\`\`\`sql
CREATE VIEW vw_DailySalesMIS AS
SELECT
  CAST(OrderDate AS DATE) AS ReportDate,
  Region,
  ProductCategory,
  SUM(SalesAmount) AS TotalSales,
  COUNT(DISTINCT OrderID) AS Orders
FROM SalesOrders
GROUP BY CAST(OrderDate AS DATE), Region, ProductCategory;
\`\`\`

Document each view: owner, refresh time, column definitions.

## Phase 2: Replace copy-paste with Power Query (Week 3–4)

**Problem:** Daily export from SQL → paste into Excel.

**Fix:**
1. Excel → Data → Get Data → SQL Server
2. Connect to \`vw_DailySalesMIS\`
3. Load to a dedicated sheet \`Data_Raw\`
4. Build pivot tables on \`Data_Raw\` — never on pasted values
5. Refresh all with one click (or scheduled if using Power BI)

**Result:** 30–45 minutes daily → 2 minutes.

## Phase 3: One Power BI dashboard (Week 5–8)

**Problem:** 5 different Excel files emailed to management.

**Fix:** Single dashboard with:
- KPI cards (today, MTD, growth %)
- Trend chart
- Region and category slicers
- Scheduled refresh at 7 AM

Share one link. Stop emailing attachments.

## Phase 4: Optional VBA for distribution (Week 9)

If email is still required:
- VBA macro exports PDF snapshot
- Sends to distribution list
- Runs via Windows Task Scheduler

Only automate email **after** data pipeline is stable.

## Before vs after example

| Step | Before (manual) | After (automated) |
|------|-----------------|-------------------|
| Get data | Export CSV, paste | Power Query refresh |
| Clean data | Manual filters | SQL view + PQ steps |
| Calculate KPIs | Excel formulas | DAX measures |
| Create charts | Copy charts to PPT | Live dashboard |
| Send report | Email 5 files | Share dashboard link |
| **Total time** | **~4 hours/day** | **~45 min/day** |

## Governance checklist (do not skip)

- [ ] KPI definitions documented
- [ ] One owner per report
- [ ] Data refresh schedule agreed with IT
- [ ] UAT for 2 weeks comparing old vs new numbers
- [ ] Backup plan if refresh fails (alert email)

## How to get management buy-in

Present automation as:
- **Faster decisions** — morning dashboard vs afternoon Excel
- **Fewer errors** — single source of truth
- **Capacity for analysis** — team stops firefighting reports

Show a **pilot on one report** before scaling to all MIS outputs.

## Metrics to track success

- Hours saved per week (track in a simple log)
- Number of manual reports replaced
- Report delivery time (e.g. from 11 AM to 8 AM)
- Stakeholder satisfaction (quick survey)

## Final takeaway

You do not need a massive IT project to cut manual MIS work by 60%. Start with **one SQL view**, **one Power Query connection**, and **one Power BI dashboard**. Prove value in 30 days, then roll out to the next report.

This is exactly the approach that works for sales, inventory, finance, and operations teams across Indian manufacturing and export companies.`,
  },
];
