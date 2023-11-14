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
    <Column field="" header="Leave" sortable style="min-width: 100px">
        <template #editor="{ data, field }">
            <Dropdown v-model="data[field]" :options="leave" optionLabel="label" optionValue="value" placeholder="Select leave type">
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
            <Button :value="slotProps" class="p-button-outlined mr-2 mb-2" label="" severity="info" icon="pi pi-eye" @click="viewAttachement = true" />
        </template>
    </Column>