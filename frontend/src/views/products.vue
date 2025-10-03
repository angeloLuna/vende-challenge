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
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Products</h1>

    <!-- Formulario -->
    <form @submit.prevent="createProduct" class="mb-6 space-y-3">
      <input v-model="newProduct.name" placeholder="Name" class="border p-2 w-full" />
      <input v-model="newProduct.sku" placeholder="SKU" class="border p-2 w-full" />
      <input v-model.number="newProduct.price" type="number" step="0.01" placeholder="Price" class="border p-2 w-full" />

      <select v-model="newProduct.companyId" class="border p-2 w-full">
        <option disabled value="">Select company</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
    </form>

    <!-- Lista -->
    <table class="border-collapse border w-full">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1">Name</th>
          <th class="border px-2 py-1">SKU</th>
          <th class="border px-2 py-1">Price</th>
          <th class="border px-2 py-1">Company</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td class="border px-2 py-1">{{ p.name }}</td>
          <td class="border px-2 py-1">{{ p.sku }}</td>
          <td class="border px-2 py-1">{{ p.price }}</td>
          <td class="border px-2 py-1">{{ p.company?.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
