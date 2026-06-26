import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "enterprise-erp-analytics-dashboard",
    title: "Enterprise ERP Analytics Dashboard",
    description:
      "Module-wise Power BI dashboards for Inventory, HR, Finance, and Sales with standardized SQL KPI logic serving 500+ daily users.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    businessProblem:
      "Leadership lacked a unified view of ERP performance across plants, teams, and product categories, causing delayed decisions and inconsistent KPI definitions.",
    dataset: "ERP transactional data across Inventory, HR, Finance, and Sales modules",
    tools: ["SQL Server", "Power BI", "Advanced Excel"],
    keyInsights: [
      "Standardized KPI views improved reporting consistency across 4 business modules",
      "Query tuning and indexing improved dashboard responsiveness by up to 40%",
      "Drill-down filters enabled plant, team, and category-level analysis for operations leaders",
    ],
    tags: ["Power BI", "SQL Server", "ERP"],
    githubUrl: "https://github.com/abhishekrajverma/ERP-System",
    liveUrl: "https://linkedin.com/in/abhishekrajverma",
    featured: true,
    overview:
      "End-to-end ERP analytics solution with reusable SQL views, stored procedures, and interactive Power BI dashboards for enterprise decision-making.",
    problemStatement:
      "Multiple departments relied on disconnected spreadsheets and ad-hoc SQL pulls, leading to inconsistent KPI calculations and slow reporting cycles.",
    dataCleaning: [
      "Standardized product category and plant codes across ERP modules",
      "Resolved duplicate transaction records in inventory movement tables",
      "Validated finance variance fields against source ledger entries",
      "Created conformed date and organization dimensions for cross-module analysis",
    ],
    sqlQueries: [
      {
        title: "Inventory Turnover KPI View",
        query: `CREATE VIEW vw_InventoryTurnover AS
SELECT
  PlantID,
  ProductCategory,
  SUM(IssueQty) / NULLIF(AVG(OnHandQty), 0) AS InventoryTurnover,
  AVG(FillRate) AS AvgFillRate
FROM InventoryTransactions
GROUP BY PlantID, ProductCategory;`,
      },
      {
        title: "Sales vs Target Variance",
        query: `SELECT
  TeamName,
  SUM(SalesAmount) AS ActualSales,
  SUM(TargetAmount) AS TargetSales,
  (SUM(SalesAmount) - SUM(TargetAmount)) AS Variance
FROM SalesPerformance
GROUP BY TeamName;`,
      },
    ],
    pythonAnalysis: [
      "Exploratory analysis on sales trend outliers by plant and category",
      "Validated KPI distribution patterns before dashboard rollout",
    ],
    powerBIDashboard:
      "Interactive dashboards with drill-down by plant, team, time period, and product category. KPI cards for fill rate, order cycle time, inventory turnover, and target variance with executive and operational views.",
    businessInsights: [
      "Module-wise visibility reduced decision turnaround time for operations reviews",
      "Shared KPI logic eliminated conflicting numbers across department reports",
      "Performance tuning supported 500+ daily users without refresh delays",
    ],
    recommendations: [
      "Expand automated data quality alerts for ERP source tables",
      "Add forecast layers for inventory and sales planning",
      "Schedule incremental refresh windows during off-peak hours",
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    ],
    technologies: ["SQL Server", "Power BI", "Excel", "T-SQL", "DAX"],
  },
  {
    slug: "zomato-data-analytics",
    title: "Kaggle Zomato Data Analytics Project",
    description:
      "SQL Server and Power BI analysis of Zomato restaurant data covering city, cuisine, pricing, ratings, and delivery trends.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
    businessProblem:
      "Restaurant market data was messy and unstructured, making it difficult to compare segments and identify high-potential cuisines and cities.",
    dataset: "Kaggle Zomato restaurant dataset with location, cuisine, rating, price, and delivery attributes",
    tools: ["SQL Server", "Power BI", "Excel"],
    keyInsights: [
      "City-wise and cuisine-wise performance patterns revealed high-demand segments",
      "Price band analysis highlighted positioning opportunities for mid-tier restaurants",
      "Online delivery adoption varied significantly across metro and tier-2 markets",
    ],
    tags: ["SQL", "Power BI", "EDA"],
    githubUrl: "https://github.com/abhishekrajverma",
    liveUrl: "https://linkedin.com/in/abhishekrajverma",
    featured: true,
    overview:
      "A full analytics workflow from raw Kaggle data to curated SQL views and an interactive Power BI dashboard for restaurant market intelligence.",
    problemStatement:
      "The dataset contained missing values, duplicate records, and inconsistent cuisine/location tags that blocked reliable market comparisons.",
    dataCleaning: [
      "Handled missing ratings and price values using business rules",
      "Removed duplicate restaurant records after fuzzy name matching",
      "Standardized cuisine tags and city naming conventions",
      "Created cleaned staging tables before loading analysis-ready views",
    ],
    sqlQueries: [
      {
        title: "City-wise Restaurant Performance",
        query: `SELECT
  City,
  COUNT(*) AS RestaurantCount,
  AVG(Rating) AS AvgRating,
  AVG(Votes) AS AvgVotes
FROM dbo.Restaurants_Clean
GROUP BY City
ORDER BY AvgRating DESC;`,
      },
      {
        title: "Cuisine Demand Analysis",
        query: `SELECT
  Cuisine,
  COUNT(*) AS Outlets,
  AVG(AggregatedRating) AS AvgRating,
  SUM(CASE WHEN HasOnlineDelivery = 1 THEN 1 ELSE 0 END) AS DeliveryEnabled
FROM dbo.Restaurants_Clean
GROUP BY Cuisine;`,
      },
    ],
    pythonAnalysis: [
      "Performed EDA on rating distributions and price bands",
      "Identified cuisine clusters with high vote volume and delivery adoption",
    ],
    powerBIDashboard:
      "Interactive dashboard with slicers for city, cuisine, price range, and delivery availability. KPI cards for average rating, vote volume, and online delivery share with segment comparison visuals.",
    businessInsights: [
      "Certain cuisines showed consistently higher ratings and order potential in target cities",
      "Mid-price restaurants had the strongest balance of volume and satisfaction",
      "Delivery-enabled outlets correlated with higher customer engagement in urban markets",
    ],
    recommendations: [
      "Target expansion in cuisines with high demand but lower outlet density",
      "Prioritize delivery partnerships in cities with adoption gaps",
      "Use rating and vote thresholds to shortlist high-confidence market entries",
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    ],
    technologies: ["SQL Server", "Power BI", "Excel", "Power Query"],
  },
  {
    slug: "mis-reporting-optimization",
    title: "MIS Reporting Process Optimization Suite",
    description:
      "Automated MIS reporting suite using SQL Server, Power Query, and Excel VBA to cut manual effort and reporting turnaround time.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    businessProblem:
      "Management reports required multiple manual touchpoints across SQL extraction, Excel formatting, and validation, causing delays and inconsistent outputs.",
    dataset: "Operational and financial data from SQL Server MIS source tables",
    tools: ["Excel VBA", "Power Query", "SQL Server"],
    keyInsights: [
      "Automated refresh and packaging reduced manual reporting effort by ~60%",
      "Standardized Power Query transforms improved data consistency",
      "Validation macros reduced reporting errors before management circulation",
    ],
    tags: ["Excel VBA", "Power Query", "MIS"],
    githubUrl: "https://github.com/abhishekrajverma",
    liveUrl: "https://linkedin.com/in/abhishekrajverma",
    featured: true,
    overview:
      "A standardized reporting suite that pulls SQL Server data, transforms it in Power Query, and exports management-ready MIS summaries with VBA automation.",
    problemStatement:
      "Repetitive weekly and monthly reports consumed significant analyst time due to manual extraction, formatting, and validation steps.",
    dataCleaning: [
      "Built reusable Power Query steps for column standardization",
      "Added VBA validation checks for missing keys and totals mismatch",
      "Created parameterized SQL extracts for recurring report periods",
    ],
    sqlQueries: [
      {
        title: "MIS Summary Extract",
        query: `SELECT
  ReportDate,
  Department,
  KPI_Name,
  KPI_Value,
  Target_Value
FROM MIS_KPI_Summary
WHERE ReportDate BETWEEN @StartDate AND @EndDate
ORDER BY Department, KPI_Name;`,
      },
    ],
    pythonAnalysis: [],
    powerBIDashboard:
      "Complementary Excel and Power BI outputs for leadership summaries, with automated refresh pipelines feeding consistent KPI tables.",
    businessInsights: [
      "Automation freed analyst time for insight generation instead of manual compilation",
      "Standardized templates improved stakeholder trust in recurring MIS packs",
      "Faster turnaround supported more timely operational decisions",
    ],
    recommendations: [
      "Migrate remaining manual reports into the shared Power Query framework",
      "Add exception alerting for KPI threshold breaches",
      "Document SOPs for business users running scheduled refreshes",
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
    ],
    technologies: ["Excel VBA", "Power Query", "SQL Server", "Advanced Excel"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
