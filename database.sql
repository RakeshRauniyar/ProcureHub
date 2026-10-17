-- ProcureHub database schema and sample data
-- Import this file using phpMyAdmin > Import, or run it in MySQL.
CREATE DATABASE IF NOT EXISTS procurehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE procurehub;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS quotations;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE suppliers (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_supplier_email (email)
) ENGINE=InnoDB;

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(40) NOT NULL UNIQUE,
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE quotations (
  quotation_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  quote_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  CONSTRAINT fk_quote_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

CREATE TABLE purchase_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(30) NOT NULL UNIQUE,
  supplier_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery DATE NULL,
  status ENUM('Pending Approval','Approved','Ordered','Received','Cancelled') NOT NULL DEFAULT 'Pending Approval',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  CONSTRAINT fk_order_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

-- Child table kept for future multi-line purchase orders and normalized design.
CREATE TABLE purchase_order_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES purchase_orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

INSERT INTO suppliers (supplier_name,contact_person,email,phone,category,status) VALUES
('ABC Industrial Supplies','Arun Kumar','arun@abc.example.com','9876543210','Raw Materials','Active'),
('PrimeTech Components','Priya Sharma','priya@primetech.example.com','9876501234','Electronics','Active'),
('Global Office Solutions','Rahul Verma','rahul@globaloffice.example.com','9876512340','Office Supplies','Active'),
('Metro Machine Parts','Karan Singh','karan@metroparts.example.com','9876523450','Machinery','Active');

INSERT INTO products (product_code,product_name,category,unit_price,stock_quantity) VALUES
('PRD-001','Steel Sheets','Raw Materials',1500.00,120),
('PRD-002','Electronic Sensors','Electronics',850.00,45),
('PRD-003','Office Paper Box','Office Supplies',450.00,80),
('PRD-004','Machine Bearings','Machinery',1200.00,30),
('PRD-005','Copper Wire Roll','Electrical',2100.00,25);

INSERT INTO quotations (supplier_id,product_id,quantity,unit_price,quote_date) VALUES
(1,1,10,1500.00,'2026-10-08'),
(4,1,10,1580.00,'2026-10-08'),
(2,2,20,850.00,'2026-10-09'),
(1,2,20,890.00,'2026-10-09'),
(3,3,15,450.00,'2026-10-10');

INSERT INTO purchase_orders (order_number,supplier_id,product_id,quantity,unit_price,order_date,expected_delivery,status) VALUES
('PO-1001',1,1,10,1500.00,'2026-10-08','2026-10-20','Approved'),
('PO-1002',2,2,20,850.00,'2026-10-09','2026-10-21','Pending Approval'),
('PO-1003',3,3,15,450.00,'2026-10-10','2026-10-23','Ordered'),
('PO-1004',4,4,5,1200.00,'2026-10-11','2026-10-24','Received');
