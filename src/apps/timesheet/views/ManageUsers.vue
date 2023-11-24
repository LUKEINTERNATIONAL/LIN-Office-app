<template>
    <Toast />
    <div class="card">
        <Toolbar class="mb-4">
            <template #end>
                <Button label="Add User" icon="pi pi-plus" @click="adduser()" severity="info" style="margin-right: 10px;" />
            </template>
        </Toolbar>
        <DataTable :value="users" showGridlines tableStyle="min-width: 50rem"
        :paginator="true" :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
        <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                <h4 class="m-0">Manage Users</h4>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
            </div>
        </template>
            <Column field="name" header="Name"></Column>
            <Column field="username" header="Username"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Phone"></Column>
            <Column field="is_superuser" header="Admin"></Column>
            <Column field="project_name" header="Projects"></Column>
            <Column field="occupation_name" header="Occupation"></Column>
            <Column field="manager" header="Manager"></Column>
            <Column field="Action" header="Action">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>


    <Dialog v-model:visible="userDialog" :style="{width: '700px'}" header="User Details" :modal="true" class="p-fluid">
            <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" 
            :alt="product.image" class="block m-auto pb-3" />
           
            <div class="formgrid grid">
                <div class="field col">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="user.name"  />
                </div>
                <div class="field col">
                    <label for="username">Username</label>
                    <InputText id="username" v-model="user.username" integeronly />
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label for="phone">Phone</label>
                    <InputNumber id="phone" v-model="user.phone"  />
                </div>
                <div class="field col">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="user.email" integeronly />
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label for="admin">Admin</label>
                    <MultiSelect v-model="user.is_superuser" display="chip" 
                        :options="cities" optionLabel="name" placeholder="Select Admin"
                        filter
                        :maxSelectedLabels="3"  />
                </div>
                <div class="field col">
                    <label for="Project">Project(s)</label>
                    <MultiSelect v-model="user.project" display="chip" 
                        :options="projects" optionLabel="name" placeholder="Select Project"
                        filter
                        :maxSelectedLabels="3"  />
                </div>
            </div>
            <div class="formgrid grid">
                <div class="field col">
                    <label for="occupation">Occupation</label>
                    <MultiSelect v-model="user.occupation" display="chip" 
                        :options="cities" optionLabel="name" placeholder="Select Occupation"
                        filter
                        :maxSelectedLabels="3"  />
                </div>
                <div class="field col">
                    <label for="Manager">Manager</label>
                    <MultiSelect v-model="selectedCities" display="chip" 
                        :options="cities" optionLabel="name" placeholder="Select Manager"
                        filter
                        :maxSelectedLabels="3"  />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" text @click="saveUser" />
            </template>
    </Dialog>

        <Dialog v-model:visible="deleteuserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteuserDialog = false"/>
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
const toast = useToast();
const dt = ref();
const userDialog = ref(false);
const deleteuserDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { UserService } from '@/apps/timesheet/services/UserService';
import { ProjectService } from '@/apps/timesheet/services/ProjectService';
import { OccupationService } from '@/apps/timesheet/services/OccupationService';

const users = ref();
const occupations = ref();
const projects = ref();
const user = ref();
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const openNew = () => {
    product.value = {};
    submitted.value = false;
    userDialog.value = true;
};
const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};
const saveUser = async () => {
    console.log(user.value)
    if(user.value.id){
        await UserService.updateUser(user.value)
        toast.add({severity:'success', summary: 'Successful', detail: 'Update User', life: 3000});
        userDialog.value = false;
        
    }else{
        var tt =await UserService.createUser(user.value)
        console.log(tt)
        toast.add({severity:'success', summary: 'Successful', detail: 'Create User', life: 3000});
        userDialog.value = false;
    }
    const indexOfObjectToUpdate = users.value.findIndex(obj => obj.id === user.value.id);

    console.log(indexOfObjectToUpdate)
    users.value[indexOfObjectToUpdate] = user.value;
    
 
};
const editUser = (usr) => {
    user.value = {...usr};
    userDialog.value = true;
};
const adduser = () => {
    user.value = {};
    userDialog.value = true;
};
const confirmDeleteProduct = (user) => {
    user.value = user;
    deleteuserDialog.value = true;
};
const deleteProduct = () => {
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteuserDialog.value = false;
    product.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
};
onMounted(async() => {
    users.value = await UserService.getUsers()
    projects.value = await ProjectService.getProjects()
    occupations.value = await OccupationService.getOccupations()
});

const products = ref();

</script>
