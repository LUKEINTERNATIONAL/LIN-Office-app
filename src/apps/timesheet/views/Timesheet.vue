<template>
    <Toast />
    <div class="card">
        <Toolbar class="mb-4">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
            </template>
            <template #center>
               <span style="margin-right: 10px; font-weight: 700;">Date Rage: </span> 
               <Calendar 
                    v-model="dates" 
                    selectionMode="range" 
                    view="month" 
                    dateFormat="M/yy" 
                    :maxDate="maxDate" 
                    showButtonBar 
                    :manualInput="false" 
                    @hide="getRageTimesheet()"
                />
            </template>
            <template #end>
                <Button label="Group Date" icon="pi pi-check-circle" severity="info" class="mr-2" @click="groupDateBtn" />
                <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
            </template>
        </Toolbar>
        <DataTable 
            :value="timeSheets" 
            :groupRowsBy="groupDate"
            rowGroupMode="rowspan" 
            sortMode="single" 
            sortField="timesheet_date" 
            :sortOrder="-1" 
            tableStyle="min-width: 50rem"
            dataKey="id"
            paginator
            :rows="10"
            ref="dt"
            v-model:selection="selectedProducts"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
            :filters="filters"
            stripedRows
            editMode="cell" 
            @cell-edit-complete="onCellEditComplete"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h4 class="m-0">Manage Timesheet</h4>
                    <h5 style="font-size: 15px;" > 
                        <b >Status: </b> 
                        <span :class="timesheetStatus">Pending Approval</span>
                    </h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </span>
                </div>
            </template>
            <Column field="timesheet_date" header="Date" sortable style="min-width: 170px">
                <template #editor="{ data, field }">
                    <Calendar v-model="data[field]" dateFormat="dd/M/yy"  showButtonBar/>
                </template>

            </Column>
            <Column field="project_name" header="Project" sortable style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" selected :options="projects" optionLabel="label" optionValue="value" placeholder="Select project">
                    </Dropdown>
                </template>
            </Column>
            <Column field="holiday_name" header="Holiday" sortable style="min-width: 100px">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="holidays" optionLabel="label" optionValue="value" placeholder="Select Holiday type">
                    </Dropdown>
                </template>
            </Column>
            <Column field="task"  header="Task" sortable style="min-width: 200px">
                <template #editor="{ data, field }">
                    <InputText :disabled="holiday_disable" v-model="data[field]" />
                </template>
            </Column>
            <Column field="description" header="Description" sortable style="min-width: 200px">
                <template #editor="{ data, field }">
                    <Textarea :disabled="holiday_disable" v-model="data[field]" > </Textarea>
                </template>
            </Column>
            <Column field="start_time" header="From" sortable style="min-width: 50px">
                <template #editor="{ data, field }" >
                    <div style="display: flex; ">
                        <Calendar  id="calendar-timeonly" showTime hourFormat="24" v-model="data[field]" timeOnly style="width: 60px" />
                    </div>
                </template>
            </Column>
            <Column field="end_time"  header="To" sortable style="min-width: 50px">
                <template #editor="{ data, field }" >
                    <div  style="display: flex; ">
                        <Calendar id="calendar-timeonly" showTime hourFormat="24" v-model="data[field]" timeOnly style="width: 60px"/>
                    </div>
                </template>
            </Column>
            <Column field="hours" header="Hours" sortable style="min-width: 50px">
                <template #body="slotProps">
                 <p>{{ timeDifferenceInHours(slotProps.data.start_time, slotProps.data.end_time) }}</p>
                </template>
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
            <Column   field="attachments_id" header="Attachments" style="min-width: 130px">
                <template #body="slotProps">
                    <Button :value="slotProps" class="p-button-outlined mr-2 mb-2" label="" severity="success" icon="pi pi-paperclip" @click="visible = true" />
                    <Button :value="slotProps"   
                    class="p-button-outlined mr-2 mb-2" 
                    label="" severity="info" icon="pi pi-eye" @click="viewAttachement = true" />
                    <i v-if="attachments" v-badge="2" class="pi p-overlay-badge" style="display: inline;" >
                    </i>
                </template>
            </Column>
            <Column style="width: 9px;"  bodyStyle="text-align:center">
                <template #body="slotProps">
                <Button icon="pi pi-trash" :value="slotProps"  severity="danger" @click="confirmDeleteTimesheet(slotProps)" text rounded aria-label="Cancel" />
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
    
    <Dialog v-model:visible="deleteTimesheetDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product">Are you sure you want to delete <b>{{product.name}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteTimesheetDialog = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="deleteTimesheet" />
        </template>
    </Dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from 'primevue/api';
import { TimesheetService } from '@/apps/timesheet/services/TimesheetService';
import dayjs from "dayjs";

const toast = useToast();
const loading = ref(true);
const holiday_disable = ref(false);
const dt = ref();
const productDialog = ref(false);
const groupDate = ref(sessionStorage.getItem('groupTimesheetDate'));
const deleteTimesheetDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const dates = ref(dayjs().format('MMM/YYYY'));
const timesheetID = ref();
const maxDate = ref(new Date());
const timesheetStatus = ref('timesheetStatus approvalWarningColor');
const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const timeSheets = ref();
const viewAttachement = ref();
const visible = ref(false);
const statuses = ref([
    { label: 'failed', value: 'failed' },
    { label: 'success', value: 'success' },
    { label: 'in-progress', value: 'in-progress' },
    { label: 'on-hold', value: 'on-hold' }
]);
const projects = ref();
const holidays = ref();

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
const dateToTime = (dateString) =>{
    if (typeof dateString === 'object'){
        const hours = dateString.getHours();
        const minutes = dateString.getMinutes();
        const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        return  formattedTime ;
    }else
    {
        return dateString
    }
}
const dataviewValue = ref();
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);


