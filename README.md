# Jenga Inventory Management System

## Overview

A single-page web app to manage inventory using HTML, CSS, JavaScript, and json-server. Features:

- View inventory table (ID, Name, Quantity, Min Stock, Status).
- Search items by name (Search button).
- Add items via modal form, saved to db.json.
- Check low stock with browser/console alerts.

## Project Structure

```
phase-1-jenga/
├── index.html    # HTML with table, search, and modal
├── styles.css    # Styles for layout and UI
├── script.js     # Logic for events and API calls
├── db.json       # Inventory data
└── README.md     # This file
```

## Setup

Ensure Node.js >=20:

```bash
node -v
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
nvm use 20
```

Install json-server:

```bash
cd ~/phase-1-jenga
npm install json-server
```

## Run json-server

```bash
npx json-server --watch db.json
```

Check [http://localhost:3000/inventory](http://localhost:3000/inventory).  
If port 3000 is busy:

```bash
npx json-server --watch db.json --port 3000
```

Update `script.js`:

```js
const API_BASE_URL = 'http://localhost:3001/inventory';
```

Open [http://localhost:8000](http://localhost:8000).

## Usage

- **View:** Table shows 5+ items from db.json.
- **Search:** Type in search bar, click Search to filter items.
- **Add Item:** Click Add New Item, enter valid data, click Save.
- **Check Low Stock:** Click Check Low Stock for alerts.
- **Notifications:** Allow browser notifications for low stock.

## Author

Felona Jepchumba  
[GitHub](https://github.com/Fench-hub/phase-1-jenga)

## License

This project is for educational purposes.