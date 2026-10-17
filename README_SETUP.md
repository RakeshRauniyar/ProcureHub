# ProcureHub — Review 02 & Review 03 Complete Project

**Project:** ProcureHub Supplier & Purchase Order Management System  
**Technology:** HTML, CSS, JavaScript, PHP, MySQL/MariaDB, Chart.js  
**Recommended local setup:** Windows + VS Code + XAMPP

## Features included
- Dashboard KPIs calculated from database records.
- Chart of purchase-order value by status.
- Supplier directory: add, search, edit, delete, active/inactive status.
- Product catalogue: add, search, edit, delete.
- Quotation comparison: create, search, delete supplier quotations.
- Purchase orders: create, search/filter, update status, delete, calculate totals.
- Report summary, CSV export and print-friendly report.
- Notifications for pending approvals and inactive suppliers.
- Responsive layout for desktop and smaller screens.
- PHP JSON API with prepared SQL statements and server-side validation.
- Database schema, foreign-key relationships and starter sample data.
- Project report outline, test checklist and viva preparation in `REVIEW03_REPORT_AND_VIVA.md`.

## Installation (first-time setup)
1. Install and open **XAMPP**.
2. In XAMPP Control Panel, start **Apache** and **MySQL**. If MySQL fails, check whether another MySQL service already uses port 3306.
3. Extract this ZIP. It contains a folder named `ProcureHub`.
4. Copy that `ProcureHub` folder into `C:\xampp\htdocs\`. The final path should be `C:\xampp\htdocs\ProcureHub\index.html`.
5. Open `http://localhost/phpmyadmin/`.
6. Choose **Import**, select `database.sql` from the project folder and click **Import**. This creates the `procurehub` database and its tables/sample data.
   - **Warning:** `database.sql` drops and recreates the project's tables. Do not re-import it after you have entered real/demo records you want to keep.
7. Check `db.php`. The default XAMPP configuration is user `root`, blank password, port `3306`. If your local MySQL password or port differs, update these values.
8. Open `http://localhost/ProcureHub/`. Do not double-click `index.html` or use VS Code Live Server for this PHP/MySQL version.
9. Wait for the top-right status to show **Database connected**. Add a test supplier, product, quotation and purchase order, then refresh the page to confirm records persist.

## If something goes wrong
- **Database unavailable:** confirm Apache and MySQL are running, database `procurehub` exists, and `db.php` credentials/port are correct.
- **404 / API action not found:** make sure `api.php`, `db.php`, `index.html`, `script.js`, and `style.css` are together in `htdocs\ProcureHub`.
- **Duplicate supplier email or product code:** choose a unique email/code.
- **Cannot delete a supplier/product:** the database protects records referenced by quotations or purchase orders. Delete the dependent quotation/order first if appropriate.
- **Chart does not appear:** internet access is needed to load Chart.js from the CDN. The other main functions use local PHP/MySQL.
- **Port 3306 is occupied:** stop the other MySQL service or deliberately configure XAMPP and `db.php` to use another matching port.
- **Blank or raw PHP output:** use `http://localhost/ProcureHub/` through Apache, not a `file:///` path.

## What to do for assessment (not coding)
1. Run the project and prepare screenshots of: dashboard, supplier added and visible after refresh, product catalogue, quotation comparison, new purchase order, status update, and CSV report.
2. Keep a backup copy of the database and source folder.
3. Read `REVIEW03_REPORT_AND_VIVA.md`; replace the student/team/course details with your actual details and insert your own screenshots.
4. Be ready to explain the ER relationships, primary/foreign keys, prepared statements, validation, API flow, and how the dashboard totals are calculated.
5. Demonstrate a complete flow live: add supplier → add product → add quotation → create order → update status → export report.
6. Do not claim that login/authentication, supplier email notifications, cloud hosting, or production security are implemented. This is a local academic demo without authentication.

## Project structure
- `index.html` — page layout and forms
- `style.css` — responsive blue/light interface
- `script.js` — navigation, rendering, validation UX, chart, CSV export and API calls
- `api.php` — PHP JSON endpoints for all modules
- `db.php` — database connection configuration
- `database.sql` — schema, constraints and sample data
- `test.php` — PHP runtime test
- `test_db.php` — database connection test
- `REVIEW03_REPORT_AND_VIVA.md` — report structure, testing evidence and viva questions

## Important note about demo data
The starter SQL contains four suppliers, five products, five quotations and four purchase orders to make the dashboard useful immediately. All new/updated records are stored in MySQL. The report values change when the database changes.
