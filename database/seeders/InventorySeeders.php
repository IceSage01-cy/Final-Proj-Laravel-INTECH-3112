<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Imports the data from the old PHP project's database.sql.
 * IDs are kept exactly as they were so products still point to the right
 * category and supplier. Run order matters (categories/suppliers before products).
 */
class InventoryDataSeeders extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['category_id' => 1, 'category_name' => 'Electronics', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['category_id' => 2, 'category_name' => 'Furniture', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['category_id' => 3, 'category_name' => 'Office Supplies', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['category_id' => 4, 'category_name' => 'Computer Peripherals', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['category_id' => 5, 'category_name' => 'Stationery', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['category_id' => 6, 'category_name' => 'Stationary', 'created_at' => '2026-08-07 11:39:54', 'updated_at' => '2026-08-07 11:39:54'],
        ]);

        DB::table('suppliers')->insert([
            ['supplier_id' => 1, 'supplier_name' => 'TechSupply Inc.', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['supplier_id' => 2, 'supplier_name' => 'OfficePlus', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['supplier_id' => 3, 'supplier_name' => 'Global Distributors', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['supplier_id' => 4, 'supplier_name' => 'Prime Electronics', 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['supplier_id' => 5, 'supplier_name' => 'Shupeh.ph', 'created_at' => '2026-08-07 11:39:54', 'updated_at' => '2026-08-07 11:39:54'],
            ['supplier_id' => 6, 'supplier_name' => 'Lazado.ph', 'created_at' => '2026-08-07 12:21:57', 'updated_at' => '2026-08-07 12:21:57'],
            ['supplier_id' => 7, 'supplier_name' => 'Office Inc.', 'created_at' => '2026-08-16 16:55:00', 'updated_at' => '2026-08-16 16:55:00'],
        ]);

        DB::table('products')->insert([
            ['product_id' => 1, 'product_name' => 'Laptop Pro X1', 'category_id' => 1, 'supplier_id' => 1, 'stock_qty' => 15, 'price' => 75000.00, 'low_stock_threshold' => 5, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 2, 'product_name' => 'Wireless Mouse', 'category_id' => 4, 'supplier_id' => 1, 'stock_qty' => 50, 'price' => 1500.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 3, 'product_name' => 'Ergonomic Desk Chair', 'category_id' => 2, 'supplier_id' => 2, 'stock_qty' => 8, 'price' => 8500.00, 'low_stock_threshold' => 5, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 4, 'product_name' => 'USB-C Hub 7-in-1', 'category_id' => 4, 'supplier_id' => 3, 'stock_qty' => 25, 'price' => 2500.00, 'low_stock_threshold' => 8, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 5, 'product_name' => 'Premium Paper Ream', 'category_id' => 5, 'supplier_id' => 2, 'stock_qty' => 100, 'price' => 350.00, 'low_stock_threshold' => 20, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 6, 'product_name' => 'Monitor 27-inch 4K', 'category_id' => 1, 'supplier_id' => 4, 'stock_qty' => 12, 'price' => 35000.00, 'low_stock_threshold' => 5, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 7, 'product_name' => 'Standing Desk', 'category_id' => 2, 'supplier_id' => 2, 'stock_qty' => 6, 'price' => 28000.00, 'low_stock_threshold' => 3, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 8, 'product_name' => 'Wireless Keyboard', 'category_id' => 4, 'supplier_id' => 1, 'stock_qty' => 35, 'price' => 2800.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 9, 'product_name' => 'Stapler Heavy Duty', 'category_id' => 5, 'supplier_id' => 3, 'stock_qty' => 60, 'price' => 450.00, 'low_stock_threshold' => 15, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 10, 'product_name' => 'Desktop PC Workstation', 'category_id' => 1, 'supplier_id' => 4, 'stock_qty' => 10, 'price' => 55000.00, 'low_stock_threshold' => 4, 'created_at' => '2026-08-07 11:38:39', 'updated_at' => '2026-08-07 11:38:39'],
            ['product_id' => 11, 'product_name' => 'Pen Pineapple Pen', 'category_id' => 6, 'supplier_id' => 5, 'stock_qty' => 9, 'price' => 110.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-07 11:39:54', 'updated_at' => '2026-08-17 00:56:40'],
            ['product_id' => 12, 'product_name' => 'Kawaii', 'category_id' => 6, 'supplier_id' => 6, 'stock_qty' => 10, 'price' => 1000.00, 'low_stock_threshold' => 5, 'created_at' => '2026-08-07 12:21:57', 'updated_at' => '2026-08-17 01:31:59'],
            ['product_id' => 13, 'product_name' => 'Ballpoint Pen (Box)', 'category_id' => 3, 'supplier_id' => 7, 'stock_qty' => 50, 'price' => 10.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-16 16:55:00', 'updated_at' => '2026-08-16 16:55:00'],
            ['product_id' => 14, 'product_name' => 'ApplePen', 'category_id' => 6, 'supplier_id' => 5, 'stock_qty' => 11, 'price' => 120.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-16 23:44:15', 'updated_at' => '2026-08-16 23:45:00'],
            ['product_id' => 15, 'product_name' => 'Office chair', 'category_id' => 3, 'supplier_id' => 7, 'stock_qty' => 100, 'price' => 2500.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-17 00:36:55', 'updated_at' => '2026-08-17 00:36:55'],
            ['product_id' => 16, 'product_name' => 'Office table', 'category_id' => 3, 'supplier_id' => 7, 'stock_qty' => 100, 'price' => 3000.00, 'low_stock_threshold' => 10, 'created_at' => '2026-08-17 00:38:46', 'updated_at' => '2026-08-17 00:38:46'],
        ]);

        // Password hashes are copied as-is, so the old passwords still work.
        // The admin hash used the "$2b$" prefix; it is rewritten to "$2y$"
        // (same bcrypt algorithm) because Laravel only accepts "$2y$".
        DB::table('users')->insert([
            ['user_id' => 1, 'username' => 'admin', 'password' => '$2y$10$yUdaWWcASOkM4DpEQ.W9g.aMkjTQGvG6jiI.gCmSiblfT.KjfQFcm', 'role' => 'admin', 'created_at' => '2026-08-17 00:08:26', 'updated_at' => '2026-08-17 00:08:26'],
            ['user_id' => 2, 'username' => 'user', 'password' => '$2y$10$WjFyt5ZvUPHdHrrH8OK5NujozSDd98TmzLdXg.NJza8LnJgpHeVgO', 'role' => 'employee', 'created_at' => '2026-08-17 00:16:25', 'updated_at' => '2026-08-17 00:16:25'],
            ['user_id' => 3, 'username' => 'New', 'password' => '$2y$10$ylrFzUgRdRLGetzl9Il0O.adVCa5CVijmtz5iY6N.TT0fUKD0EkTe', 'role' => 'employee', 'created_at' => '2026-08-17 00:39:32', 'updated_at' => '2026-08-17 00:39:32'],
        ]);
    }
}