
/* ProcureHub Review 02/03 - API-driven frontend */

"use strict";

const API = "api.php?action=";
const $ = id => document.getElementById(id);

const state = {
    suppliers: [],
    products: [],
    quotations: [],
    orders: [],
    dashboard: null,
    chart: null,
    notifications: []
};

const STATUS = [
    "Pending Approval",
    "Approved",
    "Ordered",
    "Received",
    "Cancelled"
];

const TITLES = {
    dashboard: "Dashboard Overview",
    suppliers: "Supplier Directory",
    products: "Product Catalogue",
    quotations: "Quotation Comparison",
    orders: "Purchase Order Management",
    reports: "Procurement Reports"
};

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[ch]));
}

function money(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(value || 0));
}

function dateText(value) {
    if (!value) return "—";

    const d = new Date(`${value}T00:00:00`);

    return Number.isNaN(d.getTime())
        ? escapeHTML(value)
        : d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}

function statusClass(status) {
    return String(status || "")
        .toLowerCase()
        .replace(/[^a-z]+/g, "-")
        .replace(/^-|-$/g, "");
}

function badge(status) {
    return `<span class="badge ${statusClass(status)}">${escapeHTML(status)}</span>`;
}

function toast(message, type = "success") {
    const region = $("toast-region");
    if (!region) return;

    const el = document.createElement("div");
    el.className = `toast ${type === "error" ? "error" : ""}`;
    el.textContent = message;
    region.append(el);

    window.setTimeout(() => el.remove(), 4200);
}

async function api(action, data = null) {
    const response = await fetch(API + encodeURIComponent(action), {
        method: data === null ? "GET" : "POST",
        headers: data === null
            ? { "Accept": "application/json" }
            : {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        body: data === null ? undefined : JSON.stringify(data)
    });

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error(
            "The server returned an invalid response. Check PHP errors."
        );
    }

    if (!response.ok || result.success === false) {
        throw new Error(
            result.message || `Request failed (${response.status}).`
        );
    }

    return result;
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.toggle("active-page", p.id === pageId);
    });

    document.querySelectorAll(".nav-link").forEach(b => {
        b.classList.toggle("active", b.dataset.page === pageId);
    });

    if ($("page-title")) {
        $("page-title").textContent = TITLES[pageId] || "ProcureHub";
    }

    if ($("sidebar")) {
        $("sidebar").classList.remove("open");
    }
}

