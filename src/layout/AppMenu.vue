<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import TimeSheetMenu from '@/apps/timesheet/config/menu.js'
import RequsitionMenu from '@/apps/requsition/config/menu.js'

let model = ref(RequsitionMenu);
if(sessionStorage.getItem('activeApp') == 'Timesheet')
     model = ref(TimeSheetMenu);
else
     model = ref(RequsitionMenu);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
