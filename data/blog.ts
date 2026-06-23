import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "sql-window-functions-guide",
    title: "Mastering SQL Window Functions: A Complete Guide",
    excerpt:
      "Learn how ROW_NUMBER, RANK, LAG, and LEAD can transform your analytical queries from good to exceptional.",
    category: "SQL",
    date: "2024-11-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    content: `## Introduction

Window functions are one of the most powerful features in SQL for analytical workloads. Unlike aggregate functions that collapse rows, window functions perform calculations across a set of rows related to the current row.

## ROW_NUMBER vs RANK vs DENSE_RANK

Understanding the differences between these ranking functions is crucial for any data analyst.

\`\`\`sql
SELECT 
  employee_name,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;
\`\`\`

## Practical Use Cases

- Running totals and moving averages
- Top N per group analysis
- Period-over-period comparisons
- Cohort analysis

## Conclusion

Mastering window functions will significantly improve your SQL proficiency and make complex analytical queries much more readable.`,
  },
  {
    slug: "power-bi-dax-time-intelligence",
    title: "DAX Time Intelligence: YTD, MTD, and Custom Periods",
    excerpt:
      "Build powerful time-based calculations in Power BI using DAX time intelligence functions.",
    category: "Power BI",
    date: "2024-10-22",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    content: `## Why Time Intelligence Matters

Every business dashboard needs time-based comparisons. DAX provides built-in functions that make this straightforward.

## Essential Measures

\`\`\`dax
Sales YTD = 
  TOTALYTD(
    SUM(Sales[Amount]),
    'Date'[Date]
  )

Sales YoY Growth = 
  DIVIDE(
    [Sales YTD] - [Sales YTD PY],
    [Sales YTD PY]
  )
\`\`\`

## Best Practices

Always use a proper date dimension table with contiguous dates and mark it as a date table in Power BI.`,
  },
  {
    slug: "excel-power-query-etl",
    title: "Power Query: Your Secret Weapon for Data ETL in Excel",
    excerpt:
      "Automate data transformation workflows in Excel using Power Query's M language.",
    category: "Excel",
    date: "2024-09-08",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    content: `## What is Power Query?

Power Query is Excel's built-in ETL tool that lets you connect, transform, and load data from virtually any source.

## Common Transformations

- Removing duplicates and null values
- Splitting and merging columns
- Unpivoting data for analysis
- Merging queries from multiple sources

## Automation Tips

Set up scheduled refreshes and parameterize your queries for reusable templates.`,
  },
  {
    slug: "python-pandas-data-cleaning",
    title: "Data Cleaning with Pandas: A Practical Workflow",
    excerpt:
      "Step-by-step guide to cleaning messy real-world datasets using Python Pandas.",
    category: "Python",
    date: "2024-08-14",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1526374965288-7f61d4dc18c5?w=800&h=500&fit=crop",
    content: `## The 80/20 Rule of Data Science

Data scientists spend 80% of their time cleaning data. Here's a systematic approach.

## Cleaning Checklist

1. Inspect data types and convert as needed
2. Handle missing values strategically
3. Detect and treat outliers
4. Standardize text fields
5. Validate against business rules

\`\`\`python
import pandas as pd

df = pd.read_csv('data.csv')
df.info()
df.describe()
df.isnull().sum()
\`\`\``,
  },
  {
    slug: "data-analyst-interview-questions",
    title: "Top 50 Data Analyst Interview Questions (With Answers)",
    excerpt:
      "Comprehensive preparation guide covering SQL, statistics, case studies, and behavioral questions.",
    category: "Interview",
    date: "2024-07-20",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
    content: `## SQL Questions

1. What is the difference between INNER JOIN and LEFT JOIN?
2. Explain window functions with an example.
3. How would you find duplicate records in a table?

## Statistics Questions

1. Explain p-value in simple terms.
2. When would you use a t-test vs chi-square test?
3. What is the difference between correlation and causation?

## Case Study Framework

Use the STAR method: Situation, Task, Action, Result.`,
  },
  {
    slug: "dashboard-design-principles",
    title: "7 Dashboard Design Principles Every Analyst Should Know",
    excerpt:
      "Create dashboards that executives actually use — principles from designing 30+ enterprise dashboards.",
    category: "Power BI",
    date: "2024-06-05",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    content: `## Design Principles

1. **Know your audience** — Executive vs operational dashboards differ
2. **Less is more** — Maximum 5-7 KPIs per view
3. **Visual hierarchy** — Most important metrics top-left
4. **Consistent color coding** — Green for positive, red for alerts
5. **Interactive, not cluttered** — Use drill-throughs wisely
6. **Mobile responsive** — 40% of users check on mobile
7. **Tell a story** — Guide the eye through the narrative`,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(
  category: BlogPost["category"] | "All"
): BlogPost[] {
  if (category === "All") return blogPosts;
  return blogPosts.filter((p) => p.category === category);
}

export function getRecommendedBlogPosts(
  currentSlug: string,
  limit = 3
): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, limit);

  const others = blogPosts.filter((p) => p.slug !== currentSlug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const otherCategories = others.filter((p) => p.category !== current.category);

  return [...sameCategory, ...otherCategories].slice(0, limit);
}