document.querySelectorAll("[data-page]").forEach(b => {
    b.addEventListener("click", () => showPage(b.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(b => {
    b.addEventListener("click", () => showPage(b.dataset.go));
});

$("menu-toggle").addEventListener("click", () => {
    $("sidebar").classList.toggle("open");
});

document.querySelectorAll("[data-close]").forEach(b => {
    b.addEventListener("click", () => {
        const form = $(b.dataset.close);

        if (form) {
            if (typeof form.reset === "function") form.reset();
            form.hidden = true;
        }
    });
});

$("refresh-button").addEventListener("click", () => refreshAll(true));

async function refreshAll(showMessage = false) {
    try {
        const [
            suppliers,
            products,
            quotations,
            orders,
            dashboard
        ] = await Promise.all([
            api("suppliers"),
            api("products"),
            api("quotations"),
            api("orders"),
            api("dashboard")
        ]);

        state.suppliers = suppliers.data;
        state.products = products.data;
        state.quotations = quotations.data;
        state.orders = orders.data;
        state.dashboard = dashboard;

        $("connection-text").textContent = "Database connected";
        $("connection-text").parentElement.classList.add("connected");
        $("connection-text").parentElement.classList.remove("error");

        renderAll();

        if (showMessage) {
            toast("Data refreshed from the database.");
        }
    } catch (error) {
        $("connection-text").textContent = "Database unavailable";
        $("connection-text").parentElement.classList.add("error");
        $("connection-text").parentElement.classList.remove("connected");

        toast(
            error.message + " Start Apache/MySQL and import database.sql.",
            "error"
        );

        renderAll();
    }
}

function renderAll() {
    renderSuppliers();
    renderProducts();
    renderQuotations();
    renderOrders();
    renderDashboard();
    populateSelects();
}

function renderSuppliers() {
    const term = ($("supplier-search").value || "").toLowerCase();

    const rows = state.suppliers.filter(s =>
        [
            s.supplier_name,
            s.contact_person,
            s.email,
            s.phone,
            s.category,
            s.status
        ].some(v => String(v || "").toLowerCase().includes(term))
    );

    $("supplier-table").innerHTML = rows.length
        ? rows.map(s => `
            <tr>
                <td class="company-name">${escapeHTML(s.supplier_name)}</td>
                <td>${escapeHTML(s.contact_person)}</td>
                <td>${escapeHTML(s.email)}</td>
                <td>${escapeHTML(s.phone)}</td>
                <td>${escapeHTML(s.category)}</td>
                <td>${badge(s.status)}</td>
                <td>
                    <div class="row-actions">
                        <button class="action-button"
                            data-edit-supplier="${s.supplier_id}">Edit</button>
                        <button class="action-button danger"
                            data-delete-supplier="${s.supplier_id}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="7" class="empty-state">${
            state.suppliers.length
                ? "No suppliers match your search."
                : "No suppliers yet. Add a supplier to begin."
        }</td></tr>`;

    $("supplier-count").textContent = state.suppliers.length;
    $("report-supplier-count").textContent = state.suppliers.length;

    $("supplier-total-label").textContent =
        `${state.suppliers.length} supplier${state.suppliers.length === 1 ? "" : "s"}`;
}

function renderProducts() {
    const term = ($("product-search").value || "").toLowerCase();

    const rows = state.products.filter(p =>
        [p.product_code, p.product_name, p.category]
            .some(v => String(v || "").toLowerCase().includes(term))
    );

    $("product-table").innerHTML = rows.length
        ? rows.map(p => `
            <tr>
                <td>${escapeHTML(p.product_code)}</td>
                <td class="company-name">${escapeHTML(p.product_name)}</td>
                <td>${escapeHTML(p.category)}</td>
                <td>${money(p.unit_price)}</td>
                <td>${Number(p.stock_quantity)}</td>
                <td>
                    <div class="row-actions">
                        <button class="action-button"
                            data-edit-product="${p.product_id}">Edit</button>
                        <button class="action-button danger"
                            data-delete-product="${p.product_id}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="6" class="empty-state">${
            state.products.length
                ? "No products match your search."
                : "No products available."
        }</td></tr>`;

    $("product-total-label").textContent =
        `${state.products.length} product${state.products.length === 1 ? "" : "s"}`;
}

function renderQuotations() {
    const term = ($("quotation-search").value || "").toLowerCase();

    const rows = state.quotations.filter(q =>
        [q.product_name, q.supplier_name, q.product_code]
            .some(v => String(v || "").toLowerCase().includes(term))
    );

    $("quotation-table").innerHTML = rows.length
        ? rows.map(q => `
            <tr>
                <td class="company-name">
                    ${escapeHTML(q.product_name)}
                    <small>${escapeHTML(q.product_code)}</small>
                </td>
                <td>${escapeHTML(q.supplier_name)}</td>
                <td>${Number(q.quantity)}</td>
                <td>${money(q.unit_price)}</td>
                <td class="company-name">${money(q.total)}</td>
                <td>${dateText(q.quote_date)}</td>
                <td>
                    <button class="action-button danger"
                        data-delete-quotation="${q.quotation_id}">Delete</button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="7" class="empty-state">${
            state.quotations.length
                ? "No quotations match your search."
                : "No quotations yet. Add a quotation to compare offers."
        }</td></tr>`;

    $("quotation-total-label").textContent =
        `${state.quotations.length} quotation${state.quotations.length === 1 ? "" : "s"}`;
}

function filteredOrders() {
    const term = ($("order-search").value || "").toLowerCase();
    const status = $("order-filter").value;

    return state.orders.filter(o =>
        (!status || o.status === status) &&
        [o.order_number, o.supplier_name, o.product_name]
            .some(v => String(v || "").toLowerCase().includes(term))
    );
}

function renderOrders() {
    const rows = filteredOrders();

    $("order-table").innerHTML = rows.length
        ? rows.map(o => `
            <tr>
                <td class="company-name">${escapeHTML(o.order_number)}</td>
                <td>${escapeHTML(o.supplier_name)}</td>
                <td>${escapeHTML(o.product_name)}</td>
                <td>${dateText(o.order_date)}</td>
                <td>${Number(o.quantity)}</td>
                <td>${money(o.total)}</td>
                <td>
                    <select class="inline-status"
                        data-order-status="${o.order_id}"
                        aria-label="Status for ${escapeHTML(o.order_number)}">
                        ${STATUS.map(s =>
                            `<option ${s === o.status ? "selected" : ""}>${s}</option>`
                        ).join("")}
                    </select>
                </td>
                <td>
                    <button class="action-button danger"
                        data-delete-order="${o.order_id}">Delete</button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="8" class="empty-state">
            No purchase orders match the selected filters.
        </td></tr>`;

    $("recent-orders").innerHTML = state.orders.length
        ? [...state.orders].slice(0, 5).map(o => `
            <tr>
                <td class="company-name">${escapeHTML(o.order_number)}</td>
                <td>${escapeHTML(o.supplier_name)}</td>
                <td>${dateText(o.order_date)}</td>
                <td>${money(o.total)}</td>
                <td>${badge(o.status)}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="5" class="empty-state">
            No purchase orders yet.
        </td></tr>`;

    $("order-total-label").textContent =
        `${rows.length} of ${state.orders.length} orders`;
}

function renderDashboard() {
    const d = state.dashboard?.stats || {
        suppliers: state.suppliers.length,
        products: state.products.length,
        orders: state.orders.length,
        pending: 0,
        active: 0,
        received: 0,
        value: 0
    };

    $("supplier-count").textContent = d.suppliers;
    $("active-count").textContent = d.active;
    $("pending-count").textContent = d.pending;
    $("purchase-value").textContent = money(d.value);

    $("report-order-count").textContent = d.orders;
    $("report-supplier-count").textContent = d.suppliers;
    $("report-value").textContent = money(d.value);
    $("report-received").textContent = d.received;

    renderStatusSummary($("dashboard-status"), true);
    renderStatusSummary($("status-summary"), false);
    renderChart();

    state.notifications = [];

    const pending = state.orders.filter(
        o => o.status === "Pending Approval"
    ).length;

    if (pending) {
        state.notifications.push(
            `${pending} purchase order${pending === 1 ? " is" : "s are"} waiting for approval.`
        );
    }

    const inactive = state.suppliers.filter(
        s => s.status === "Inactive"
    ).length;

    if (inactive) {
        state.notifications.push(
            `${inactive} supplier record${inactive === 1 ? " is" : "s are"} marked inactive.`
        );
    }

    if (!state.notifications.length) {
        state.notifications.push(
            "You're all caught up. No pending alerts."
        );
    }

    $("notification-dot").style.display =
        state.orders.some(o => o.status === "Pending Approval")
            ? "block"
            : "none";
}

function renderStatusSummary(target, compact) {
    const statuses = [
        "Pending Approval",
        "Approved",
        "Ordered",
        "Received",
        "Cancelled"
    ];

    const counts = Object.fromEntries(
        statuses.map(s => [
            s,
            state.orders.filter(o => o.status === s).length
        ])
    );

    target.innerHTML = statuses.map(s => {
        const count = counts[s];
        const pct = state.orders.length
            ? count / state.orders.length * 100
            : 0;

        return `
            <div class="status-row">
                <span>${escapeHTML(s)}</span>
                <div class="progress-track">
                    <div class="progress-bar" style="width:${pct}%"></div>
                </div>
                <strong>${count}</strong>
            </div>
        `;
    }).join("");
}

function renderChart() {
    if (typeof Chart === "undefined") return;

    const statuses = [
        "Pending Approval",
        "Approved",
        "Ordered",
        "Received",
        "Cancelled"
    ];

    const values = statuses.map(s =>
        state.orders
            .filter(o => o.status === s)
            .reduce((sum, o) => sum + Number(o.total), 0)
    );

    const canvas = $("orders-chart");
    if (!canvas) return;

    if (state.chart) state.chart.destroy();

    state.chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: statuses,
            datasets: [{
                label: "Order value (₹)",
                data: values,
                backgroundColor: [
                    "#e6a23c",
                    "#4381ed",
                    "#8b70db",
                    "#31a978",
                    "#d85d5d"
                ],
                borderRadius: 6,
                maxBarThickness: 38
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: c => money(c.raw)
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v =>
                            new Intl.NumberFormat("en-IN", {
                                notation: "compact"
                            }).format(v)
                    },
                    grid: { color: "#eef1f6" }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

function populateSelects() {
    const supplierOptions = state.suppliers
        .filter(s => s.status === "Active")
        .map(s =>
            `<option value="${s.supplier_id}">${escapeHTML(s.supplier_name)}</option>`
        ).join("");

    const productOptions = state.products
        .map(p =>
            `<option value="${p.product_id}" data-price="${Number(p.unit_price)}">${escapeHTML(p.product_name)} (${escapeHTML(p.product_code)})</option>`
        ).join("");

    ["order-supplier", "quote-supplier"].forEach(id => {
        const el = $(id);
        const old = el.value;

        el.innerHTML = supplierOptions ||
            '<option value="">Add an active supplier first</option>';

        if ([...el.options].some(o => o.value === old)) {
            el.value = old;
        }
    });

    ["order-product", "quote-product"].forEach(id => {
        const el = $(id);
        const old = el.value;

        el.innerHTML = productOptions ||
            '<option value="">Add a product first</option>';

        if ([...el.options].some(o => o.value === old)) {
            el.value = old;
        }
    });

    const quoteForm = $("quotation-form");
    if (quoteForm) {
        const quoteDate = quoteForm.elements.quote_date;

        if (quoteDate && !quoteDate.value) {
            quoteDate.value = new Date().toISOString().slice(0, 10);
        }
    }

    updateOrderTotal();
}

function openForm(id) {
    const form = $(id);
    if (!form) return;

    form.hidden = false;
    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

$("add-supplier-btn").addEventListener("click", () => {
    $("supplier-form").reset();
    $("supplier-form").querySelector("h3").textContent = "Add Supplier";
    $("supplier-form").dataset.editId = "";
    openForm("supplier-form");
});

$("add-product-btn").addEventListener("click", () => {
    $("product-form").reset();
    $("product-form").querySelector("h3").textContent = "Add Product";
    $("product-form").dataset.editId = "";
    openForm("product-form");
});

$("add-quotation-btn").addEventListener("click", () => {
    $("quotation-form").reset();
    populateSelects();
    openForm("quotation-form");
});

$("add-order-btn").addEventListener("click", () => {
    if (
        !state.suppliers.some(s => s.status === "Active") ||
        !state.products.length
    ) {
        toast(
            "Add at least one active supplier and one product first.",
            "error"
        );
        return;
    }

    $("order-form").reset();
    populateSelects();
    openForm("order-form");
});

$("order-product").addEventListener("change", () => {
    const p = $("order-product").selectedOptions[0];

    if (p) {
        $("order-price").value = p.dataset.price || "";
    }

    updateOrderTotal();
});

$("order-form").elements.quantity.addEventListener(
    "input",
    updateOrderTotal
);

$("order-price").addEventListener("input", updateOrderTotal);

function updateOrderTotal() {
    const form = $("order-form");
    if (!form) return;

    const q = Number(form.elements.quantity.value || 0);
    const p = Number($("order-price").value || 0);

    $("order-total").textContent = money(
        q > 0 && p > 0 ? q * p : 0
    );
}

$("supplier-search").addEventListener("input", renderSuppliers);
$("product-search").addEventListener("input", renderProducts);
$("quotation-search").addEventListener("input", renderQuotations);
$("order-search").addEventListener("input", renderOrders);
$("order-filter").addEventListener("change", renderOrders);

$("supplier-form").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const editId = form.dataset.editId;

    try {
        await api(
            editId ? "supplier_update" : "supplier_create",
            editId
                ? { ...data, supplier_id: Number(editId) }
                : data
        );

        toast(
            editId
                ? "Supplier updated."
                : "Supplier saved to database."
        );

        form.reset();
        form.hidden = true;
        delete form.dataset.editId;

        await refreshAll();
    } catch (err) {
        toast(err.message, "error");
    }
});

$("product-form").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const editId = form.dataset.editId;

    data.unit_price = Number(data.unit_price);
    data.stock_quantity = Number(data.stock_quantity);

    try {
        await api(
            editId ? "product_update" : "product_create",
            editId
                ? { ...data, product_id: Number(editId) }
                : data
        );

        toast(
            editId
                ? "Product updated."
                : "Product saved to database."
        );

        form.reset();
        form.hidden = true;
        delete form.dataset.editId;

        await refreshAll();
    } catch (err) {
        toast(err.message, "error");
    }
});

/* FIXED: Keep a stable form reference before awaiting the API. */
$("quotation-form").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));

    d.supplier_id = Number(d.supplier_id);
    d.product_id = Number(d.product_id);
    d.quantity = Number(d.quantity);
    d.unit_price = Number(d.unit_price);

    try {
        await api("quotation_create", d);

        toast("Quotation saved to database.");

        form.reset();
        form.hidden = true;

        await refreshAll();
    } catch (err) {
        toast(err.message, "error");
    }
});

/* FIXED: Apply the same protection to purchase orders. */
$("order-form").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));

    d.supplier_id = Number(d.supplier_id);
    d.product_id = Number(d.product_id);
    d.quantity = Number(d.quantity);
    d.unit_price = Number(d.unit_price);

    try {
        const r = await api("order_create", d);

        toast(r.message);

        form.reset();
        form.hidden = true;

        await refreshAll();
    } catch (err) {
        toast(err.message, "error");
    }
});

