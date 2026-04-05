    const initialTransactions = [
      { id: 1, date: '2026-01-03', description: 'Salary Credit', category: 'Salary', type: 'income', amount: 68000, note: 'Monthly payroll' },
      { id: 2, date: '2026-01-05', description: 'Apartment Rent', category: 'Housing', type: 'expense', amount: 18000, note: 'January rent' },
      { id: 3, date: '2026-01-09', description: 'Supermarket', category: 'Groceries', type: 'expense', amount: 3250, note: 'Weekly essentials' },
      { id: 4, date: '2026-01-14', description: 'Freelance Payout', category: 'Freelance', type: 'income', amount: 14500, note: 'Landing page work' },
      { id: 5, date: '2026-02-02', description: 'Salary Credit', category: 'Salary', type: 'income', amount: 68000, note: 'Monthly payroll' },
      { id: 6, date: '2026-02-04', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 2480, note: 'BESCOM' },
      { id: 7, date: '2026-02-08', description: 'Dinner with friends', category: 'Dining', type: 'expense', amount: 1850, note: 'Weekend outing' },
      { id: 8, date: '2026-02-13', description: 'Mutual Fund Return', category: 'Investment', type: 'income', amount: 6200, note: 'SIP gain' },
      { id: 9, date: '2026-02-20', description: 'Cab rides', category: 'Transport', type: 'expense', amount: 980, note: 'Office commute' },
      { id: 10, date: '2026-03-02', description: 'Salary Credit', category: 'Salary', type: 'income', amount: 68000, note: 'Monthly payroll' },
      { id: 11, date: '2026-03-04', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 2400, note: 'Quarterly plan' },
      { id: 12, date: '2026-03-10', description: 'Flight Booking', category: 'Travel', type: 'expense', amount: 7400, note: 'Hyderabad visit' },
      { id: 13, date: '2026-03-17', description: 'Course Refund', category: 'Refund', type: 'income', amount: 2200, note: 'Cancelled workshop' },
      { id: 14, date: '2026-03-21', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 999, note: 'Fiber broadband' },
      { id: 15, date: '2026-04-02', description: 'Salary Credit', category: 'Salary', type: 'income', amount: 70000, note: 'Appraisal cycle' },
      { id: 16, date: '2026-04-06', description: 'Coffee subscriptions', category: 'Dining', type: 'expense', amount: 720, note: 'Monthly beans' },
      { id: 17, date: '2026-04-09', description: 'Medical test', category: 'Health', type: 'expense', amount: 3100, note: 'Routine checkup' },
      { id: 18, date: '2026-04-16', description: 'Stock Dividend', category: 'Investment', type: 'income', amount: 1800, note: 'Quarterly dividend' },
      { id: 19, date: '2026-04-19', description: 'Online shopping', category: 'Shopping', type: 'expense', amount: 4350, note: 'Work desk lamp' },
      { id: 20, date: '2026-04-22', description: 'Water Bill', category: 'Utilities', type: 'expense', amount: 650, note: 'Monthly bill' }
    ];

    const state = {
      role: 'viewer',
      search: '',
      type: 'all',
      category: 'all',
      sort: 'date-desc',
      selectedMonth: 'all',
      editId: null,
      transactions: [...initialTransactions]
    };

    const categoryPalette = {
      Salary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
      Housing: '#8f5b3b',
      Groceries: '#6daa45',
      Freelance: '#5591c7',
      Utilities: '#fdab43',
      Dining: '#dd6974',
      Investment: '#a86fdf',
      Transport: '#4f98a3',
      Health: '#437a22',
      Travel: '#da7101',
      Refund: '#006494',
      Shopping: '#a13544'
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mobileNavButtons = [...document.querySelectorAll('.mobile-bar button')];
    const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const body = document.getElementById('transactionsBody');
    const emptyState = document.getElementById('emptyState');
    const resultCount = document.getElementById('resultCount');
    const rolePanel = document.getElementById('rolePanel');
    const drawer = document.getElementById('drawer');
    const transactionForm = document.getElementById('transactionForm');
    const addTxnBtn = document.getElementById('addTxnBtn');
    const themeToggle = document.getElementById('themeToggle');
    const roleSelect = document.getElementById('roleSelect');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const monthFilter = document.getElementById('monthFilter');
    const txnCategory = document.getElementById('txnCategory');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

    function fillCategoryOptions() {
      const categories = [...new Set(state.transactions.map(t => t.category))].sort();
      categoryFilter.innerHTML = '<option value="all">All categories</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
      txnCategory.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
      monthFilter.innerHTML = '<option value="all">All months</option>' + [...new Set(state.transactions.map(t => t.date.slice(0,7)))].sort().map(m => `<option value="${m}">${monthNames[Number(m.slice(5,7)) - 1]} ${m.slice(0,4)}</option>`).join('');
      categoryFilter.value = state.category;
      monthFilter.value = state.selectedMonth;
    }

    function getFilteredTransactions() {
      let txns = [...state.transactions];
      if (state.search) {
        const q = state.search.toLowerCase();
        txns = txns.filter(t => [t.description, t.category, t.note].join(' ').toLowerCase().includes(q));
      }
      if (state.type !== 'all') txns = txns.filter(t => t.type === state.type);
      if (state.category !== 'all') txns = txns.filter(t => t.category === state.category);
      if (state.selectedMonth !== 'all') txns = txns.filter(t => t.date.startsWith(state.selectedMonth));
      txns.sort((a, b) => {
        if (state.sort === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (state.sort === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (state.sort === 'amount-desc') return b.amount - a.amount;
        return a.amount - b.amount;
      });
      return txns;
    }

    function getMonthlySummary() {
      const map = new Map();
      state.transactions.forEach(t => {
        const key = t.date.slice(0,7);
        if (!map.has(key)) map.set(key, { income: 0, expense: 0 });
        map.get(key)[t.type] += t.amount;
      });
      return [...map.entries()].sort((a,b) => a[0].localeCompare(b[0])).map(([month, values]) => ({
        month,
        label: `${monthNames[Number(month.slice(5,7)) - 1]} ${month.slice(2,4)}`,
        income: values.income,
        expense: values.expense,
        balance: values.income - values.expense
      }));
    }

    function computeOverview() {
      const monthly = getMonthlySummary();
      const latest = monthly[monthly.length - 1] || { income: 0, expense: 0, balance: 0 };
      const prev = monthly[monthly.length - 2] || { income: 0, expense: 0, balance: 1 };
      const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const totalBalance = totalIncome - totalExpense;
      const pct = (curr, prior) => prior === 0 ? 100 : (((curr - prior) / prior) * 100);
      return {
        monthly,
        latest,
        totalIncome,
        totalExpense,
        totalBalance,
        balanceDelta: pct(latest.balance, prev.balance),
        incomeDelta: pct(latest.income, prev.income),
        expenseDelta: pct(latest.expense, prev.expense)
      };
    }

    function renderStats() {
      const data = computeOverview();
      document.getElementById('totalBalance').textContent = currency.format(data.totalBalance);
      document.getElementById('incomeTotal').textContent = currency.format(data.totalIncome);
      document.getElementById('expenseTotal').textContent = currency.format(data.totalExpense);
      document.getElementById('balanceDelta').textContent = `${data.balanceDelta >= 0 ? '▲' : '▼'} ${Math.abs(data.balanceDelta).toFixed(1)}%`;
      document.getElementById('incomeDelta').textContent = `${data.incomeDelta >= 0 ? '▲' : '▼'} ${Math.abs(data.incomeDelta).toFixed(1)}%`;
      document.getElementById('expenseDelta').textContent = `${data.expenseDelta >= 0 ? '▲' : '▼'} ${Math.abs(data.expenseDelta).toFixed(1)}%`;
    }

    let trendChart, categoryChart;
    function chartColors() {
      const style = getComputedStyle(document.documentElement);
      return {
        text: style.getPropertyValue('--color-text').trim(),
        muted: style.getPropertyValue('--color-text-muted').trim(),
        divider: style.getPropertyValue('--color-divider').trim(),
        primary: style.getPropertyValue('--color-primary').trim(),
        success: style.getPropertyValue('--color-success').trim(),
        error: style.getPropertyValue('--color-error').trim(),
        surface: style.getPropertyValue('--color-surface').trim()
      };
    }

    function renderCharts() {
      const palette = chartColors();
      const monthly = getMonthlySummary();
      const categoryTotals = state.transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      if (trendChart) trendChart.destroy();
      if (categoryChart) categoryChart.destroy();
      trendChart = new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
          labels: monthly.map(m => m.label),
          datasets: [
            { label: 'Income', data: monthly.map(m => m.income), borderColor: palette.success, backgroundColor: 'transparent', tension: 0.35, borderWidth: 3 },
            { label: 'Expenses', data: monthly.map(m => m.expense), borderColor: palette.error, backgroundColor: 'transparent', tension: 0.35, borderWidth: 3 },
            { label: 'Net', data: monthly.map(m => m.balance), borderColor: palette.primary, backgroundColor: 'transparent', tension: 0.35, borderWidth: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: palette.text, usePointStyle: true } } },
          scales: {
            x: { ticks: { color: palette.muted }, grid: { color: 'transparent' } },
            y: { ticks: { color: palette.muted, callback: value => '₹' + Number(value/1000) + 'k' }, grid: { color: palette.divider } }
          }
        }
      });
      categoryChart = new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [{ data: Object.values(categoryTotals), backgroundColor: Object.keys(categoryTotals).map(key => categoryPalette[key] || palette.primary), borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: palette.text, usePointStyle: true, padding: 16 } } },
          cutout: '62%'
        }
      });
    }

    function renderInsights() {
      const monthly = getMonthlySummary();
      const expenseOnly = state.transactions.filter(t => t.type === 'expense');
      const categoryTotals = expenseOnly.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      const topCategory = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1])[0] || ['None', 0];
      const latest = monthly[monthly.length - 1] || { income: 0, expense: 0 };
      const prev = monthly[monthly.length - 2] || { income: 0, expense: 0 };
      const savingsRate = latest.income ? (((latest.income - latest.expense) / latest.income) * 100) : 0;
      const insights = [
        { badge: 'Highest spend', title: topCategory[0], body: `${currency.format(topCategory[1])} spent in the largest expense category.` },
        { badge: 'Monthly compare', title: latest.expense > prev.expense ? 'Spending increased' : 'Spending dropped', body: `This month vs last month: ${currency.format(latest.expense)} vs ${currency.format(prev.expense)}.` },
        { badge: 'Observation', title: `${savingsRate.toFixed(1)}% savings rate`, body: latest.income ? `Net savings from the latest month remain ${savingsRate >= 20 ? 'healthy' : 'tight'} based on current income and expense totals.` : 'Add income data to compute savings rate.' }
      ];
      document.getElementById('insightsGrid').innerHTML = insights.map(item => `
        <article class="card insight-card">
          <span class="insight-badge">${item.badge}</span>
          <h4 style="font-size: var(--text-lg);">${item.title}</h4>
          <p class="muted">${item.body}</p>
        </article>
      `).join('');
    }

    function renderTable() {
      const rows = getFilteredTransactions();
      resultCount.textContent = `${rows.length} result${rows.length === 1 ? '' : 's'}`;
      body.innerHTML = rows.map(t => `
        <tr>
          <td>${new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
          <td>
            <div style="font-weight: 700;">${t.description}</div>
            <div class="muted" style="font-size: var(--text-xs);">${t.note || 'No note added'}</div>
          </td>
          <td><span class="category-tag">${t.category}</span></td>
          <td><span class="pill ${t.type}">${t.type === 'income' ? '↗' : '↘'} ${t.type}</span></td>
          <td style="font-weight: 700; color: ${t.type === 'income' ? 'var(--color-success)' : 'var(--color-text)'};">${t.type === 'expense' ? '-' : '+'}${currency.format(t.amount)}</td>
          <td>
            ${state.role === 'admin' ? `<div class="actions-cell"><button class="icon-btn" onclick="startEdit(${t.id})" aria-label="Edit transaction">✎</button><button class="icon-btn" onclick="deleteTxn(${t.id})" aria-label="Delete transaction">🗑</button></div>` : `<span class="muted">View only</span>`}
          </td>
        </tr>
      `).join('');
      emptyState.classList.toggle('show', rows.length === 0);
    }

    function renderRolePanel() {
      rolePanel.innerHTML = state.role === 'admin' ? `
        <div style="display:grid; gap: var(--space-3);">
          <div class="pill income" style="width:fit-content;">Admin access enabled</div>
          <p class="muted">Admins can open the modal form, edit a transaction, or remove an entry directly from the table.</p>
          <button class="btn btn-primary" onclick="openDrawer()">Create transaction</button>
        </div>
      ` : `
        <div style="display:grid; gap: var(--space-3);">
          <div class="pill" style="width:fit-content; background: var(--color-surface-offset);">Viewer access enabled</div>
          <p class="muted">Viewers can inspect summaries, charts, insights, and transaction records, but action controls remain hidden.</p>
          <button class="btn btn-secondary" disabled aria-disabled="true">Editing disabled</button>
        </div>
      `;
      addTxnBtn.style.display = state.role === 'admin' ? 'inline-flex' : 'none';
    }

    function setActiveMobileNav(targetId) {
      mobileNavButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === targetId));
    }

    function scrollToSection(targetId) {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveMobileNav(targetId);
    }

    function syncAll() {
      fillCategoryOptions();
      renderStats();
      renderCharts();
      renderInsights();
      renderTable();
      renderRolePanel();
    }

    function openDrawer(editMode = false) {
      if (state.role !== 'admin') return;
      drawer.classList.add('show');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.getElementById('modalTitle').textContent = editMode ? 'Edit transaction' : 'Add transaction';
    }

    function closeDrawer() {
      drawer.classList.remove('show');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = window.innerWidth > 900 ? 'hidden' : 'auto';
      transactionForm.reset();
      state.editId = null;
    }

    window.openDrawer = openDrawer;
    window.startEdit = function(id) {
      if (state.role !== 'admin') return;
      const txn = state.transactions.find(t => t.id === id);
      if (!txn) return;
      state.editId = id;
      transactionForm.date.value = txn.date;
      transactionForm.amount.value = txn.amount;
      transactionForm.category.value = txn.category;
      transactionForm.type.value = txn.type;
      transactionForm.description.value = txn.description;
      transactionForm.note.value = txn.note || '';
      openDrawer(true);
    };
    window.deleteTxn = function(id) {
      if (state.role !== 'admin') return;
      state.transactions = state.transactions.filter(t => t.id !== id);
      syncAll();
    };

    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(transactionForm).entries());
      const payload = { ...data, amount: Number(data.amount) };
      if (state.editId) {
        state.transactions = state.transactions.map(t => t.id === state.editId ? { ...t, ...payload } : t);
      } else {
        state.transactions.unshift({ id: Date.now(), ...payload });
      }
      closeDrawer();
      syncAll();
    });

    document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
    document.getElementById('cancelForm').addEventListener('click', closeDrawer);
    drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
    addTxnBtn.addEventListener('click', () => openDrawer(false));

    roleSelect.addEventListener('change', (e) => { state.role = e.target.value; renderRolePanel(); renderTable(); });
    searchInput.addEventListener('input', (e) => { state.search = e.target.value.trim(); renderTable(); });
    typeFilter.addEventListener('change', (e) => { state.type = e.target.value; renderTable(); });
    categoryFilter.addEventListener('change', (e) => { state.category = e.target.value; renderTable(); });
    sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; renderTable(); });
    monthFilter.addEventListener('change', (e) => { state.selectedMonth = e.target.value; renderTable(); });
    document.getElementById('clearFilters').addEventListener('click', () => {
      state.search = ''; state.type = 'all'; state.category = 'all'; state.sort = 'date-desc'; state.selectedMonth = 'all';
      searchInput.value = ''; typeFilter.value = 'all'; categoryFilter.value = 'all'; sortSelect.value = 'date-desc'; monthFilter.value = 'all';
      renderTable();
    });
    document.getElementById('emptyReset').addEventListener('click', () => document.getElementById('clearFilters').click());

    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      renderCharts();
    });

    mobileNavButtons.forEach(button => {
      button.addEventListener('click', () => scrollToSection(button.dataset.target));
    });

    syncAll();