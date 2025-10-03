<script setup lang="ts">
import { ref, onMounted } from "vue";
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

async function loadProducts() {
  const res = await api.get<Product[]>("/products");
  products.value = res.data;
}

async function loadCompanies() {
  const res = await api.get<Company[]>("/companies");
  companies.value = res.data;
}

async function createProduct() {
  if (!newProduct.value.companyId) {
    alert("Selecciona compañía");
    return;
  }
  await api.post("/products", newProduct.value);
  newProduct.value = { name: "", sku: "", price: 0, companyId: "" };
  await loadProducts();
}

onMounted(() => {
  loadCompanies();
  loadProducts();
});
console.log("companies",companies)
</script>

<template>
  <div class="container">
    <h1 class="title">Products</h1>

    <!-- Formulario -->
    <form @submit.prevent="createProduct" class="form">
      <input v-model="newProduct.name" placeholder="Name" class="input" />
      <input v-model="newProduct.sku" placeholder="SKU" class="input" />
      <input v-model.number="newProduct.price" type="number" step="0.01" placeholder="Price" class="input" />

      <select v-model="newProduct.companyId" class="input">
        <option disabled value="">Select company</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <button type="submit" class="btn">Create</button>
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
            <td>${{ p.price }}</td>
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

.input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
}

.btn {
  background: #2563eb;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: #1d4ed8;
}

.table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

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

.table tbody tr:nth-child(odd) {
  background: #fafafa;
}

.table tbody tr:hover {
  background: #f1f5f9;
}

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