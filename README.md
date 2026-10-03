# Expense Tracker

<!--

An intuitive web application designed to help users log, organize, and filter their daily expenses in real time. It automatically calculates key metrics—such as total spending, item count, and highest expense—while offering custom category filtering and dark mode support. 
 -->

## How to run

<!-- 
Open the project folder in VS Code.

Start the frontend using one of two methods:

Method A (Recommended): Right-click index.html and select Open with Live Server.

Method B: Double-click index.html from your file explorer to open it directly in any browser.
      -->

**Backend**

<!--
1. **RESTful API Architecture:** Exposes clean endpoints to perform full CRUD operations (Create, Read, Update, Delete) for expenses.
2. **PostgreSQL Database Integration:** Uses structured relational data storage to execute raw SQL queries/transactions safely using parameterized inputs to prevent SQL injection.
3. **Environment Configuration:** Implements `dotenv` to secure sensitive credentials such as database passwords, ports, and host connections.
4. **Data Validation & Error Handling:** Validates incoming payloads (verifying amounts, non-numeric titles, dates, and categories) on the server side and returns structured HTTP status codes (`200`, `201`, `400`, `500`).
-->

**Frontend**

<!--
**Real-time Financial Summary:** Dynamic dashboard cards automatically calculate and display total expenditure, total transaction count, and highest individual expense with its title.
2. **Category Filtering:** Allows users to filter the expense table instantly by specific categories (Food, Transport, Bills, Entertainment, Other) or view all transactions.
3. **Interactive Modal Editing:** Full support for updating existing entries seamlessly using a Bootstrap Modal populated via hidden ID tracking.
4. **Theme Toggle (Dark/Light Mode):** Instant UI adaptation switching between light and dark visual modes.
5. **Form Validation:** Client-side validation enforcing input constraints (non-empty strings, positive decimal amounts, date picker formats) before submitting requests to the backend.
-->
## Features

<!-- List what your app can do. Tick what you finished. -->

- [✅] Add an expense (with validation)
- [✅] Delete an expense
- [✅] Edit an expense
- [✅] Filter by category
- [✅] Summary cards (total, count, highest)
- [✅] Data is saved in a PostgreSQL database
- [✅] 🌟 **Bonus:** Dark Mode support (toggle between Light and Dark themes)

## Screenshots

<!-- 
https://drive.google.com/file/d/19qVLLSiipJxMENOAHxxa_JqDnGSXLNP0/view?usp=sharing

 -->

## What was the hardest part?

<!--

The most challenging part of the project was seamlessly integrating the frontend with the backend REST API and managing asynchronous database operations. Handling edge cases—such as updating the summary cards and table dynamically after an Edit or Delete request without requiring a page refresh—initially led to state desynchronization. I solved this by implementing structured `async/await` fetch requests with robust error handling, ensuring that the frontend state only updates after receiving a successful HTTP response (`200 OK` / `201 Created`) from the Express backend and PostgreSQL database. 
  -->
