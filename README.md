# ProcureHub — Supplier & Purchase Order Management System

<p align="center">
  <strong>A web-based procurement management system for organizing suppliers, products, quotations, and purchase orders.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-Web%20Technology-4071E2?style=for-the-badge" alt="Web Technology Project">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-EF8354?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-PHP-777BB4?style=for-the-badge" alt="PHP">
  <img src="https://img.shields.io/badge/Database-MySQL%20%2F%20MariaDB-4479A1?style=for-the-badge" alt="Database">
</p>

---

## Overview

**ProcureHub** is a full-stack web application designed to simplify supplier and purchase order management through a centralized interface.

The system allows users to maintain supplier and product records, manage quotations, create purchase orders, track order approval statuses, and generate procurement reports. It combines a responsive web interface with a PHP API and a MySQL/MariaDB database to provide persistent data storage and dynamic interactions.

Developed as a Web Technology academic project, ProcureHub demonstrates the practical integration of frontend technologies, server-side programming, relational databases, and data-driven user interfaces.

## Key Features

| Module | Features |
|---|---|
| **Supplier Management** | Add, view, search, and manage supplier records |
| **Product Management** | Maintain product information and pricing |
| **Quotation Management** | Record and view supplier quotations |
| **Purchase Orders** | Create purchase orders and calculate order totals |
| **Order Tracking** | Update and track purchase-order approval status |
| **Dashboard** | View procurement summaries and charts |
| **Search & Filtering** | Find records and filter purchase orders by status |
| **Reports & Export** | Generate reports, export CSV data, and print reports |
| **Database Integration** | Persist procurement data using MySQL/MariaDB |

## Technology Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- PHP
- JSON-based API communication

**Database**
- MySQL / MariaDB
- phpMyAdmin for database administration

**Development Tools**
- Visual Studio Code
- XAMPP
- Git and GitHub

## System Architecture

```text
┌─────────────────────────────────────┐
│            User Interface           │
│          HTML + CSS + JavaScript    │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│        JavaScript Fetch API         │
│       Requests and JSON Responses   │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          PHP Application API        │
│   Request Handling and SQL Queries  │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          MySQL / MariaDB            │
│      Persistent Procurement Data    │
└─────────────────────────────────────┘
```

## Database Structure

The project uses a database named `procurehub` with the following tables:

- `suppliers` — supplier information
- `products` — product details
- `quotations` — supplier quotation records
- `purchase_orders` — purchase-order records and status
- `purchase_order_items` — purchase-order line items, where applicable in the implementation

The database stores procurement information so that saved records remain available after refreshing the application.

## Getting Started

Follow these steps to run ProcureHub locally on Windows.

### Prerequisites

Install the following tools:

- [XAMPP](https://www.apachefriends.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- A modern web browser

### 1. Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/ProcureHub.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Move the project into XAMPP

Copy the project folder into:

```text
C:\xampp\htdocs\
```

For example, if your project files are nested inside two `ProcureHub` folders, the application may be accessible at:

```text
C:\xampp\htdocs\ProcureHub\ProcureHub\
```

Make sure `index.html` and the PHP files are located in the correct application directory.

### 3. Start XAMPP

Open the XAMPP Control Panel and start:

- **Apache**
- **MySQL**

Both services should be running before you continue.

### 4. Create the database

Open phpMyAdmin:

```text
http://localhost/phpmyadmin/
```

Create a database named:

```text
procurehub
```

Import the project's `database.sql` file into this database.

> If your SQL file already creates the database, follow the instructions in that file instead.

### 5. Configure the database connection

Open `db.php` and check the database connection settings.

A typical local XAMPP configuration looks like this:

```php
$host = "localhost";
$dbname = "procurehub";
$username = "root";
$password = "";
```

Use the credentials configured on your own computer. Do not commit real database passwords or other secrets to GitHub.

### 6. Run the application

Open the application in your browser using its actual folder path.

For example:

```text
http://localhost/ProcureHub/ProcureHub/
```

If you place `index.html` directly inside `C:\xampp\htdocs\ProcureHub\`, the URL will instead be:

```text
http://localhost/ProcureHub/
```

**Important:** Use `localhost` through XAMPP rather than opening the HTML file directly, because the PHP API and database connection require the local server.

## Testing and Validation

The following workflows have been tested successfully in the local development environment:

- Database connectivity
- Supplier creation and persistence
- Product creation and persistence
- Quotation saving
- Purchase-order creation and persistence
- Purchase-order total calculation
- Purchase-order status update to **Approved**
- Search and filtering
- CSV report export
- Dashboard and reporting functionality

### Example Purchase-Order Test

| Field | Test value |
|---|---:|
| Quantity | 2 |
| Unit price | ₹1,200 |
| Expected order total | ₹2,400 |
| Actual result | ₹2,400 |
| Status update | Approved |
| Persistence | Verified |

These results reflect the tests performed during local development and do not represent an independent security or performance audit.

## Project Structure

The main application files include:

```text
ProcureHub/
├── index.html          # Main application interface
├── style.css           # Styling and responsive layout
├── script.js           # Frontend interactions and API calls
├── api.php             # Backend API endpoints
├── db.php              # Database connection
├── database.sql        # Database schema and setup
└── README.md           # Project documentation
```

The exact folder structure may vary depending on how the project is organized in your repository.

## Future Enhancements

Potential improvements include:

- Role-based authentication and access control
- Enhanced server-side validation
- Audit logs and approval history
- Advanced supplier quotation comparison
- Automated database backups
- Deployment to a production server
- Expanded reporting and analytics

## Learning Outcomes

Through ProcureHub, the project demonstrates practical experience with:

- Building interactive web interfaces
- Connecting JavaScript frontend code to a PHP backend
- Performing database operations using MySQL/MariaDB
- Managing persistent relational data
- Implementing search, filtering, and CSV export
- Testing end-to-end application workflows
- Using Git and GitHub for source-code management

## Contributing

This project was developed as an academic Web Technology project. Suggestions, feedback, and learning-oriented contributions are welcome.

To suggest an improvement, open an issue or submit a pull request.

## Author

**[Your Name]**

Computer Science and Engineering  
[Your Institution]

GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## License

This project is intended for academic and educational purposes. If you plan to distribute or reuse it publicly, consider adding an appropriate open-source license.

---

<p align="center">
  <strong>ProcureHub</strong><br>
  <em>Organize procurement. Track orders. Simplify reporting.</em>
</p>
