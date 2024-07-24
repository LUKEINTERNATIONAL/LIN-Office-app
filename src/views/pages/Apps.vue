<script setup>
import { AppService } from '@/service/AppService';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const apps = ref([]);
const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
const carouselResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);

onMounted(async () => {
    let data = {
        apps: [
            {
                id: 1,
                app_name: 'Timesheet',
                icon_path: 'scheduling.png',
                description: 'Timesheet should be filled in time',
                url: '/nav/timesheet_home',
                status: 'true',
                created_at: '2023-11-12T17:05:53.594756+02:00',
                updated_at: '2023-11-12T17:05:53.594767+02:00'
            },
            {
                id: 2,
                app_name: 'Inventory',
                icon_path: 'inventory.png',
                description: 'Shows the number of items in stock',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:08:05.096944+02:00',
                updated_at: '2023-11-12T17:08:05.096955+02:00'
            },
            {
                id: 3,
                app_name: 'Employee Management',
                icon_path: 'teamwork.png',
                description: 'Allows Employs to request for items',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:08:28.345733+02:00',
                updated_at: '2023-11-12T17:08:28.345743+02:00'
            },
            {
                id: 4,
                app_name: 'HIS Technicals',
                icon_path: 'service.png',
                description: 'Allows Employs to request for items',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:09:10.696696+02:00',
                updated_at: '2023-11-12T17:09:10.696709+02:00'
            },
            {
                id: 5,
                app_name: 'Fleet Management',
                icon_path: 'fleet-management.png',
                description: 'Allows Employs to request for items',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:09:26.375909+02:00',
                updated_at: '2023-11-12T17:09:26.375927+02:00'
            },
            {
                id: 6,
                app_name: 'Holidays',
                icon_path: 'holiday-calendar.png',
                description: 'Allows Employs to request for holidays',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:09:38.923465+02:00',
                updated_at: '2023-11-12T17:09:38.923486+02:00'
            },
            {
                id: 7,
                app_name: 'Traning Management',
                icon_path: 'presentation.png',
                description: 'Allows Employs to manage tranings',
                url: '/nav/dashboard',
                status: 'true',
                created_at: '2023-11-12T17:09:54.910748+02:00',
                updated_at: '2023-11-12T17:09:54.910759+02:00'
            }
        ]
    };

    apps.value = AppService.groupApps(data.apps);
});

const setActiveApp = (app, url) => {
    sessionStorage.setItem('activeApp', app);
    router.push(url);
};
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h3>LIN office Apps</h3>
                <Carousel :value="apps" :numVisible="3" :numScroll="3" :circular="true" :responsiveOptions="carouselResponsiveOptions">
                    <template #item="product">
                        <div class="border-round m-2 text-center p-2" style="border: 1px solid var(--surface-d)" @click="setActiveApp(product.data?.[0].app_name, product.data?.[0].url)">
                            <div class="my-5">
                                <img :src="'images/apps/' + product.data?.[0].icon_path" :alt="product.data?.[0].app_name" class="product-image" />
                            </div>
                            <div>
                                <h4 class="mb-1">
                                    {{ product.data?.[0].app_name }}
                                </h4>
                                <h6 class="mt-0 mb-3">{{ product.data?.[0].description }}</h6>
                                <div class="my-5"></div>
                            </div>
                        </div>

                        <div v-if="product?.data?.[1]" class="border-round m-2 text-center p-2" style="border: 1px solid var(--surface-d)" @click="setActiveApp(product.data?.[0].app_name, product.data?.[0].url ?? '')">
                            <div class="my-5">
                                <img :src="'images/apps/' + product?.data?.[1]?.icon_path ?? ''" :alt="product?.data?.[1]?.app_name ?? ''" class="product-image" />
                            </div>
                            <div>
                                <h4 class="mb-1">
                                    {{ product?.data?.[1]?.app_name ?? '' }}
                                </h4>
                                <h6 class="mt-0 mb-3">{{ product?.data?.[1]?.description ?? '' }}</h6>
                                <div class="my-5"></div>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
        </div>
    </div>
</template>
<style scoped>
.grid {
    margin-right: 5rem;
    margin-left: 5rem;
    margin-top: 5rem;
}
</style>
