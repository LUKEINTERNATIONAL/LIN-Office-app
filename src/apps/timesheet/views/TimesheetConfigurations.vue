<template>
    <div style="display: flex;justify-content: center;">
     

        <div class="col-12">
        <div class="card">
            <h4>Manage Account Details</h4>
            <div class="grid p-fluid">
                <div class="col-12 md:col-6">
                    <h5>Reminder Date</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i>
                        </span>
                        <Calendar v-model="reminderDate" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Warning Date</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i>
                        </span>
                        <Calendar v-model="warningDate" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Last Date</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-calendar"></i>
                        </span>
                        <Calendar v-model="lastDate" />
                    </div>
                </div>
                <div class="col-12 md:col-12">
                    <div style="float:right;">
                        <Button icon="pi pi-check" label="Save" class="p-button-raised p-button-info mr-2 mb-2" />
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    </div>
</template>
<script setup>
import { ref } from "vue";

const lastDate = ref();
const reminderDate = ref();
const warningDate = ref();
</script>