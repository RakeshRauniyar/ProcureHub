# ProcureHub — Review 03 Report & Viva Preparation

> Replace bracketed fields and insert your own screenshots/results before submission. This is a structured draft, not a claim that your college's exact report template has been met.

## Title page
- **Project title:** ProcureHub — Supplier & Purchase Order Management System
- **Student name(s):** [Enter names]
- **Register number(s):** [Enter numbers]
- **Department:** Computer Science and Engineering
- **Institution:** KPR Institute of Engineering and Technology
- **Course / lab:** [Enter official course and lab name]
- **Faculty / guide:** [Enter name]
- **Academic year:** [Enter academic year]

## 1. Abstract
ProcureHub is a web-based supplier and purchase-order management application designed to organize common procurement activities in one interface. It provides a dashboard for monitoring suppliers, purchase orders and order value; a supplier directory; a product catalogue; quotation comparison; purchase-order creation and status tracking; and procurement reports. The user interface is implemented with HTML, CSS and JavaScript. PHP exposes JSON endpoints, while MySQL/MariaDB stores records in relational tables. Prepared statements and server-side validation are used for database operations. The system is intended as a local academic prototype that demonstrates front-end interaction, server-side processing and database connectivity.

## 2. Problem statement
Supplier details, product information, supplier quotations and purchase orders may be recorded in separate spreadsheets or manual documents. This can make it harder to search records, compare quotations, track order status and summarize purchase value. ProcureHub demonstrates a single interface for maintaining these records and viewing procurement status.

## 3. Objectives
1. Store supplier and product records in a relational database.
2. Record and compare supplier quotations.
3. Create purchase orders with supplier, product, quantity, price and status.
4. Track purchase-order progress and compute totals.
5. Provide searchable tables, dashboard KPIs and a chart.
6. Export order records to CSV and print a report.
7. Demonstrate HTML/CSS/JavaScript, PHP and MySQL integration.

## 4. Scope and limitations
**Included:** local dashboard, supplier/product CRUD, quotation creation/deletion, purchase-order creation/status update/deletion, search/filter, chart, notifications, CSV export, print layout and relational database.

**Limitations:** this academic version is intended for local demonstration. It does not implement user login/role permissions, password reset, email/SMS notifications, cloud deployment, automated supplier bidding, multi-line editing of existing orders, audit logs, or production-grade security configuration. Chart.js is loaded from a CDN, so the chart requires internet access. The database credentials must be configured for the local machine.

## 5. Technologies used
- HTML5: semantic page structure, tables and forms.
- CSS3: responsive layout, sidebar, cards, tables, forms and print styling.
- JavaScript: navigation, rendering, search/filter, input handling, CSV export, notifications and API requests.
- PHP: request validation, JSON responses and database operations.
- MySQL/MariaDB: persistent relational storage, keys and constraints.
- Chart.js: dashboard order-value chart.
- XAMPP: local Apache and MySQL/MariaDB environment.
- Visual Studio Code: source editing and project management.

## 6. System modules
### 6.1 Dashboard
Displays total suppliers, active orders, pending approvals and purchase value. The status chart summarizes order value by order status. Recent orders are listed for quick access.

### 6.2 Supplier management
Allows users to create, search, edit, activate/deactivate and delete supplier records. Required values are checked in the browser and again in PHP. Supplier email is unique in the database.

### 6.3 Product catalogue
Stores product code, product name, category, unit price and stock quantity. Product codes are unique. The catalogue provides search and edit/delete controls.

### 6.4 Quotation comparison
Records the supplier, product, quantity, unit price and quotation date. The total is calculated as quantity × unit price. The list supports search and deletion.

### 6.5 Purchase-order management
Creates a purchase order with a generated order number, supplier, product, quantity, unit price, order date, optional expected delivery date and status. Users can search/filter orders, update status, delete an order and see computed totals.

### 6.6 Reports
Shows total order count, supplier count, total purchase value and received-order count. CSV export allows records to be opened in spreadsheet software; print styling supports a paper/PDF report.

## 7. System architecture
1. The user interacts with `index.html`.
2. `script.js` validates basic inputs and sends JSON requests to `api.php` using `fetch`.
3. `api.php` validates request data and executes prepared SQL statements through `db.php`.
4. MySQL/MariaDB stores supplier, product, quotation and purchase-order records.
5. PHP returns JSON; JavaScript refreshes the displayed tables and dashboard.

## 8. Database design
### Tables
- **suppliers** (`supplier_id` primary key; supplier name, contact, email, phone, category, status)
- **products** (`product_id` primary key; unique product code, name, category, unit price, stock quantity)
- **quotations** (`quotation_id` primary key; foreign keys to supplier and product; quantity, unit price, quote date)
- **purchase_orders** (`order_id` primary key; unique order number; foreign keys to supplier and product; quantity, unit price, order date, expected delivery, status)
- **purchase_order_items** (`item_id` primary key; foreign keys to purchase order and product; quantity and unit price). This child table provides a basis for extending the project to multi-line orders.

### Relationships
- One supplier can have many quotations.
- One product can have many quotations.
- One supplier can have many purchase orders.
- One product can appear in many purchase orders.
- One purchase order can have multiple item rows in `purchase_order_items` in a future multi-line extension.

**Suggested ER diagram to draw for the report:** suppliers (1) — (many) quotations (many) — (1) products; suppliers (1) — (many) purchase_orders (many) — (1) products; purchase_orders (1) — (many) purchase_order_items (many) — (1) products.