document.addEventListener("click", async e => {
    const editS = e.target.closest("[data-edit-supplier]");
    const delS = e.target.closest("[data-delete-supplier]");
    const editP = e.target.closest("[data-edit-product]");
    const delP = e.target.closest("[data-delete-product]");
    const delQ = e.target.closest("[data-delete-quotation]");
    const delO = e.target.closest("[data-delete-order]");

    try {
        if (editS) {
            const s = state.suppliers.find(
                x => Number(x.supplier_id) ===
                    Number(editS.dataset.editSupplier)
            );

            if (!s) return;

            const f = $("supplier-form");
            f.reset();
            f.dataset.editId = s.supplier_id;
            f.querySelector("h3").textContent = "Edit Supplier";

            for (const [k, v] of Object.entries({
                supplier_name: s.supplier_name,
                contact_person: s.contact_person,
                email: s.email,
                phone: s.phone,
                category: s.category,
                status: s.status
            })) {
                f.elements[k].value = v;
            }

            openForm("supplier-form");
        } else if (delS) {
            if (!confirm(
                "Delete this supplier? Records referenced by quotations or orders cannot be deleted."
            )) return;

            await api("supplier_delete", {
                supplier_id: Number(delS.dataset.deleteSupplier)
            });

            toast("Supplier deleted.");
            await refreshAll();
        } else if (editP) {
            const p = state.products.find(
                x => Number(x.product_id) ===
                    Number(editP.dataset.editProduct)
            );

            if (!p) return;

            const f = $("product-form");
            f.reset();
            f.dataset.editId = p.product_id;
            f.querySelector("h3").textContent = "Edit Product";

            for (const [k, v] of Object.entries({
                product_code: p.product_code,
                product_name: p.product_name,
                category: p.category,
                unit_price: p.unit_price,
                stock_quantity: p.stock_quantity
            })) {
                f.elements[k].value = v;
            }

            openForm("product-form");
        } else if (delP) {
            if (!confirm(
                "Delete this product? Products referenced by quotations or orders cannot be deleted."
            )) return;

            await api("product_delete", {
                product_id: Number(delP.dataset.deleteProduct)
            });

            toast("Product deleted.");
            await refreshAll();
        } else if (delQ) {
            if (!confirm("Delete this quotation?")) return;

            await api("quotation_delete", {
                quotation_id: Number(delQ.dataset.deleteQuotation)
            });

            toast("Quotation deleted.");
            await refreshAll();
        } else if (delO) {
            if (!confirm("Delete this purchase order?")) return;

            await api("order_delete", {
                order_id: Number(delO.dataset.deleteOrder)
            });

            toast("Purchase order deleted.");
            await refreshAll();
        }
    } catch (err) {
        toast(err.message, "error");
    }
});

