/**
 * SpendWise - Interactive Expense Tracker Application
 * Handles state management, real-time input validation, dynamic analytics,
 * SVG charts, and LocalStorage persistence.
 */

(() => {
  'use strict';

  // -------------------------------------------------------------------------
  // Constants & Category Configuration
  // -------------------------------------------------------------------------
  const STORAGE_KEYS = {
    TRANSACTIONS: 'spendwise_user_tx',
    CURRENCY: 'spendwise_currency_inr',
    THEME: 'spendwise_theme_v2',
    GUIDE_DISMISSED: 'spendwise_guide_dismissed'
  };

  const CATEGORIES = {
    expense: [
      { id: 'Food & Dining', name: 'Food & Dining', icon: '🍔', color: '#f97316' },
      { id: 'Housing & Rent', name: 'Housing & Rent', icon: '🏠', color: '#8b5cf6' },
      { id: 'Utilities & Bills', name: 'Utilities & Bills', icon: '💡', color: '#eab308' },
      { id: 'Transportation', name: 'Transportation', icon: '🚗', color: '#06b6d4' },
      { id: 'Shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
      { id: 'Entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7' },
      { id: 'Health & Fitness', name: 'Health & Fitness', icon: '💪', color: '#10b981' },
      { id: 'Education', name: 'Education', icon: '📚', color: '#3b82f6' },
      { id: 'Other Expense', name: 'Other Expense', icon: '📦', color: '#64748b' }
    ],
    income: [
      { id: 'Salary', name: 'Salary', icon: '💼', color: '#10b981' },
      { id: 'Freelance & Gigs', name: 'Freelance & Gigs', icon: '💻', color: '#06b6d4' },
      { id: 'Investments', name: 'Investments', icon: '📈', color: '#8b5cf6' },
      { id: 'Gifts & Bonus', name: 'Gifts & Bonus', icon: '🎁', color: '#f59e0b' },
      { id: 'Other Income', name: 'Other Income', icon: '💰', color: '#14b8a6' }
    ]
  };

  const SAMPLE_DATA = [
    {
      id: 'tx_sample_1',
      type: 'income',
      description: 'Monthly Salary',
      amount: 65000.00,
      category: 'Salary',
      date: getRelativeDate(2),
      timestamp: Date.now() - 172800000
    },
    {
      id: 'tx_sample_2',
      type: 'expense',
      description: 'House Rent',
      amount: 18500.00,
      category: 'Housing & Rent',
      date: getRelativeDate(1),
      timestamp: Date.now() - 86400000
    },
    {
      id: 'tx_sample_3',
      type: 'expense',
      description: 'Supermarket & Groceries',
      amount: 4200.00,
      category: 'Food & Dining',
      date: getRelativeDate(0),
      timestamp: Date.now() - 43200000
    },
    {
      id: 'tx_sample_4',
      type: 'income',
      description: 'Freelance Design Work',
      amount: 15000.00,
      category: 'Freelance & Gigs',
      date: getRelativeDate(0),
      timestamp: Date.now() - 21600000
    },
    {
      id: 'tx_sample_5',
      type: 'expense',
      description: 'Electricity & Wi-Fi Bill',
      amount: 2450.00,
      category: 'Utilities & Bills',
      date: getRelativeDate(0),
      timestamp: Date.now() - 10800000
    }
  ];

  // Helper to format sample relative dates
  function getRelativeDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  // -------------------------------------------------------------------------
  // Application State
  // -------------------------------------------------------------------------
  const state = {
    transactions: [],
    currency: '₹',
    theme: 'dark',
    filter: 'all', // 'all' | 'expense' | 'income'
    searchQuery: '',
    sortBy: 'date-desc',
    lastDeleted: null // for undo support
  };

  // -------------------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------------------
  const elements = {
    // Header & Global
    html: document.documentElement,
    themeToggle: document.getElementById('theme-toggle'),
    currencySelect: document.getElementById('currency-select'),
    amountCurrencySymbol: document.getElementById('amount-currency-symbol'),

    // Summary Cards
    totalBalance: document.getElementById('total-balance'),
    balanceStatus: document.getElementById('balance-status'),
    txCountLabel: document.getElementById('tx-count-label'),
    totalIncome: document.getElementById('total-income'),
    incomeCountLabel: document.getElementById('income-count-label'),
    totalExpense: document.getElementById('total-expense'),
    expenseCountLabel: document.getElementById('expense-count-label'),
    savingsRate: document.getElementById('savings-rate'),
    savingsProgress: document.getElementById('savings-progress'),

    // Form & Validation
    form: document.getElementById('transaction-form'),
    typeExpenseRadio: document.getElementById('type-expense'),
    typeIncomeRadio: document.getElementById('type-income'),
    descInput: document.getElementById('tx-description'),
    descWrapper: document.getElementById('desc-wrapper'),
    descError: document.getElementById('desc-error'),
    descCharCounter: document.getElementById('desc-char-counter'),
    amountInput: document.getElementById('tx-amount'),
    amountWrapper: document.getElementById('amount-wrapper'),
    amountError: document.getElementById('amount-error'),
    categorySelect: document.getElementById('tx-category'),
    categoryWrapper: document.getElementById('category-wrapper'),
    categoryError: document.getElementById('category-error'),
    dateInput: document.getElementById('tx-date'),
    dateWrapper: document.getElementById('date-wrapper'),
    dateError: document.getElementById('date-error'),
    quickChips: document.querySelectorAll('.btn-chip'),

    // Chart & Analytics
    donutSvg: document.getElementById('donut-svg'),
    topCategoryName: document.getElementById('top-category-name'),
    categoryLegend: document.getElementById('category-legend'),
    chartTotalLabel: document.getElementById('chart-total-label'),

    // History & Controls
    searchInput: document.getElementById('search-input'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    pillButtons: document.querySelectorAll('.pill-btn'),
    sortSelect: document.getElementById('sort-select'),
    transactionList: document.getElementById('transaction-list'),
    emptyState: document.getElementById('empty-state'),
    emptySubtitle: document.getElementById('empty-subtitle'),
    filteredCount: document.getElementById('filtered-count'),
    btnExportCsv: document.getElementById('btn-export-csv'),
    btnClearAll: document.getElementById('btn-clear-all'),

    // Instructions & Guide Modal
    instructionsModal: document.getElementById('instructions-modal'),
    btnOpenGuide: document.getElementById('btn-open-guide'),
    btnOpenGuideEmpty: document.getElementById('btn-open-guide-empty'),
    btnCloseGuide: document.getElementById('btn-close-guide'),
    btnGotIt: document.getElementById('btn-got-it'),
    chkDontShowGuide: document.getElementById('chk-dont-show-guide'),

    // Modal & Toast
    confirmModal: document.getElementById('confirm-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    btnConfirmClear: document.getElementById('btn-confirm-clear'),
    toastContainer: document.getElementById('toast-container')
  };

  // -------------------------------------------------------------------------
  // Storage & State Initialization
  // -------------------------------------------------------------------------
  function loadState() {
    // Theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      state.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      state.theme = 'light';
    }
    applyTheme(state.theme);

    // Currency - Fixed to Indian Rupee (₹)
    state.currency = '₹';
    localStorage.setItem(STORAGE_KEYS.CURRENCY, '₹');
    if (elements.currencySelect) {
      elements.currencySelect.value = '₹';
    }
    elements.amountCurrencySymbol.textContent = state.currency;

    // Transactions - Clean start (No sample data auto-seeded)
    const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTx) {
      try {
        const parsed = JSON.parse(savedTx);
        // Exclude any previous sample items
        state.transactions = Array.isArray(parsed)
          ? parsed.filter(t => !t.id.startsWith('tx_sample_'))
          : [];
      } catch (e) {
        console.error('Failed parsing saved transactions', e);
        state.transactions = [];
      }
    } else {
      state.transactions = [];
    }
  }

  function saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }

  function applyTheme(theme) {
    state.theme = theme;
    elements.html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // -------------------------------------------------------------------------
  // Currency Formatting Helper (Indian Numbering System Format)
  // -------------------------------------------------------------------------
  function formatCurrency(amount, showSign = false) {
    const num = Math.abs(Number(amount) || 0);
    const formatted = num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (showSign) {
      const sign = amount >= 0 ? '+' : '-';
      return `${sign}${state.currency}${formatted}`;
    }
    return `${state.currency}${formatted}`;
  }

  // -------------------------------------------------------------------------
  // Form Categories & Defaults
  // -------------------------------------------------------------------------
  function updateCategoryOptions() {
    const currentType = elements.typeExpenseRadio.checked ? 'expense' : 'income';
    const list = CATEGORIES[currentType];

    elements.categorySelect.innerHTML = `<option value="" disabled selected>Select category...</option>` +
      list.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  }

  function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    elements.dateInput.value = today;
  }

  // -------------------------------------------------------------------------
  // Input Validation Logic (Modern & Interactive)
  // -------------------------------------------------------------------------
  const validationState = {
    desc: false,
    amount: false,
    category: false,
    date: false
  };

  function validateDescription(showError = false) {
    const val = elements.descInput.value.trim();
    elements.descCharCounter.textContent = `${val.length}/40`;

    let isValid = true;
    let message = '';

    if (!val) {
      isValid = false;
      message = 'Description is required.';
    } else if (val.length < 2) {
      isValid = false;
      message = 'Please enter at least 2 characters.';
    } else if (val.length > 40) {
      isValid = false;
      message = 'Maximum 40 characters allowed.';
    }

    validationState.desc = isValid;
    updateFieldFeedback(elements.descWrapper, elements.descError, isValid, message, showError);
    elements.descInput.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  function validateAmount(showError = false) {
    const rawVal = elements.amountInput.value.trim();
    const val = parseFloat(rawVal);

    let isValid = true;
    let message = '';

    if (!rawVal) {
      isValid = false;
      message = 'Amount is required.';
    } else if (isNaN(val) || val <= 0) {
      isValid = false;
      message = 'Amount must be greater than 0.';
    } else if (val > 100000000) {
      isValid = false;
      message = 'Amount exceeds maximum limit (₹10,00,00,000).';
    }

    validationState.amount = isValid;
    updateFieldFeedback(elements.amountWrapper, elements.amountError, isValid, message, showError);
    elements.amountInput.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  function validateCategory(showError = false) {
    const val = elements.categorySelect.value;
    const isValid = Boolean(val && val.length > 0);
    const message = isValid ? '' : 'Please choose a category.';

    validationState.category = isValid;
    updateFieldFeedback(elements.categoryWrapper, elements.categoryError, isValid, message, showError);
    elements.categorySelect.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  function validateDate(showError = false) {
    const val = elements.dateInput.value;
    let isValid = true;
    let message = '';

    if (!val) {
      isValid = false;
      message = 'Date is required.';
    } else {
      const parsed = new Date(val);
      if (isNaN(parsed.getTime())) {
        isValid = false;
        message = 'Please provide a valid date.';
      }
    }

    validationState.date = isValid;
    updateFieldFeedback(elements.dateWrapper, elements.dateError, isValid, message, showError);
    elements.dateInput.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  function updateFieldFeedback(wrapperEl, errorEl, isValid, message, showError) {
    if (isValid) {
      wrapperEl.classList.remove('has-error');
      errorEl.textContent = '';
    } else if (showError) {
      wrapperEl.classList.add('has-error');
      errorEl.textContent = message;
    }
  }

  function clearAllFormValidation() {
    [elements.descWrapper, elements.amountWrapper, elements.categoryWrapper, elements.dateWrapper].forEach(w => {
      w.classList.remove('has-error');
    });
    elements.descCharCounter.textContent = '0/40';
  }

  // -------------------------------------------------------------------------
  // Financial Dashboard Calculations
  // -------------------------------------------------------------------------
  function renderDashboard() {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    state.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        incomeTotal += amt;
        incomeCount++;
      } else {
        expenseTotal += amt;
        expenseCount++;
      }
    });

    const netBalance = incomeTotal - expenseTotal;
    const totalTransactions = state.transactions.length;

    // Balance update
    elements.totalBalance.textContent = (netBalance < 0 ? '-' : '') + formatCurrency(Math.abs(netBalance));
    elements.totalBalance.classList.remove('positive', 'negative');
    if (netBalance > 0) {
      elements.totalBalance.classList.add('positive');
      elements.balanceStatus.textContent = 'Healthy Surplus';
      elements.balanceStatus.style.color = 'var(--income-green)';
    } else if (netBalance < 0) {
      elements.totalBalance.classList.add('negative');
      elements.balanceStatus.textContent = 'In Deficit';
      elements.balanceStatus.style.color = 'var(--expense-rose)';
    } else {
      elements.balanceStatus.textContent = 'Balanced (₹0)';
      elements.balanceStatus.style.color = 'var(--text-subtle)';
    }
    elements.txCountLabel.textContent = `${totalTransactions} total`;

    // Income & Expense cards
    elements.totalIncome.textContent = `+${formatCurrency(incomeTotal)}`;
    elements.incomeCountLabel.textContent = `${incomeCount} credit${incomeCount === 1 ? '' : 's'}`;

    elements.totalExpense.textContent = `-${formatCurrency(expenseTotal)}`;
    elements.expenseCountLabel.textContent = `${expenseCount} debit${expenseCount === 1 ? '' : 's'}`;

    // Savings rate calculation
    let savingsRatio = 0;
    if (incomeTotal > 0) {
      savingsRatio = Math.max(0, Math.min(100, Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100)));
    }
    elements.savingsRate.textContent = `${savingsRatio}%`;
    elements.savingsProgress.style.width = `${savingsRatio}%`;

    // Render Dynamic Donut Chart & Category Breakdown
    renderDonutChart(expenseTotal);
  }

  // -------------------------------------------------------------------------
  // Dynamic Category Analytics & SVG Donut Chart
  // -------------------------------------------------------------------------
  function renderDonutChart(totalExpenses) {
    const expenses = state.transactions.filter(t => t.type === 'expense');

    if (expenses.length === 0 || totalExpenses <= 0) {
      elements.donutSvg.innerHTML = `
        <circle cx="80" cy="80" r="54" fill="transparent" stroke="var(--border-subtle)" stroke-width="18"/>
      `;
      elements.topCategoryName.textContent = 'No Data';
      elements.categoryLegend.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-subtle); padding: 0.5rem 0; text-align: center;">
          No expense records yet
        </div>
      `;
      elements.chartTotalLabel.textContent = '0% Spent';
      return;
    }

    // Group expenses by category
    const catMap = {};
    expenses.forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + Number(tx.amount);
    });

    const sortedCats = Object.keys(catMap)
      .map(cat => ({
        category: cat,
        amount: catMap[cat],
        pct: (catMap[cat] / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    // Identify top category
    const topCat = sortedCats[0];
    elements.topCategoryName.textContent = topCat ? topCat.category : '-';
    elements.chartTotalLabel.textContent = `${formatCurrency(totalExpenses)} Total`;

    // Render SVG Donut Segments
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;
    let svgHtml = '';

    sortedCats.forEach((item, index) => {
      const catConfig = CATEGORIES.expense.find(c => c.id === item.category) || { color: '#6366f1', icon: '🏷️' };
      const strokeDash = (item.pct / 100) * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeDash;

      svgHtml += `
        <circle 
          class="donut-segment" 
          cx="80" 
          cy="80" 
          r="${radius}" 
          stroke="${catConfig.color}" 
          stroke-dasharray="${strokeDash} ${circumference}" 
          stroke-dashoffset="${strokeDashoffset}"
          data-cat="${item.category}"
          data-amount="${item.amount}"
          title="${item.category}: ${formatCurrency(item.amount)} (${item.pct.toFixed(1)}%)"
        />
      `;
    });

    elements.donutSvg.innerHTML = svgHtml;

    // Render Category Legend with Mini Progress Bars
    let legendHtml = '';
    sortedCats.forEach(item => {
      const catConfig = CATEGORIES.expense.find(c => c.id === item.category) || { color: '#6366f1', icon: '🏷️' };
      legendHtml += `
        <div class="legend-item" title="${item.category}: ${formatCurrency(item.amount)}">
          <div class="legend-info">
            <div class="legend-label-wrap">
              <span class="legend-color-dot" style="background-color: ${catConfig.color};"></span>
              <span class="legend-name">${catConfig.icon} ${item.category}</span>
            </div>
            <span class="legend-amount">${formatCurrency(item.amount)} <small style="color: var(--text-subtle); font-size: 0.7rem;">(${item.pct.toFixed(0)}%)</small></span>
          </div>
          <div class="legend-bar-bg">
            <div class="legend-bar-fill" style="width: ${item.pct}%; background-color: ${catConfig.color};"></div>
          </div>
        </div>
      `;
    });
    elements.categoryLegend.innerHTML = legendHtml;
  }

  // -------------------------------------------------------------------------
  // Transactions List & Filters
  // -------------------------------------------------------------------------
  function getFilteredAndSortedTransactions() {
    let list = [...state.transactions];

    // Filter by type
    if (state.filter !== 'all') {
      list = list.filter(t => t.type === state.filter);
    }

    // Filter by search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (state.sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date) || (b.timestamp || 0) - (a.timestamp || 0);
      } else if (state.sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date) || (a.timestamp || 0) - (b.timestamp || 0);
      } else if (state.sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (state.sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return list;
  }

  function renderTransactionList() {
    const list = getFilteredAndSortedTransactions();
    elements.filteredCount.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;

    if (list.length === 0) {
      elements.transactionList.innerHTML = '';
      elements.emptyState.hidden = false;

      if (state.searchQuery || state.filter !== 'all') {
        elements.emptySubtitle.textContent = 'No transactions match your current search or filter criteria.';
      } else {
        elements.emptySubtitle.textContent = 'Add your first income or expense, or load sample records to explore.';
      }
      return;
    }

    elements.emptyState.hidden = true;

    const itemsHtml = list.map(tx => {
      const isExpense = tx.type === 'expense';
      const catConfig = [...CATEGORIES.expense, ...CATEGORIES.income].find(c => c.id === tx.category) || {
        icon: isExpense ? '💸' : '💰',
        color: isExpense ? '#f43f5e' : '#10b981'
      };

      const dateStr = formatDateDisplay(tx.date);

      return `
        <li class="tx-item" data-id="${tx.id}">
          <div class="tx-left">
            <div class="tx-category-icon" style="background-color: ${catConfig.color}22; color: ${catConfig.color};">
              ${catConfig.icon}
            </div>
            <div class="tx-meta">
              <span class="tx-title" title="${escapeHtml(tx.description)}">${escapeHtml(tx.description)}</span>
              <span class="tx-sub">
                <span>${escapeHtml(tx.category)}</span>
                <span class="tx-dot">&bull;</span>
                <span>${dateStr}</span>
              </span>
            </div>
          </div>
          <div class="tx-right">
            <span class="tx-amount ${isExpense ? 'expense' : 'income'}">
              ${isExpense ? '-' : '+'}${formatCurrency(tx.amount)}
            </span>
            <button type="button" class="btn-delete-tx" data-delete-id="${tx.id}" aria-label="Delete transaction: ${escapeHtml(tx.description)}" title="Delete transaction">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </li>
      `;
    }).join('');

    elements.transactionList.innerHTML = itemsHtml;
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // -------------------------------------------------------------------------
  // Toast Notifications & Undo Support
  // -------------------------------------------------------------------------
  function showToast(message, type = 'info', undoCallback = null) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div class="toast-msg">
        ${iconSvg}
        <span>${escapeHtml(message)}</span>
      </div>
      ${undoCallback ? '<button type="button" class="toast-undo">Undo</button>' : ''}
    `;

    if (undoCallback) {
      const undoBtn = toast.querySelector('.toast-undo');
      undoBtn.addEventListener('click', () => {
        undoCallback();
        toast.remove();
      });
    }

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 4500);
  }

  // -------------------------------------------------------------------------
  // Transaction Action Handlers
  // -------------------------------------------------------------------------
  function handleFormSubmit(e) {
    e.preventDefault();

    // Trigger full validation for all fields
    const isDescValid = validateDescription(true);
    const isAmountValid = validateAmount(true);
    const isCategoryValid = validateCategory(true);
    const isDateValid = validateDate(true);

    if (!isDescValid || !isAmountValid || !isCategoryValid || !isDateValid) {
      // Focus the first invalid element
      if (!isDescValid) elements.descInput.focus();
      else if (!isAmountValid) elements.amountInput.focus();
      else if (!isCategoryValid) elements.categorySelect.focus();
      else if (!isDateValid) elements.dateInput.focus();

      showToast('Please fix the highlighted form errors.', 'error');
      return;
    }

    // Create new transaction
    const newTx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: elements.typeExpenseRadio.checked ? 'expense' : 'income',
      description: elements.descInput.value.trim(),
      amount: parseFloat(parseFloat(elements.amountInput.value).toFixed(2)),
      category: elements.categorySelect.value,
      date: elements.dateInput.value,
      timestamp: Date.now()
    };

    // Add to state and save
    state.transactions.unshift(newTx);
    saveTransactions();

    // Reset inputs
    elements.descInput.value = '';
    elements.amountInput.value = '';
    clearAllFormValidation();
    setDefaultDate();
    elements.descInput.focus();

    // Re-render
    renderDashboard();
    renderTransactionList();

    showToast(`Added ${newTx.type}: "${newTx.description}"`, 'success');
  }

  function deleteTransaction(id) {
    const index = state.transactions.findIndex(t => t.id === id);
    if (index === -1) return;

    const [deletedTx] = state.transactions.splice(index, 1);
    state.lastDeleted = { item: deletedTx, index };
    saveTransactions();

    renderDashboard();
    renderTransactionList();

    showToast(`Deleted "${deletedTx.description}"`, 'info', () => {
      // Undo callback
      if (state.lastDeleted) {
        state.transactions.splice(state.lastDeleted.index, 0, state.lastDeleted.item);
        saveTransactions();
        renderDashboard();
        renderTransactionList();
        showToast(`Restored "${state.lastDeleted.item.description}"`, 'success');
        state.lastDeleted = null;
      }
    });
  }

  function clearAllTransactions() {
    state.transactions = [];
    saveTransactions();
    renderDashboard();
    renderTransactionList();
    showToast('All transactions cleared.', 'info');
  }

  function loadSampleData() {
    state.transactions = JSON.parse(JSON.stringify(SAMPLE_DATA));
    saveTransactions();
    renderDashboard();
    renderTransactionList();
    showToast('Loaded sample transactions!', 'success');
  }

  function exportToCsv() {
    if (state.transactions.length === 0) {
      showToast('No transactions to export.', 'error');
      return;
    }

    const headers = ['ID', 'Type', 'Description', 'Category', 'Amount', 'Date'];
    const rows = state.transactions.map(t => [
      `"${t.id}"`,
      `"${t.type}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount.toFixed(2),
      `"${t.date}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.setAttribute('download', `SpendWise_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    showToast('Exported CSV file.', 'success');
  }

  // -------------------------------------------------------------------------
  // Event Listeners Binding
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // Theme Toggle
    elements.themeToggle.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    // Currency Switcher
    elements.currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      elements.amountCurrencySymbol.textContent = state.currency;
      localStorage.setItem(STORAGE_KEYS.CURRENCY, state.currency);
      renderDashboard();
      renderTransactionList();
    });

    // Transaction Type Segmented Toggle
    elements.typeExpenseRadio.addEventListener('change', () => {
      updateCategoryOptions();
      validateCategory(false);
    });
    elements.typeIncomeRadio.addEventListener('change', () => {
      updateCategoryOptions();
      validateCategory(false);
    });

    // Real-Time & Blur Input Validation
    elements.descInput.addEventListener('input', () => {
      validateDescription(false);
    });
    elements.descInput.addEventListener('blur', () => {
      validateDescription(true);
    });

    elements.amountInput.addEventListener('input', () => {
      validateAmount(false);
    });
    elements.amountInput.addEventListener('blur', () => {
      validateAmount(true);
    });

    elements.categorySelect.addEventListener('change', () => {
      validateCategory(true);
    });

    elements.dateInput.addEventListener('change', () => {
      validateDate(true);
    });

    // Quick Amount Increment Chips
    elements.quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const addVal = parseFloat(chip.dataset.add) || 0;
        const currentVal = parseFloat(elements.amountInput.value) || 0;
        elements.amountInput.value = (currentVal + addVal).toFixed(2);
        validateAmount(false);
        elements.amountInput.focus();
      });
    });

    // Form Submit
    elements.form.addEventListener('submit', handleFormSubmit);

    // Search Box
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      elements.btnClearSearch.hidden = !state.searchQuery;
      renderTransactionList();
    });

    elements.btnClearSearch.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.btnClearSearch.hidden = true;
      elements.searchInput.focus();
      renderTransactionList();
    });

    // Filter Pills
    elements.pillButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.pillButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filter = btn.dataset.filter;
        renderTransactionList();
      });
    });

    // Sort Dropdown
    elements.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderTransactionList();
    });

    // Transaction Item Delete (Event Delegation)
    elements.transactionList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-delete-id]');
      if (deleteBtn) {
        const id = deleteBtn.dataset.deleteId;
        deleteTransaction(id);
      }
    });

    // Instructions / Guide Modal Controls
    const openGuideModal = () => {
      if (elements.instructionsModal && typeof elements.instructionsModal.showModal === 'function') {
        elements.instructionsModal.showModal();
      }
    };

    const closeGuideModal = () => {
      if (elements.chkDontShowGuide && elements.chkDontShowGuide.checked) {
        localStorage.setItem(STORAGE_KEYS.GUIDE_DISMISSED, 'true');
      }
      if (elements.instructionsModal) {
        elements.instructionsModal.close();
      }
    };

    if (elements.btnOpenGuide) {
      elements.btnOpenGuide.addEventListener('click', openGuideModal);
    }
    if (elements.btnOpenGuideEmpty) {
      elements.btnOpenGuideEmpty.addEventListener('click', openGuideModal);
    }
    if (elements.btnCloseGuide) {
      elements.btnCloseGuide.addEventListener('click', closeGuideModal);
    }
    if (elements.btnGotIt) {
      elements.btnGotIt.addEventListener('click', closeGuideModal);
    }

    if (elements.instructionsModal) {
      elements.instructionsModal.addEventListener('click', (e) => {
        if (e.target === elements.instructionsModal) {
          closeGuideModal();
        }
      });
    }

    // Export CSV
    elements.btnExportCsv.addEventListener('click', exportToCsv);

    // Clear All Modal Controls
    elements.btnClearAll.addEventListener('click', () => {
      if (state.transactions.length === 0) {
        showToast('No transactions to clear.', 'info');
        return;
      }
      if (elements.confirmModal && typeof elements.confirmModal.showModal === 'function') {
        elements.confirmModal.showModal();
      } else if (confirm('Are you sure you want to clear all transactions?')) {
        clearAllTransactions();
      }
    });

    elements.btnCancelModal.addEventListener('click', () => {
      elements.confirmModal.close();
    });

    elements.btnConfirmClear.addEventListener('click', () => {
      elements.confirmModal.close();
      clearAllTransactions();
    });

    // Close modal on outside backdrop click
    elements.confirmModal.addEventListener('click', (e) => {
      if (e.target === elements.confirmModal) {
        elements.confirmModal.close();
      }
    });

    // Keyboard accessibility: Escape closes modal
    elements.confirmModal.addEventListener('cancel', (e) => {
      // native modal handles escape
    });
  }

  // -------------------------------------------------------------------------
  // App Bootstrapper
  // -------------------------------------------------------------------------
  function init() {
    loadState();
    updateCategoryOptions();
    setDefaultDate();
    setupEventListeners();
    renderDashboard();
    renderTransactionList();

    // Automatically display instructions popup on startup if not dismissed
    const isGuideDismissed = localStorage.getItem(STORAGE_KEYS.GUIDE_DISMISSED);
    if (!isGuideDismissed && elements.instructionsModal && typeof elements.instructionsModal.showModal === 'function') {
      setTimeout(() => {
        elements.instructionsModal.showModal();
      }, 250);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