## 9. Implementation details
- PHP JSON endpoints are selected by the `action` query parameter.
- SQL statements that accept user input use prepared statements.
- Server-side validation checks required text, email format, positive quantity, positive unit price, valid dates and allowed status values.
- Foreign keys prevent deleting suppliers/products referenced by existing procurement records.
- The dashboard is recalculated from the database rather than relying on hard-coded totals.
- JavaScript escapes dynamic text before inserting it into table HTML.
- Order totals are computed as quantity × unit price.
- The CSV exporter escapes quotes and prefixes UTF-8 BOM for spreadsheet compatibility.

## 10. Test cases and results
Run each test yourself and mark the actual result. Do not mark a test as passed until you have observed it.

| Test ID | Test case | Expected result | Actual result |
|---|---|---|---|
| TC01 | Open project via localhost | Dashboard loads and database indicator is connected | [Fill in] |
| TC02 | Add valid supplier | Supplier appears in list and database | [Fill in] |
| TC03 | Submit supplier with invalid email | Validation message appears; record is not saved | [Fill in] |
| TC04 | Search suppliers | Only matching rows appear | [Fill in] |
| TC05 | Add product with unique product code | Product appears in catalogue | [Fill in] |
| TC06 | Add quotation | Quotation total equals quantity × unit price | [Fill in] |
| TC07 | Create purchase order | Generated order number and total appear | [Fill in] |
| TC08 | Refresh browser | Records remain because they are stored in MySQL | [Fill in] |
| TC09 | Update order status | New status is saved and dashboard updates | [Fill in] |
| TC10 | Filter orders by status | Only selected status appears | [Fill in] |
| TC11 | Export CSV | CSV downloads and contains order rows | [Fill in] |
| TC12 | Delete supplier/product referenced by records | Database rejects deletion and UI shows an error | [Fill in] |
| TC13 | Resize browser to mobile width | Navigation and tables remain usable | [Fill in] |
| TC14 | Print report | Report print dialog opens with report-focused layout | [Fill in] |

## 11. Screenshots to capture
1. Dashboard with database connected and chart visible.
2. Supplier directory with sample suppliers.
3. Add supplier form and newly added supplier in the list.
4. Product catalogue.
5. Quotation comparison.
6. Purchase-order form with computed total.
7. Purchase-order table showing multiple statuses.
8. Reports page and CSV file opened in a spreadsheet.
9. phpMyAdmin showing the `procurehub` tables.
10. Optional mobile-width screenshot.

## 12. Conclusion
ProcureHub demonstrates a basic end-to-end procurement workflow using a responsive web interface, a PHP API and a relational database. The modules provide persistent supplier, product, quotation and purchase-order records, along with dashboard summaries and report export. Future extensions could include authentication and role-based access, multi-line purchase orders, stock adjustments on receipt, audit trails and secure deployment.

## 13. Future enhancements
- Login with password hashing and role-based permissions.
- Multi-line purchase orders and supplier quotation evaluation scores.
- Update inventory automatically when an order is received.
- Purchase-order PDF generation and supplier email notifications.
- Audit trail for status and price changes.
- Server-side pagination and stronger deployment configuration.
- Unit/integration tests and automated database backups.

## Viva questions with short answers
**1. What is ProcureHub?**  
A web application prototype for supplier, product, quotation and purchase-order management.

**2. Why use MySQL instead of a JavaScript array?**  
MySQL persists data after page refreshes and supports structured queries, relationships and constraints.

**3. What is PHP's role?**  
PHP receives API requests, validates values, performs database operations and returns JSON.

**4. What is an API endpoint?**  
A server URL that accepts a request and returns data or performs an operation. In this project, `api.php?action=suppliers` returns supplier data.

**5. Why use prepared statements?**  
They separate SQL structure from user-supplied values and help reduce SQL injection risk.

**6. What is a primary key?**  
A column or set of columns that uniquely identifies each table row.

**7. What is a foreign key?**  
A constraint linking a column to a key in another table and helping preserve referential integrity.

**8. What is CRUD?**  
Create, Read, Update and Delete — the common operations for managing records.

**9. How is an order total calculated?**  
Quantity multiplied by unit price.

**10. What does `fetch()` do in JavaScript?**  
It sends an HTTP request and returns a Promise for the server response.

**11. Why is JSON used?**  
It is a lightweight text format for transferring structured data between JavaScript and PHP.

**12. What is client-side validation?**  
Checks in the browser that help users enter correct values before submitting.

**13. Why validate on the server too?**  
Browser checks can be bypassed; server-side validation is required before database operations.

**14. What is a unique constraint?**  
It prevents duplicate values in a specified column, such as supplier email or product code.

**15. What does a transaction do?**  
It groups related database operations so they can commit together or roll back on failure.

**16. What is a responsive design?**  
A layout that adapts to different screen sizes.

**17. What is Chart.js used for?**  
It displays the order-value summary as a dashboard chart.

**18. Why can a referenced supplier not be deleted?**  
A foreign-key constraint protects quotations and orders that refer to that supplier.

**19. What does CSV stand for?**  
Comma-Separated Values, a plain-text format used to exchange tabular data.

**20. What are the limitations of this version?**  
It is a local academic demo without authentication, production deployment hardening, automatic email notifications or complete multi-line order editing.
