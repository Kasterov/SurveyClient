<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { repositoryPost } from '@/repository/repositoryPost';
import { useRoute } from 'vue-router'

const route = useRoute();
const { getLitePostById } = repositoryPost();
const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const pieData = ref(null);
const pieOptions = ref(null);
var title = ref(null);

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setChart = async () => {
    let res = await getLitePostById(route.params.id);
    title = res.title;

    pieData.value = {
        labels: res.votes.map(x => x.option),
        datasets: [
            {
                data: res.votes.map(x => x.count),
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'),  documentStyle.getPropertyValue('--red-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400'),  documentStyle.getPropertyValue('--red-500')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};
watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);

</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-12">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">{{title}}</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions">{{title}}</Chart>
            </div>
        </div>
    </div>
</template>