const groupDateBtn = () => {
    groupDate.value ? sessionStorage.setItem("groupTimesheetDate", '') : sessionStorage.setItem("groupTimesheetDate", 'timesheet_date');
    groupDate.value = sessionStorage.getItem('groupTimesheetDate')
}
const openNew = () => {
    if(timeSheets.value[timeSheets.value.length-1].project_id != "")
    {
        timeSheets.value.push(timesheetData());
    }
};
const getRageTimesheet = async() => {
    console.log(dates)
    const params = {
        'start_date':getStartDate(),
        'end_date':getEndDate(),
        'user_id':TimesheetService.getUserID()
    }
    timeSheets.value = await TimesheetService.getTimesheets(params)
};
const timesheetData = ()=>{
    return   {
            "timesheet_date": getTodayDate(),
            "project_id": "",
            "holiday_id": 0,
            "user_id": TimesheetService.getUserID(),
            "attachments_id": 0,
            "task": "",
            "description": "",
            "status": "",
            "start_time": "",
            "end_time": ""
        }
}
const hasEmptyValues =(obj) =>{
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (
                (obj[key] === null 
                || obj[key] === undefined 
                || obj[key] === "")  
                && key != "holiday_name"
                && key != "holiday_id"
                && key != "project_name"
                && key != "project_id"
                && key != "id"
                && key != "attachments_id"
            ) {
                return true;
            }
        }
    }
    return false;
}
const onCellEditComplete = async (event) => {
    let { newData, index } = event;
    newData.start_time = dateToTime(newData.start_time)
    newData.end_time = dateToTime(newData.end_time)
    newData.timesheet_date = dayjs(newData.timesheet_date).format('DD/MMM/YYYY')

    if (Array.isArray(newData.project_name) && newData.project_name.length > 0){
        newData.project_id = newData.project_name[0]
        newData.project_name = newData.project_name[1]
    }
   
    if (Array.isArray(newData.holiday_name) && newData.holiday_name.length > 0){
        newData.holiday_id = newData.holiday_name[0]
        newData.holiday_name = newData.holiday_name[1]
    }

    const indexOfObjectToUpdate = timeSheets.value.findIndex(obj => obj.id === newData.id);
    if(newData.holiday_id !=0){
        newData.start_time = "08:00"
        newData.end_time  = "16:00"
        newData.task  = ''
        newData.description  = ""
        holiday_disable.value = true
    }

    if(timeSheets.value[indexOfObjectToUpdate].id){
        if (!hasEmptyValues(newData) || newData.holiday_id !=0) {
            await TimesheetService.updateTimesheet(newData);
            toast.add({severity:'success', summary: 'Success Message', detail: 'Record updated successfuly', life: 3000});
        }
        else{
            toast.add({severity:'warn', summary: 'Empty Field', detail: 'The field was not update', life: 3000});
            return
        }
    }
    else if (!hasEmptyValues(newData) || newData.holiday_id !=0) {
        await TimesheetService.createTimesheet(newData);
        toast.add({severity:'success', summary: 'Success Message', detail: 'Record created successfuly', life: 3000});
    }else{
        toast.add({severity:'warn', summary: 'Not saved', detail: 'Please fill in the remaing fields', life: 3000});
    }

    timeSheets.value[indexOfObjectToUpdate] = newData;
    
};
const getTodayDate = () => {
    return dayjs().format('DD/MMM/YYYY')
}
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const editProduct = (prod) => {
    product.value = {...prod};
    productDialog.value = true;
};
const confirmDeleteTimesheet = (id) => {
    timesheetID.value = id.data['id']
    deleteTimesheetDialog.value = true;
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

function timeToMinutes(time) {
    time = dateToTime(time)
    const [hours, minutes] = time?.split(':').map(Number);
    return hours * 60 + minutes;
}

// Function to find the difference in hours between two times
function timeDifferenceInHours(startTime, endTime) {
    const minutesDifference = timeToMinutes(endTime) - timeToMinutes(startTime);
    const hoursDifference = minutesDifference / 60;
    return hoursDifference.toFixed(2);
}
onMounted( async () => {
    listProjects()
    listHolidays()
    const params = {
        'start_date':getStartDate(),
        'end_date':getEndDate(),
        'user_id':TimesheetService.getUserID()
    }
    timeSheets.value = await TimesheetService.getTimesheets(params)
    timeSheets.value = timeSheets.value['projects']
    loading.value = false;
});
const getStartDate=(date=getTodayDate())=>{
    return dayjs(date).startOf("month").format('DD/MMM/YYYY')
}
const getEndDate=(date=getTodayDate())=>{
    return dayjs(date).endOf("month").format('DD/MMM/YYYY')
}
const listProjects = async () =>{
    let data = await TimesheetService.getProjects()
    projects.value = data?.projects.map(project => ({
        label: project.project_name,
        value: [project.id,project.project_name]
     }));
}   
const listHolidays = async () =>{
    let data = await TimesheetService.getHolidays()
    holidays.value = data?.holidays.map(holiday => ({
        label: holiday.holiday_name,
        value: [holiday.id,holiday.holiday_name]
     }));
}

const deleteObjectById =(array, id) => {
  return array.filter(item => item.id !== id);
}

const deleteTimesheet = async () =>{
    deleteTimesheetDialog.value = false;
    console.log(timeSheets.value)
    timeSheets.value = deleteObjectById(timeSheets.value, timesheetID.value)
    await TimesheetService.deleteTimesheet({'id':timesheetID.value});
    toast.add({severity:'success', summary: 'Successful', detail: 'Timesheet Deleted', life: 3000});
}

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
<style scope>
.timesheetStatus{
    color:rgb(109, 106, 106);
    border-radius: 6px;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    padding: 5px 8px 2px;
}
.approvalDangerColor{
    background-color: #eec6c6;
}
.approvalSuccessColor{
    background-color: #c6eee1;
}
.approvalWarningColor{
    background-color: #eeecc6;
}

</style>



