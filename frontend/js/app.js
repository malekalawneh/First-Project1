const API_URL = "http://localhost:3000/api/expenses";
let allExpenses = [];
let editModalInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("editModal");
  if (modalEl) {
    editModalInstance = new bootstrap.Modal(modalEl);
  }

  fetchExpenses();
  setupAddExpenseForm();
  setupEditExpenseForm();
});
const themeToggleBtn = document.getElementById("themeToggleBtn");

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  if (themeToggleBtn) themeToggleBtn.textContent = "☀️ Light Mode";
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      themeToggleBtn.textContent = "☀️ Light Mode";
    } else {
      localStorage.setItem("darkMode", "disabled");
      themeToggleBtn.textContent = "🌙 Dark Mode";
    }
  });
}
async function fetchExpenses() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch expenses");
    
    allExpenses = await response.json();
    updateSummaryCards(allExpenses);
    renderExpensesTable();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function getCategoryBadgeClass(category) {
  switch (category) {
    case "Food":
      return "bg-success";
    case "Transport":
      return "bg-info text-dark";
    case "Bills":
      return "bg-warning text-dark";
    case "Entertainment":
      return "bg-primary";
    case "Other":
      return "bg-secondary";
    default:
      return "bg-secondary";
  }
}
function renderExpensesTable() {
  const tableBody = document.getElementById("expensesTableBody");
  const filterValue = document.getElementById("filterCategory").value;

  const filtered = filterValue === "All"
    ? allExpenses
    : allExpenses.filter(item => item.category === filterValue);

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No expenses found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(item => `
    <tr>
      <td class="fw-medium">${item.title}</td>
      <td>${Number(item.amount).toFixed(2)}</td>
<td><span class="badge ${getCategoryBadgeClass(item.category)}">${item.category}</span></td>      <td>${item.date}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-secondary me-1" onclick="handleEdit(${item.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="handleDelete(${item.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function setupAddExpenseForm() {
  const form = document.getElementById("addExpenseForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const amountInput = document.getElementById("amount");
    const categorySelect = document.getElementById("category");
    const dateInput = document.getElementById("date");

    resetValidation([titleInput, amountInput, categorySelect, dateInput]);

    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;

    let isValid = true;
    if (!title || !isNaN(title)) { titleInput.classList.add("is-invalid"); isValid = false; }
    if (isNaN(amount) || amount <= 0) { amountInput.classList.add("is-invalid"); isValid = false; }
    if (!category) { categorySelect.classList.add("is-invalid"); isValid = false; }
    if (!date) { dateInput.classList.add("is-invalid"); isValid = false; }

    if (!isValid) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, category, date })
      });

      if (response.ok) {
        form.reset();
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error posting expense:", error);
    }
  });
}

function handleEdit(id) {
  const expense = allExpenses.find(item => item.id === id);
  if (!expense) return;

  document.getElementById("editExpenseId").value = expense.id;
  document.getElementById("editTitle").value = expense.title;
  document.getElementById("editAmount").value = expense.amount;
  document.getElementById("editCategory").value = expense.category;
  document.getElementById("editDate").value = expense.date;

  resetValidation([
    document.getElementById("editTitle"),
    document.getElementById("editAmount"),
    document.getElementById("editCategory"),
    document.getElementById("editDate")
  ]);

  editModalInstance.show();
}

function setupEditExpenseForm() {
  const editForm = document.getElementById("editExpenseForm");
  if (!editForm) return;

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editExpenseId").value;
    const titleInput = document.getElementById("editTitle");
    const amountInput = document.getElementById("editAmount");
    const categorySelect = document.getElementById("editCategory");
    const dateInput = document.getElementById("editDate");

    resetValidation([titleInput, amountInput, categorySelect, dateInput]);

    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;

    let isValid = true;
    if (!title || !isNaN(title)) { titleInput.classList.add("is-invalid"); isValid = false; }
    if (isNaN(amount) || amount <= 0) { amountInput.classList.add("is-invalid"); isValid = false; }
    if (!category) { categorySelect.classList.add("is-invalid"); isValid = false; }
    if (!date) { dateInput.classList.add("is-invalid"); isValid = false; }

    if (!isValid) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, category, date })
      });

      if (response.ok) {
        editModalInstance.hide();
        fetchExpenses();
      } else {
        alert("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  });
}

async function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      fetchExpenses();
    } else {
      alert("Failed to delete expense");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

function updateSummaryCards(expenses) {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("count").textContent = expenses.length;

  if (expenses.length > 0) {
    const highest = expenses.reduce((max, item) => Number(item.amount) > Number(max.amount) ? item : max, expenses[0]);
    document.getElementById("highest").textContent = Number(highest.amount).toFixed(2);
    document.getElementById("highestTitle").textContent = highest.title;
  } else {
    document.getElementById("highest").textContent = "0.00";
    document.getElementById("highestTitle").textContent = "-";
  }
}

document.getElementById("filterCategory").addEventListener("change", renderExpensesTable);

function resetValidation(elements) {
  elements.forEach(el => el.classList.remove("is-invalid"));
}