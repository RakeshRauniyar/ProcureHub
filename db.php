<?php
declare(strict_types=1);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

/*
 * XAMPP default settings. If your MariaDB root user has a password,
 * set it in $password below.
 */
$host = "localhost";
$username = "root";
$password = "";
$database = "procurehub";
$port = 3306;

try {
    $conn = new mysqli($host, $username, $password, $database, $port);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("ProcureHub database connection failed: " . $e->getMessage());
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["success" => false, "message" => "Database connection failed. Check XAMPP and db.php settings."]);
    exit;
}
