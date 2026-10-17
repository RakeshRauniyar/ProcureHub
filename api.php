<?php
declare(strict_types=1);
require_once __DIR__ . "/db.php";
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store");

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function input_data(): array {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw ?: "{}", true);
    return is_array($data) ? $data : [];
}
function required_text(array $data, string $key, int $max = 190): string {
    $value = trim((string)($data[$key] ?? ""));
    if ($value === "" || strlen($value) > $max) {
        respond(["success"=>false,"message"=>"Please provide a valid value for " . str_replace("_"," ",$key) . "."], 422);
    }
    return $value;
}
function positive_int(array $data, string $key, int $min = 1): int {
    $v = filter_var($data[$key] ?? null, FILTER_VALIDATE_INT);
    if ($v === false || $v < $min) respond(["success"=>false,"message"=>"Please provide a valid " . str_replace("_"," ",$key) . "."], 422);
    return (int)$v;
}
function positive_money(array $data, string $key, bool $allowZero = false): float {
    $v = filter_var($data[$key] ?? null, FILTER_VALIDATE_FLOAT);
    if ($v === false || !is_finite((float)$v) || ($allowZero ? $v < 0 : $v <= 0)) {
        respond(["success"=>false,"message"=>"Please provide a valid " . str_replace("_"," ",$key) . "."], 422);
    }
    return (float)$v;
}
function method(string $expected): void {
    if (($_SERVER["REQUEST_METHOD"] ?? "GET") !== $expected) respond(["success"=>false,"message"=>"Use the " . $expected . " method."],405);
}
function valid_status(string $status, array $allowed): string {
    if (!in_array($status, $allowed, true)) respond(["success"=>false,"message"=>"Invalid status selected."],422);
    return $status;
}
$action = (string)($_GET["action"] ?? "");
try {
    switch ($action) {
        case "health":
            method("GET");
            $conn->query("SELECT 1");
            respond(["success"=>true,"message"=>"Connected to ProcureHub database."]);

        case "dashboard":
            method("GET");
            $suppliers = (int)$conn->query("SELECT COUNT(*) c FROM suppliers")->fetch_assoc()["c"];
            $products = (int)$conn->query("SELECT COUNT(*) c FROM products")->fetch_assoc()["c"];
            $orders = (int)$conn->query("SELECT COUNT(*) c FROM purchase_orders")->fetch_assoc()["c"];
            $pending = (int)$conn->query("SELECT COUNT(*) c FROM purchase_orders WHERE status='Pending Approval'")->fetch_assoc()["c"];
            $active = (int)$conn->query("SELECT COUNT(*) c FROM purchase_orders WHERE status IN ('Approved','Ordered')")->fetch_assoc()["c"];
            $received = (int)$conn->query("SELECT COUNT(*) c FROM purchase_orders WHERE status='Received'")->fetch_assoc()["c"];
            $value = (float)$conn->query("SELECT COALESCE(SUM(quantity*unit_price),0) total FROM purchase_orders WHERE status <> 'Cancelled'")->fetch_assoc()["total"];
            $byStatus = [];
            $r = $conn->query("SELECT status, COUNT(*) count, COALESCE(SUM(quantity*unit_price),0) value FROM purchase_orders GROUP BY status");
            while ($row = $r->fetch_assoc()) $byStatus[] = $row;
            respond(["success"=>true,"stats"=>["suppliers"=>$suppliers,"products"=>$products,"orders"=>$orders,"pending"=>$pending,"active"=>$active,"received"=>$received,"value"=>$value],"by_status"=>$byStatus]);

        case "suppliers":
            method("GET");
            $r = $conn->query("SELECT supplier_id,supplier_name,contact_person,email,phone,category,status,created_at FROM suppliers ORDER BY supplier_id DESC");
            respond(["success"=>true,"data"=>$r->fetch_all(MYSQLI_ASSOC)]);

        case "supplier_create":
            method("POST"); $d=input_data();
            $name=required_text($d,"supplier_name",150); $contact=required_text($d,"contact_person",120);
            $email=required_text($d,"email",190); $phone=required_text($d,"phone",30); $category=required_text($d,"category",100);
            if (!filter_var($email,FILTER_VALIDATE_EMAIL)) respond(["success"=>false,"message"=>"Enter a valid email address."],422);
            $status=valid_status((string)($d["status"]??"Active"),["Active","Inactive"]);
            $s=$conn->prepare("INSERT INTO suppliers(supplier_name,contact_person,email,phone,category,status) VALUES(?,?,?,?,?,?)");
            $s->bind_param("ssssss",$name,$contact,$email,$phone,$category,$status); $s->execute();
            respond(["success"=>true,"message"=>"Supplier added successfully.","id"=>$conn->insert_id],201);

        case "supplier_update":
            method("POST"); $d=input_data(); $id=positive_int($d,"supplier_id");
            $name=required_text($d,"supplier_name",150); $contact=required_text($d,"contact_person",120);
            $email=required_text($d,"email",190); $phone=required_text($d,"phone",30); $category=required_text($d,"category",100);
            if (!filter_var($email,FILTER_VALIDATE_EMAIL)) respond(["success"=>false,"message"=>"Enter a valid email address."],422);
            $status=valid_status((string)($d["status"]??"Active"),["Active","Inactive"]);
            $s=$conn->prepare("UPDATE suppliers SET supplier_name=?,contact_person=?,email=?,phone=?,category=?,status=? WHERE supplier_id=?");
            $s->bind_param("ssssssi",$name,$contact,$email,$phone,$category,$status,$id); $s->execute();
            if (!$s->affected_rows && $s->errno) respond(["success"=>false,"message"=>"Supplier could not be updated."],422);
            respond(["success"=>true,"message"=>"Supplier updated successfully."]);

        case "supplier_delete":
            method("POST"); $d=input_data(); $id=positive_int($d,"supplier_id");
            $s=$conn->prepare("DELETE FROM suppliers WHERE supplier_id=?"); $s->bind_param("i",$id); $s->execute();
            if ($s->affected_rows===0) respond(["success"=>false,"message"=>"Supplier not found or is referenced by existing records."],404);
            respond(["success"=>true,"message"=>"Supplier deleted."]);

        case "products":
            method("GET");
            $r=$conn->query("SELECT product_id,product_code,product_name,category,unit_price,stock_quantity,created_at FROM products ORDER BY product_id DESC");
            respond(["success"=>true,"data"=>$r->fetch_all(MYSQLI_ASSOC)]);

        case "product_create":
            method("POST"); $d=input_data();
            $code=required_text($d,"product_code",40); $name=required_text($d,"product_name",150); $category=required_text($d,"category",100);
            $price=positive_money($d,"unit_price"); $stock=positive_int($d,"stock_quantity",0);
            $s=$conn->prepare("INSERT INTO products(product_code,product_name,category,unit_price,stock_quantity) VALUES(?,?,?,?,?)");
            $s->bind_param("sssdi",$code,$name,$category,$price,$stock); $s->execute();
            respond(["success"=>true,"message"=>"Product added successfully.","id"=>$conn->insert_id],201);

        case "product_update":
            method("POST"); $d=input_data(); $id=positive_int($d,"product_id");
            $code=required_text($d,"product_code",40); $name=required_text($d,"product_name",150); $category=required_text($d,"category",100);
            $price=positive_money($d,"unit_price"); $stock=positive_int($d,"stock_quantity",0);
            $s=$conn->prepare("UPDATE products SET product_code=?,product_name=?,category=?,unit_price=?,stock_quantity=? WHERE product_id=?");
            $s->bind_param("sssdii",$code,$name,$category,$price,$stock,$id); $s->execute();
            respond(["success"=>true,"message"=>"Product updated successfully."]);

        case "product_delete":
            method("POST"); $d=input_data(); $id=positive_int($d,"product_id");
            $s=$conn->prepare("DELETE FROM products WHERE product_id=?"); $s->bind_param("i",$id); $s->execute();
            if ($s->affected_rows===0) respond(["success"=>false,"message"=>"Product not found or referenced by a quotation/order."],404);
            respond(["success"=>true,"message"=>"Product deleted."]);

        case "quotations":
            method("GET");
            $sql="SELECT q.quotation_id,q.supplier_id,q.product_id,q.quantity,q.unit_price,q.quote_date,s.supplier_name,p.product_name,p.product_code,(q.quantity*q.unit_price) total FROM quotations q JOIN suppliers s ON s.supplier_id=q.supplier_id JOIN products p ON p.product_id=q.product_id ORDER BY q.quotation_id DESC";
            $r=$conn->query($sql); respond(["success"=>true,"data"=>$r->fetch_all(MYSQLI_ASSOC)]);

        case "quotation_create":
            method("POST"); $d=input_data(); $sid=positive_int($d,"supplier_id"); $pid=positive_int($d,"product_id");
            $qty=positive_int($d,"quantity"); $price=positive_money($d,"unit_price"); $date=required_text($d,"quote_date",10);
            $dt=DateTime::createFromFormat("Y-m-d",$date); if(!$dt || $dt->format("Y-m-d")!==$date) respond(["success"=>false,"message"=>"Invalid quote date."],422);
            $s=$conn->prepare("INSERT INTO quotations(supplier_id,product_id,quantity,unit_price,quote_date) VALUES(?,?,?,?,?)");
            $s->bind_param("iiids",$sid,$pid,$qty,$price,$date); $s->execute();
            respond(["success"=>true,"message"=>"Quotation saved successfully.","id"=>$conn->insert_id],201);

        case "quotation_delete":
            method("POST"); $d=input_data(); $id=positive_int($d,"quotation_id");
            $s=$conn->prepare("DELETE FROM quotations WHERE quotation_id=?"); $s->bind_param("i",$id); $s->execute();
            if(!$s->affected_rows) respond(["success"=>false,"message"=>"Quotation not found."],404);
            respond(["success"=>true,"message"=>"Quotation deleted."]);

        case "orders":
            method("GET");
            $sql="SELECT po.order_id,po.order_number,po.supplier_id,po.product_id,po.quantity,po.unit_price,po.order_date,po.expected_delivery,po.status,s.supplier_name,p.product_name,(po.quantity*po.unit_price) total FROM purchase_orders po JOIN suppliers s ON s.supplier_id=po.supplier_id JOIN products p ON p.product_id=po.product_id ORDER BY po.order_id DESC";
            $r=$conn->query($sql); respond(["success"=>true,"data"=>$r->fetch_all(MYSQLI_ASSOC)]);

        case "order_create":
            method("POST"); $d=input_data(); $sid=positive_int($d,"supplier_id"); $pid=positive_int($d,"product_id");
            $qty=positive_int($d,"quantity"); $price=positive_money($d,"unit_price");
            $status=valid_status((string)($d["status"]??"Pending Approval"),["Pending Approval","Approved","Ordered","Received","Cancelled"]);
            $delivery=trim((string)($d["expected_delivery"]??"")); if($delivery!==""){ $dt=DateTime::createFromFormat("Y-m-d",$delivery); if(!$dt||$dt->format("Y-m-d")!==$delivery) respond(["success"=>false,"message"=>"Invalid expected delivery date."],422); } else $delivery=null;
            $date=date("Y-m-d"); $conn->begin_transaction();
            try {
                $orderNo="PO-".date("ymd")."-".strtoupper(bin2hex(random_bytes(2)));
                $s=$conn->prepare("INSERT INTO purchase_orders(order_number,supplier_id,product_id,quantity,unit_price,order_date,expected_delivery,status) VALUES(?,?,?,?,?,?,?,?)");
                $s->bind_param("siiidsss",$orderNo,$sid,$pid,$qty,$price,$date,$delivery,$status); $s->execute(); $orderId=$conn->insert_id;
                $s=$conn->prepare("INSERT INTO purchase_order_items(order_id,product_id,quantity,unit_price) VALUES(?,?,?,?)");
                $s->bind_param("iiid",$orderId,$pid,$qty,$price); $s->execute();
                $conn->commit();
            } catch(Throwable $e) { $conn->rollback(); throw $e; }
            respond(["success"=>true,"message"=>"Purchase order ".$orderNo." created successfully.","order_number"=>$orderNo],201);

        case "order_status":
            method("POST"); $d=input_data(); $id=positive_int($d,"order_id");
            $status=valid_status((string)($d["status"]??""),["Pending Approval","Approved","Ordered","Received","Cancelled"]);
            $s=$conn->prepare("UPDATE purchase_orders SET status=? WHERE order_id=?"); $s->bind_param("si",$status,$id); $s->execute();
            respond(["success"=>true,"message"=>"Order status updated."]);

        case "order_delete":
            method("POST"); $d=input_data(); $id=positive_int($d,"order_id");
            $s=$conn->prepare("DELETE FROM purchase_orders WHERE order_id=?"); $s->bind_param("i",$id); $s->execute();
            if(!$s->affected_rows) respond(["success"=>false,"message"=>"Order not found."],404);
            respond(["success"=>true,"message"=>"Purchase order deleted."]);

        default:
            respond(["success"=>false,"message"=>"Unknown API action."],404);
    }
} catch (mysqli_sql_exception $e) {
    error_log("ProcureHub API SQL error for action ".$action.": ".$e->getMessage());
    $message = "The operation could not be completed. Check for duplicate values or records linked to this item.";
    respond(["success"=>false,"message"=>$message],500);
} catch (Throwable $e) {
    error_log("ProcureHub API error for action ".$action.": ".$e->getMessage());
    respond(["success"=>false,"message"=>"Unexpected server error. Check the PHP error log."],500);
}
