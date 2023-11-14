<template>

    <div class="card">
         <Toolbar class="mb-4">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
            </template>
            <template #center>
               <span style="margin-right: 10px; font-weight: 700;">Date Rage: </span> 
               <Calendar v-model="dates" selectionMode="range" showButtonBar :manualInput="false" />
            </template>
            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
            </template>
        </Toolbar>
        <DataTable 
            :value="customers" 
            rowGroupMode="rowspan" 
            groupRowsBy="date" 
            sortMode="single" 
            sortField="date" 
            :sortOrder="1" 
            tableStyle="min-width: 50rem"
            v-model:editingRows="editingRows"
            editMode="row"
            dataKey="id"
            @row-edit-save="onRowEditSave"
            paginator
            :rows="10"
            ref="dt"
            v-model:selection="selectedProducts"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
            :filters="filters"
        >
        <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 class="m-0">Manage Timesheet</h4>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
            </div>
        </template>
            <Column field="date" header="Date"  style="min-width: 170px">
                <template #editor="{ data, field }">
                    <Calendar v-model="data[field]" showButtonBar/>
                </template>

            </Column>
            <Column field="project" header="Project" sortable style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="projects" optionLabel="label" optionValue="value" placeholder="Select project">
                    </Dropdown>
                </template>
            </Column>
            <Column field="Holiday" header="Holiday" sortable style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="Holiday" optionLabel="label" optionValue="value" placeholder="Select Holiday type">
                    </Dropdown>
                </template>
            </Column>
            <Column field="task" header="Task" sortable style="min-width: 200px">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="description" header="Description" sortable style="min-width: 200px">
                <template #editor="{ data, field }">
                    <Textarea v-model="data[field]" > </Textarea>
                </template>
            </Column>
            <Column field="period" header="Period" sortable style="min-width: 140px">
                <template #editor="{ data, field }" >
                    <div style="display: flex; ">
                        <p style="margin-right: 10px;">From: </p>
                        <Calendar id="calendar-timeonly" v-model="data[field]" timeOnly style="width: 60px" />
                    </div>
                    <div  style="display: flex; margin-top: 10px; ">
                        <p style="margin-right: 27px; ">To: </p>
                        <Calendar id="calendar-timeonly" v-model="data[field]" timeOnly style="width: 60px"/>
                    </div>
                </template>
            </Column>
            <Column field="hours" header="Hours" sortable style="min-width: 50px">
            </Column>
            <Column field="status" header="Status" sortable style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select a Status">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.value" :severity="getSeverity(slotProps.option.value)" />
                        </template>
                    </Dropdown>
                </template>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)"/>
                </template>
            </Column>
            <Column field="" header="Attachments" >
                <template #body="slotProps">
                    <Button :value="slotProps" class="p-button-outlined mr-2 mb-2" label="" severity="success" icon="pi pi-paperclip" @click="visible = true" />
                    <i v-badge="2" class="pi p-overlay-badge" style="display: inline;" >
                        <Button :value="slotProps"   
                        class="p-button-outlined mr-2 mb-2" 
                        label="" severity="info" icon="pi pi-eye" @click="viewAttachement = true" />
                    </i>
                   
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 9px;" bodyStyle="text-align:center"></Column>
            <Column  style="width: 9px;"  bodyStyle="text-align:center">
                <template #body="slotProps">
                <Button icon="pi pi-trash" :value="slotProps"  severity="danger" text rounded aria-label="Cancel" />
            </template>
            </Column>
        </DataTable>
    </div>





    <Dialog v-model:visible="visible" modal header="Upload Files" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="card">
            <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>
        </div>
    </Dialog>
    <Dialog v-model:visible="viewAttachement" modal header="Attached Files" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="col-12">
            <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                <template #header>
                    <div class="grid grid-nogutter">
                        <div class="col-6 text-left">
                            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price" @change="onSortChange($event)" />
                        </div>
                        <div class="col-6 text-right">
                            <DataViewLayoutOptions v-model="layout" />
                        </div>
                    </div>
                </template>
                <template #list="slotProps">
                    <div class="col-12">
                        <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                            <img :src="'http://localhost:5173/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                            <div class="flex-1 text-center md:text-left">
                                <div class="mb-3">{{ slotProps.data.description }}</div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #grid="slotProps">
                    <div class="col-12 md:col-4">
                        <div class="card m-3 border-1 surface-border">
                            <div class="text-center">
                                <img :src="'http://localhost:5173/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-9 shadow-2 my-3 mx-0" />
                                <div class="mb-3">{{ slotProps.data.description }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
    </Dialog>
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
            <span v-if="product">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
        </template>
    </Dialog>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { FilterMatchMode } from 'primevue/api';
import { Timesheet } from '@/apps/timesheet/services/TimesheetService';

const toast = useToast();
const loading = ref(true);
const dt = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const dates = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const customerService = new CustomerService();
const productService = new ProductService();

const customers = ref();
const viewAttachement = ref();
const editingRows = ref([]);
const visible = ref(false);
const statuses = ref([
    { label: 'failed', value: 'failed' },
    { label: 'success', value: 'success' },
    { label: 'in-progress', value: 'in-progress' },
    { label: 'on-hold', value: 'on-hold' }
]);
const projects = ref([
    { label: 'kuwunika', value: 'kuwunika' },
    { label: 'Unicef', value: 'Unicef' },
    { label: 'CDC', value: 'CDC' },
    { label: 'WDF', value: 'WDF' },
    { label: 'PIH', value: 'PIH' }
]);
const Holiday = ref([
    { label: 'Anual Holiday', value: 'anual_holiday' },
    { label: 'Sick Leave', value: 'sick_leave' },
    { label: 'Unpaid Leave', value: 'unpaid_leave' }
]);

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};
const dataviewValue = ref();
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);


const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};
const openNew = () => {
    if(customers.value[customers.value.length-1].date != "")
    {
        customers.value.push({
            "id": "",
            "project": "",
            "task": "",
            "description": "",
            "period": "",
            "hours": "",
            "status": "",
            "date": ""
        
        });
    }
};
const onRowEditSave = (event) => {
    let { newData, index } = event;

    const indexOfObjectToUpdate = customers.value.findIndex(obj => obj.id === newData.id);
    if(customers.value[indexOfObjectToUpdate].date == "")
        insertNew(newData)
    customers.value[indexOfObjectToUpdate] = newData;
    
};
const insertNew = (newData) => {
   const params ={
            "timesheet_date": newData.date,
            "project_id": newData.project,
            "holiday_id": newData,
            "user_id": newData,
            "attachments_id": newData,
            "task": newData.task,
            "description": newData.description,
            "start_time": newData,
            "end_time": newData,
            "status": newData.status
        }
        toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
    // const req = await ApiClient.post('timesheet/create', newData);
    console.log(params)
}
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
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
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const exportCSV = () => {
    dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter(val => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
};


onMounted(() => {
    customerService.getCustomersMedium().then((data) => (customers.value = data));
    productService.getProductsSmall().then((data1) => (dataviewValue.value = data1));
    loading.value = false;
});



const getSeverity = (status) => {
    switch (status) {
        case 'failed':
            return 'danger';

        case 'success':
            return 'success';

        case 'in-progress':
            return 'info';

        case 'on-hold':
            return 'warning';

        case 'unknown':
            return null;

        default:
            return null;
    }
};
</script>



