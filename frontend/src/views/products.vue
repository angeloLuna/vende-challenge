<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import api from "../api";

interface Company {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  companyId: string;
  company?: Company;
}

const products = ref<Product[]>([]);
const companies = ref<Company[]>([]);
const newProduct = ref({ name: "", sku: "", price: 0, companyId: "" });


const errors = ref<Partial<Record<keyof typeof newProduct.value, string>>>({});


const SKU_REGEX = /^[A-Z0-9._-]{3,20}$/;


function clearFieldError<K extends keyof typeof newProduct.value>(key: K) {
  if (errors.value[key]) delete errors.value[key];
}


function handleSkuInput() {
  clearFieldError("sku");
  newProduct.value.sku = (newProduct.value.sku || "").toUpperCase();
}


function validate() {
  const e: typeof errors.value = {};

  const name = (newProduct.value.name ?? "").trim();
  if (!name) e.name = "El nombre es obligatorio.";

  const rawSku = (newProduct.value.sku ?? "").trim().toUpperCase();
  if (!rawSku) {
    e.sku = "El SKU es obligatorio.";
  } else if (!SKU_REGEX.test(rawSku)) {
    e.sku = "SKU inválido: usa 3–20 caracteres [A-Z, 0-9, . _ -].";
  }

  const price = Number(newProduct.value.price);
  if (!Number.isFinite(price) || price <= 0) {
    e.price = "El precio debe ser un número mayor a 0.";
  }

  if (!newProduct.value.companyId) {
    e.companyId = "Selecciona una compañía.";
  }

  errors.value = e;
  return Object.keys(e).length === 0;
}

const isValid = computed(() => {
  const nameOk = (newProduct.value.name ?? "").trim().length > 0;
  const skuOk = SKU_REGEX.test(((newProduct.value.sku ?? "") as string).trim().toUpperCase());
  const priceNum = Number(newProduct.value.price);
  const priceOk = Number.isFinite(priceNum) && priceNum > 0;
  const companyOk = !!newProduct.value.companyId;
  return nameOk && skuOk && priceOk && companyOk;
});

async function loadProducts() {
  const res = await api.get<Product[]>("/products");
  products.value = res.data;
}

async function loadCompanies() {
  const res = await api.get<Company[]>("/companies");
  companies.value = res.data;
}

async function createProduct() {
  if (!validate()) return;

  await api.post("/products", {
    ...newProduct.value,
    name: newProduct.value.name.trim(),
    sku: newProduct.value.sku.trim().toUpperCase(),
    price: Number(newProduct.value.price),
  });

  newProduct.value = { name: "", sku: "", price: 0, companyId: "" };
  errors.value = {};
  await loadProducts();
}

onMounted(() => {
  loadCompanies();
  loadProducts();
});
</script>

<template>
  <div class="container">
    <h1 class="title">Products</h1>

    <!-- Formulario -->
    <form @submit.prevent="createProduct" class="form" novalidate>
      <!-- Name -->
      <div class="field">
        <input
          v-model="newProduct.name"
          @input="clearFieldError('name')"
          placeholder="Name"
          class="input"
          :class="{ 'input--error': errors.name }"
          autocomplete="off"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <!-- SKU -->
      <div class="field">
        <input
          v-model="newProduct.sku"
          @input="handleSkuInput"
          placeholder="SKU (A-Z, 0-9, . _ -)"
          class="input"
          :class="{ 'input--error': errors.sku }"
          autocomplete="off"
        />
        <p class="hint">3–20 caracteres. Se normaliza a MAYÚSCULAS.</p>
        <p v-if="errors.sku" class="error">{{ errors.sku }}</p>
      </div>

      <!-- Price -->
      <div class="field">
        <input
          v-model.number="newProduct.price"
          @input="clearFieldError('price')"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          class="input"
          :class="{ 'input--error': errors.price }"
          inputmode="decimal"
        />
        <p v-if="errors.price" class="error">{{ errors.price }}</p>
      </div>

      <!-- Company -->
      <div class="field">
        <select
          v-model="newProduct.companyId"
          @change="clearFieldError('companyId')"
          class="input"
          :class="{ 'input--error': errors.companyId }"
        >
          <option disabled value="">Select company</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.companyId" class="error">{{ errors.companyId }}</p>
      </div>

      <button type="submit" class="btn" :disabled="!isValid">
        Create
      </button>
    </form>

    <!-- Lista -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.name }}</td>
            <td><code class="code">{{ p.sku }}</code></td>
            <td>\${{ p.price }}</td>
            <td>{{ p.company?.name }}</td>
          </tr>
          <tr v-if="!products.length">
            <td colspan="4" class="empty">No products yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  font-family: system-ui, sans-serif;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.form {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 2rem;
  background: #fff;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.field { display: grid; gap: 6px; }

.input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
}

.input--error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220,38,38,0.15);
}

.hint {
  color: #6b7280;
  font-size: 12px;
}

.error {
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
}

.btn {
  background: #2563eb;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.btn:hover { background: #1d4ed8; }
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tabla */
.table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
.table th, .table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.table thead th {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}
.table tbody tr:nth-child(odd) { background: #fafafa; }
.table tbody tr:hover { background: #f1f5f9; }
.code {
  background: #eef2ff;
  color: #3730a3;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
.empty {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-style: italic;
}
</style>
