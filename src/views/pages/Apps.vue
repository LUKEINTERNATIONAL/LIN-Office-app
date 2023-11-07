<script setup>
import AppService from '@/service/AppService';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const products = ref([]);
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

const appService = new AppService();

onMounted(() => {
    appService.getApps().then((data) => (products.value = data));
});

const setActiveApp = (app,url) => {
    sessionStorage.setItem('activeApp', app)
    router.push(url);
}
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h3>LIN office Apps</h3>
                <Carousel :value="products" :numVisible="3" :numScroll="3" :circular="true" :responsiveOptions="carouselResponsiveOptions">
                    <template #item="product">
                        <div class="border-round m-2 text-center p-2 " style="border: 1px solid var(--surface-d)" @click="setActiveApp(product.data[0].name,product.data[0].url)">
                            <div class="my-5">
                                <img :src="'images/apps/' + product.data[0].image" :alt="product.data[0].name" class="product-image" />
                            </div>
                            <div>
                                <h4 class="mb-1">
                                    {{ product.data[0].name }}
                                </h4>
                                <h6 class="mt-0 mb-3">{{ product.data[0].description }}</h6>
                                <div class="my-5">
                                    
                                </div>
                            </div>
                        </div>
                        <div class="border-round m-2 text-center p-2 " style="border: 1px solid var(--surface-d)" @click="setActiveApp(product.data[0].name,product.data[0].url)">
                            <div class="my-5">
                                <img :src="'images/apps/' + product.data[1].image" :alt="product.data[1].name" class="product-image" />
                            </div>
                            <div>
                                <h4 class="mb-1">
                                    {{ product.data[1].name }}
                                </h4>
                                <h6 class="mt-0 mb-3">{{ product.data[1].description }}</h6>
                                <div class="my-5">
                                    
                                </div>
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
