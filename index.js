const API_BASE_URL = 'http://localhost:3000/inventory';
let inventory = []; // Store inventory locally for filtering

// Request notification permission and fetch inventory on page load
window.onload = function() {
    console.log('Page loaded, initializing...');
    if (!("Notification" in window)) {
        alert("This browser does not support notifications");
    } else if (Notification.permission === "default") {
        Notification.requestPermission();
    }
    fetchInventory();
    setupEventListeners();
};

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    const checkStockBtn = document.getElementById('check-stock-btn');
    const addItemForm = document.getElementById('add-item-form');
    const searchBtn = document.getElementById('search-btn');
    const addItemBtn = document.getElementById('add-item-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (!checkStockBtn || !addItemForm || !searchBtn || !addItemBtn || !cancelBtn) {
        console.error('One or more elements not found:', {
            checkStockBtn, addItemForm, searchBtn, addItemBtn, cancelBtn
        });
        alert('Initialization error: Some elements are missing. Check console for details.');
        return;
    }

    checkStockBtn.addEventListener('click', checkLowStock);
    addItemForm.addEventListener('submit', handleFormSubmit);
    searchBtn.addEventListener('click', handleSearch);
    addItemBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
}

// Fetch inventory from json-server
async function fetchInventory() {
    try {
        console.log('Fetching inventory from', API_BASE_URL);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`Failed to fetch inventory: ${response.statusText}`);
        inventory = await response.json();
        console.log('Fetched inventory:', inventory);
        renderInventory(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Failed to load inventory from server. Please ensure json-server is running at http://localhost:3000/inventory.');
        inventory = [];
        renderInventory(inventory);
    }
}

// Render table
function renderInventory(items) {
    console.log('Rendering inventory:', items);
    const tbody = document.getElementById('inventory-body');
    if (!tbody) {
        console.error('Inventory body element not found');
        return;
    }
    tbody.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        const statusText = item.quantity < item.minStock ? 'Low Stock' : 'In Stock';
        const statusClass = item.quantity < item.minStock ? 'low-stock' : 'in-stock';
        const tick = item.quantity >= item.minStock ? '<span class="tick">✔</span>' : '';
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.minStock}</td>
            <td class="${statusClass}">${statusText}${tick}</td>
        `;
        tbody.appendChild(row);
    });
}

// Send low stock alert
function sendLowStockAlert(item) {
    const message = `Low Stock Alert: ${item.name} has ${item.quantity} units, below minimum of ${item.minStock}`;
    console.log(`Message sent to storekeeper: ${message}`);
    if (Notification.permission === "granted") {
        new Notification("Low Stock Alert", {
            body: message,
            icon: 'https://via.placeholder.com/64'
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Low Stock Alert", {
                    body: message,
                    icon: 'https://via.placeholder.com/64'
                });
            }
        });
    }
}

// Handle low stock check
function checkLowStock() {
    console.log('Checking low stock');
    const lowStockItems = inventory.filter(item => item.quantity < item.minStock);
    lowStockItems.forEach(item => sendLowStockAlert(item));
    alert(lowStockItems.length > 0 ? 'Low stock check completed. Check console for alerts.' : 'No low stock items found.');
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    const nameInput = document.getElementById('item-name');
    const quantityInput = document.getElementById('item-quantity');
    const minStockInput = document.getElementById('min-stock');

    if (!nameInput || !quantityInput || !minStockInput) {
        console.error('Form inputs not found');
        alert('Form error: Input fields are missing.');
        return;
    }

    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const minStock = parseInt(minStockInput.value);

    if (name && !isNaN(quantity) && quantity >= 0 && !isNaN(minStock) && minStock >= 0) {
        saveItem({ name, quantity, minStock });
    } else {
        console.error('Invalid form inputs:', { name, quantity, minStock });
        alert('Please fill all fields with valid values (non-empty name, non-negative numbers).');
    }
}

// Save new item
async function saveItem(item) {
    try {
        console.log('Saving item:', item);
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: item.name,
                quantity: item.quantity,
                minStock: item.minStock
            })
        });
        if (!response.ok) throw new Error(`Failed to save item: ${response.statusText}`);
        console.log('Item saved successfully');
        await fetchInventory();
        if (item.quantity < item.minStock) {
            sendLowStockAlert(item);
        }
        closeModal();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item to server. Please ensure json-server is running at http://localhost:3000/inventory.');
    }
}

// Handle search button click
function handleSearch() {
    console.log('Search button clicked');
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) {
        console.error('Search bar not found');
        alert('Search error: Search bar is missing.');
        return;
    }
    const searchTerm = searchBar.value.trim().toLowerCase();
    const filteredInventory = searchTerm
        ? inventory.filter(item => item.name.toLowerCase().includes(searchTerm))
        : inventory;
    console.log('Filtered inventory:', filteredInventory);
    renderInventory(filteredInventory);
}

// Open modal
function openModal() {
    console.log('Opening modal');
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Modal element not found');
    }
}

// Close modal and clear form
function closeModal() {
    console.log('Closing modal');
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        clearForm();
    } else {
        console.error('Modal element not found');
    }
}

function clearForm() {
    const nameInput = document.getElementById('item-name');
    const quantityInput = document.getElementById('item-quantity');
    const minStockInput = document.getElementById('min-stock');
    if (nameInput && quantityInput && minStockInput) {
        nameInput.value = '';
        quantityInput.value = '';
        minStockInput.value = '';
    } else {
        console.error('Form inputs not found during clear');
    }
}