document.addEventListener("change", async e => {
    const select = e.target.closest("[data-order-status]");
    if (!select) return;

    try {
        await api("order_status", {
            order_id: Number(select.dataset.orderStatus),
            status: select.value
        });

        toast("Purchase order status updated.");
        await refreshAll();
    } catch (err) {
        toast(err.message, "error");
        await refreshAll();
    }
});

$("notifications-button").addEventListener("click", () => {
    const pop = $("notification-popover");
    pop.hidden = !pop.hidden;

    if (!pop.hidden) {
        $("notification-list").innerHTML =
            state.notifications.map(n =>
                `<div class="notification-item">${escapeHTML(n)}</div>`
            ).join("");
    }
});

$("close-notifications").addEventListener("click", () => {
    $("notification-popover").hidden = true;
});

$("export-report").addEventListener("click", () => {
    const headers = [
        "Order ID",
        "Supplier",
        "Product",
        "Order Date",
        "Quantity",
        "Unit Price",
        "Total",
        "Status",
        "Expected Delivery"
    ];

    const rows = state.orders.map(o => [
        o.order_number,
        o.supplier_name,
        o.product_name,
        o.order_date,
        o.quantity,
        o.unit_price,
        o.total,
        o.status,
        o.expected_delivery || ""
    ]);

    const quote = v =>
        `"${String(v ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
        .map(r => r.map(quote).join(","))
        .join("\r\n");

    const url = URL.createObjectURL(
        new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8"
        })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "procurehub-procurement-report.csv";
    a.click();

    URL.revokeObjectURL(url);
    toast("CSV report exported.");
});

$("print-report").addEventListener("click", () => {
    showPage("reports");
    window.print();
});

refreshAll();
