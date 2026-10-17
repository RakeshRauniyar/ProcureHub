<?php
header("Content-Type: text/plain; charset=UTF-8");
echo "PHP is working correctly.\n";
echo "PHP version: " . PHP_VERSION . "\n";
echo "MySQLi extension: " . (extension_loaded("mysqli") ? "available" : "not available") . "\n";
