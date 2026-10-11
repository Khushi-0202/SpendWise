# ✦ SpendWise - Modern Interactive Expense Tracker

[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success)](#-tech-stack)
[![Currency: INR](https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-indigo)](#-key-features)

**SpendWise** is a personal finance and expense tracking web application crafted with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. It delivers real-time validation, dynamic SVG analytics, an interactive guided user onboarding walkthrough, and local persistence—without relying on heavy frameworks or external servers.

---

## 🌟 Key Features

### 🇮🇳 Indian Rupee (₹) First Design
- Tailored specifically for Indian Rupee tracking with custom SVG currency branding and favicon.
- **Quick Preset Chips**: Increment amounts in one click with Indian denominations (`+₹100`, `+₹500`, `+₹1,000`, `+₹2,000`, `+₹5,000`).
- Realistic pre-loaded sample data formatted in INR (Salary, Rent, Groceries, Freelance, Utilities).

### 📖 Interactive User Onboarding Guide
- Built-in **"How to Use" Modal** accessible directly from the header navigation or the empty state view.
- 4-step walkthrough explaining transaction types, input rules, analytics interpretation, and CSV exports.
- Includes a *"Don't show this again"* preference persisted in browser storage.

### 🛡️ Real-Time Form Validation
- **Live Character Counter**: Description length counter with minimum 2 and maximum 40 character limits.
- **Positive Number Enforcer**: Validates positive amounts instantly on blur and form submission.
- **Modern CSS Selectors**: Utilizes `:user-invalid` and `:user-valid` pseudo-classes for non-intrusive feedback.
- **Interactive Micro-Animations**: Smooth shake animations on invalid inputs with contextual error messages.

### 📊 Dynamic Visual Analytics & Dashboard
- **Interactive SVG Donut Chart**: Renders category spending distribution with color-coded slices.
- **Top Expense Highlight**: Instantly flags the largest spending category in real time.
- **Category Progress Bars**: Visual breakdown of expenses with categorized emoji badges and percentages.
- **Financial Health Cards**:
  - **Total Balance**: Live surplus vs. deficit status indicator.
  - **Total Income & Expenses**: Inflow and outflow tags.
  - **Savings Rate Meter**: Dynamic progress bar calculating savings percentage of income.

### ⚡ Transaction Management
- **Segmented Type Switcher**: Fast toggle between **Expense** and **Income** with dynamic category updates.
- **Instant Search**: Search transactions across descriptions and categories in real time.
- **Filter Pills**: One-click filtering for **All**, **Expenses**, and **Income**.
- **4-Way Sorting**: Sort by *Newest First*, *Oldest First*, *Highest Amount*, or *Lowest Amount*.
- **5-Second Undo Toast**: Accidental deletions can be reversed with a single click.
- **Export to CSV**: Download your complete transaction history formatted for Excel or Google Sheets.
- **Accessible `<dialog>` Modal**: Confirmation prompt before clearing transaction history.

### 🎨 Design System & Accessibility
- **Dark & Light Mode**: Smooth theme transitions with glassmorphism cards and vibrant color accents.
- **Responsive Layout**: Two-column layout on desktops transitioning into a mobile-first stacked view.
- **Accessible HTML5**: Keyboard-friendly navigation, ARIA attributes, semantic tags, and native `<dialog>` elements.
- **Zero Cloud Tracking**: All financial records stay 100% private in your browser's `localStorage`.

---

## 📁 Project Structure

```text
SpendWise/
├── .github/                  # (Optional) GitHub configuration & workflows
├── .gitattributes            # Cross-platform LF line endings configuration
├── .gitignore                # Ignored files (system, logs, temp, node/python)
├── LICENSE                   # Open-source MIT License
├── README.md                 # Complete project documentation
├── app.js                    # Core logic, state management, validation & analytics
├── index.html                # Semantic HTML5 markup, dashboard & modal dialogs
├── package.json              # Project metadata & npm preview scripts
├── requirements.txt          # Environment details & optional dev server info
└── style.css                 # Vanilla CSS design system, themes & animations
```

---

## 🚀 Getting Started

Because SpendWise is built entirely with client-side web technologies, **no build step, compilers, or database installations are needed**.

### Option 1: Direct File Open (Easiest)
1. Clone or download this repository.
2. Double-click `index.html` to open it in Chrome, Edge, Firefox, Safari, or Brave.

### Option 2: VS Code Live Server
1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (`ritwickdey.LiveServer`).
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Python Built-In Server
If you have Python installed, open your terminal in this directory and run:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Option 4: Node.js / NPX
If you have Node.js installed, run:
```bash
npx serve .
```
or
```bash
npm start
```

---

## 🌐 Deploy to GitHub Pages

You can host SpendWise online for free using GitHub Pages in under a minute:

1. Push this repository to your GitHub account.
2. Go to your repository on GitHub and open **Settings** (`Settings` tab).
3. Scroll down on the left sidebar and click on **Pages**.
4. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
5. Set branch to `main` (or `master`) and directory to `/ (root)`, then click **Save**.
6. GitHub will generate your live public link (e.g., `https://<your-username>.github.io/<repo-name>/`).

---

## 💻 Git & GitHub Upload Instructions

If you haven't uploaded this project to GitHub yet, follow these commands in your project terminal:

```bash
# 1. Initialize local Git repository
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial commit for SpendWise expense tracker"

# 4. Set the default branch to main
git branch -M main

# 5. Connect your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessible dialogs (`<dialog>`), form input elements |
| **CSS3** | Custom design system, CSS variables, glassmorphism, flexbox/grid, `:user-invalid` styling |
| **JavaScript (ES6+)** | State management, dynamic DOM rendering, SVG chart generation, LocalStorage sync |
| **SVG** | Scalable currency icons, vector illustrations, and dynamic donut chart arcs |
| **Google Fonts** | Modern typography using *Plus Jakarta Sans* and *JetBrains Mono* |

---

## 🔒 Privacy & Data Storage

- All transactions, user preferences, and theme choices are stored directly in your browser using the **Web Storage API (`localStorage`)**.
- No account creation, login, or internet connectivity is required.
- Your financial data never leaves your device.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it.
