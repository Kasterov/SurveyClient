<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { repositoryPost } from '@/repository/repositoryPost';
import { useRoute } from 'vue-router'
import { DateTime  } from 'luxon';

const route = useRoute();
const { getLitePostById } = repositoryPost();
const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const pieOptions = ref(null);
const title = ref(null);
const description = ref(null);
const isRevoteable = ref(false);
const isMultiple = ref(false);
const isPrivate = ref(false);
const createDate = ref(null);
const updateDate = ref(null);
const poolOptions = ref(null);
const author = ref({
    avatarLink: null
});
const totalCount = ref(null);

const barData = ref({});

const barOptions = {
    plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
}

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const setChart = async () => {
    let res = await getLitePostById(route.params.id);
    title.value = res.title;
    description.value = res.description;
    isRevoteable.value = res.isRevotable;
    isMultiple.value = res.isMultiple;
    isPrivate.value = res.isPrivate;
    createDate.value = res.created;
    updateDate.value = res.lastModified;
    poolOptions.value = res.votes;
    author.value = res.author;
    totalCount.value = res.totalCount;

    barData.value = {
        labels: res.votes.map(x => x.option),
        datasets: [
            {
                label: 'Pool analytics',
                backgroundColor: [documentStyle.getPropertyValue('--blue-700'), documentStyle.getPropertyValue('--red-700'), documentStyle.getPropertyValue('--green-700'),  documentStyle.getPropertyValue('--purple-700'),  documentStyle.getPropertyValue('--indigo-700'), documentStyle.getPropertyValue('--pink-700'), documentStyle.getPropertyValue('--orange-700')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-600'), documentStyle.getPropertyValue('--red-600'), documentStyle.getPropertyValue('--green-600'),  documentStyle.getPropertyValue('--purple-600'),  documentStyle.getPropertyValue('--indigo-600'), documentStyle.getPropertyValue('--pink-600'), documentStyle.getPropertyValue('--orange-600')],
                data: res.votes.map(x => x.count)
            }
        ]
    }
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);

const calculatePrecente = (count) => {
    let precente = ((count / totalCount.value)*100).toFixed(0);
    return `${count} votes / ${precente} %`;
}
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-12">
            <div class="card flex flex-column align-items-center">
                <div class="flex align-items-center">
                    <!-- <Avatar :image="author.avatarLink" class="mr" size="large" shape="circle"></Avatar>
                    <span class="text-l ml-2">{{ author.name }}</span>        -->
                    <h3 class="text-center w-full">{{title}}</h3> 
                </div>
                <Divider class="mt-0 mr-0 ml-0 mb-2" layout="horizontal" align="center">
                    👇
                </Divider>
            </div>
        </div>
        <div class="col-12 xl:col-12">
                <Panel :toggleable="true">
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar :image="author.avatarLink" size="large" shape="circle" />
                            <span class="font-bold">{{author.name}}</span>
                            <button class="p-panel-header-icon p-link mr-2" @click="toggle">
                                <Button icon="pi pi-bookmark" severity="secondary" rounded text></Button>
                            </button>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                            <span class="p-text-secondary">Created {{ DateTime.fromJSDate(new Date(createDate)).setLocale("en").toRelative() }}</span>
                        </div>
                            </template>
                            <template #icons>
                                <Menu ref="menu" id="config_menu" :model="items" popup />
                            </template>
                            <p class="m-0">
                                {{description}}
                            </p>
                </Panel>
            </div>
        <div class="col-12 xl:col-12">
            <Panel :header="'Pool results - ' + totalCount + ' votes'" :toggleable="true">
                <div class="field col-12 md:col-6">
                    <Chart type="bar" :data="barData" :options="barOptions"></Chart>
                </div>
            </Panel>
        </div>
        <div class="col-12 xl:col-12">
            <Panel header="Settings" :toggleable="true">
                <div class="field col-12 md:col-12 text-xl">Possible to revote: 
                    <Tag v-if="!isRevoteable" class="mr-2" severity="warning" value="No"></Tag>
                    <Tag v-if="isRevoteable" class="mr-2" severity="info" value="Yes"></Tag>
                </div>
                <div class="field col-12 md:col-12 text-xl">Possible multiple selection:
                    <Tag v-if="!isMultiple" class="mr-2" severity="warning" value="No"></Tag>
                    <Tag v-if="isMultiple" class="mr-2" severity="info" value="Yes"></Tag>
                </div>
                <div class="field col-12 md:col-12 text-xl">Private pool:
                    <Tag v-if="!isPrivate" class="mr-2" severity="warning" value="No"></Tag>
                    <Tag v-if="isPrivate" class="mr-2" severity="info" value="Yes"></Tag>
                </div>
                <div class="field col-12 md:col-12 text-xl">Last change: 
                    {{ DateTime.fromJSDate(new Date(updateDate)).toFormat('dd LLLL yyyy') }}
                </div>
                <div class="field col-12 md:col-12 text-xl">Created: 
                    {{ DateTime.fromJSDate(new Date(createDate)).toFormat('dd LLLL yyyy') }}
                </div>
            </Panel>
        </div>
    </div>
</template>