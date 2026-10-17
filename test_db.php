<?php
require_once __DIR__ . "/db.php";
header("Content-Type: text/plain; charset=UTF-8");
echo "Connected to the ProcureHub database successfully.\n";
foreach (["suppliers","products","quotations","purchase_orders","purchase_order_items"] as $table) {
    $safe = $conn->real_escape_string($table);
    $result = $conn->query("SHOW TABLES LIKE '$safe'");
    echo $table . ": " . (($result && $result->num_rows > 0) ? "found" : "NOT FOUND") . "\n";
}
$conn->close();
