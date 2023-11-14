<template>
    <div class="col-12">
        <div class="card">
            <h4>Manage Account Details</h4>
            <div class="grid p-fluid">
                <div class="col-12 md:col-6">
                    <h5>Firstname</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Firstname" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Surname</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Surname" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Username</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Birthdate</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Birthdate" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Phone</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Phone" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Role</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Role" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Position</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Position" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Email</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Email" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <h5>Project(s)</h5>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Project(s)" />
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
</template>

<script setup>
import { ref } from 'vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
</script>