<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primevue/api';


const toast = useToast();
const filters = ref();
const loading = ref(true);

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
const leave = ref([
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
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};
initFilters();
const clearFilter = () => {
    initFilters();
};
onMounted(() => {
    customerService.getCustomersMedium().then((data) => (customers.value = data));
    productService.getProductsSmall().then((data1) => (dataviewValue.value = data1));
    loading.value = false;

    console.log(customers )
});

const onRowEditSave = (event) => {
    let { newData, index } = event;

    // customers.value[index] = newData;
};

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
<template>
    <div class="card">
        <Toast />
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
            v-model="filters"
            filterDisplay="menu" 
            :loading="loading" 
            paginator
            :rows="10"
            :globalFilterFields="['date', 'project', 'task', 'description', 'period']"
        >
        <template #header>
            <div class="flex justify-content-between">
                <div>
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" style="margin-right: 10px;" outlined @click="clearFilter()" />
                    <Button type="button" icon="pi pi-plus" label="Add" outlined @click="clearFilter()" />
                </div>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </span>
            </div>
        </template>

        <template #empty> No Record found. </template>
        <template #loading> Loading data. Please wait. </template>
            <Column field="date" header="Date" style="min-width: 170px">
                <template #editor="{ data, field }">
                    <Calendar v-model="data[field]" showButtonBar/>
                </template>

                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="project" header="Project" filterField="Project" style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="projects" optionLabel="label" optionValue="value" placeholder="Select project">
                    </Dropdown>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="" header="Leave" style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="leave" optionLabel="label" optionValue="value" placeholder="Select leave type">
                    </Dropdown>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="task" header="Task" style="min-width: 200px">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="description" header="Description" style="min-width: 200px">
                <template #editor="{ data, field }">
                    <Textarea v-model="data[field]" > </Textarea>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="period" header="Period" style="min-width: 140px">
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
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="hours" header="Hours" style="min-width: 50px">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="status" header="Status" style="min-width: 100px">
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
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="" header="Attachments" >
                <template #body="slotProps">
                    <Button :value="slotProps" class="p-button-outlined mr-2 mb-2" label="" severity="success" icon="pi pi-paperclip" @click="visible = true" />
                    <Button :value="slotProps" class="p-button-outlined mr-2 mb-2" label="" severity="info" icon="pi pi-eye" @click="viewAttachement = true" />
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10px; min-width: 7rem" bodyStyle="text-align:center"></Column>
            <Column field="" header="">
                <template #body="slotProps">
                    <Button :value="slotProps" style="width: 20px;padding: unset;" class="mr-2 mb-2" text label="" severity="danger" icon="pi pi-trash" />
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
</template>


