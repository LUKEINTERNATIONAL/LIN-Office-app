<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <img src="/public/layout/images/logo.png" alt="Logo" height="20" class="mr-2" />
        Powered by
        <span class="font-medium ml-2">LIN (v1.0.0)</span> 
    </div>
</template>
<style lang="scss" scoped></style>
