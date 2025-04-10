<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template #end>
                <Button label="Add Projects" icon="pi pi-plus" severity="info" style="margin-right: 10px;" />
            </template>
        </Toolbar>
        <DataTable :value="occupations" showGridlines tableStyle="min-width: 50rem"
        :paginator="true" :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} occupations"
        >
        <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 class="m-0">Manage Occupations</h4>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
            </div>
        </template>
            <Column field="occupation_name" header="Name"></Column>
            <Column field="Action" header="Action">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>


    <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
            <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-3" />
            <div class="field">
                <label for="name">Name</label>
                <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{'p-invalid': submitted && !product.name}" />
                <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
            </div>
            <div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
            </div>

            <div class="field">
				<label for="inventoryStatus" class="mb-3">Inventory Status</label>
				<Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
					<template #value="slotProps">
						<div v-if="slotProps.value && slotProps.value.value">
                            <Tag :value="slotProps.value.value" :severity="getStatusLabel(slotProps.value.label)" />
                        </div>
                        <div v-else-if="slotProps.value && !slotProps.value.value">
                            <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
                        </div>
						<span v-else>
							{{slotProps.placeholder}}
						</span>
					</template>
				</Dropdown>
			</div>

            <div class="field">
                <label class="mb-3">Category</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                        <label for="category1">Accessories</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                        <label for="category2">Clothing</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                        <label for="category3">Electronics</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                        <label for="category4">Fitness</label>
                    </div>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Price</label>
                    <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="field col">
                    <label for="quantity">Quantity</label>
                    <InputNumber id="quantity" v-model="product.quantity" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected occupations?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import  ProductService  from '@/service/ProductService';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { OccupationService } from '@/apps/timesheet/services/OccupationService';

const toast = useToast();
const dt = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const occupations = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = () => {
    submitted.value = true;

    if (product.value.name.trim()) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            occupations.value[findIndexById(product.value.id)] = product.value;
            toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        }
        else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            occupations.value.push(product.value);
            toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        }

        productDialog.value = false;
        product.value = {};
    }
};
const editProduct = (prod) => {
    product.value = {...prod};
    productDialog.value = true;
};
const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};
const deleteProduct = () => {
    occupations.value = occupations.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
};
onMounted( async () => {
    occupations.value = await OccupationService.getOccupations()
});



</script>
