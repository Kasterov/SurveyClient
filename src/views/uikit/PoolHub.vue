<script setup>
import { ref, onMounted } from 'vue';
import PoolhubService from '@/service/PoolhubService';
import { repositoryPost } from '@/repository/repositoryPost';
import { repositoryVote } from '@/repository/repositoryVote';

const { getPoolOptionListByPostId } = repositoryPost();
const { createVoteList } = repositoryVote();

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');

const checkboxValue = ref([]);
const radioValue = ref(null);
const isMultiple = ref(false);

const dataviewValue = ref(null);
const layout = ref('grid');

const poolOptionsModal = ref(null);

const pieOptions = ref({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                },
                position: 'bottom'
            }
        }
    });

const loadingVoteButton = ref(false);

const truncateString = (inputString, maxLength) => {
    if (inputString.length > maxLength) {
        return inputString.substring(0, maxLength - 3) + '...';
    } else {
    return inputString;
    }
}

const vote = async () => {
    loadingVoteButton.value = true;

    let createVoteListDTO = {
        userId: 1,
        voteIdList: radioValue.value ? [radioValue.value] : checkboxValue.value
    }

    await createVoteList(createVoteListDTO);
    loadingVoteButton.value = false

    dataviewValue.value
    .filter(x => x.id == poolOptionsModal.value.id)
    .map(x => {
        let indexes = [];
        let arrayToFilter = [];

        arrayToFilter = isMultiple.value ? checkboxValue.value : [radioValue.value];

        arrayToFilter.forEach((id) => {
        let index = poolOptionsModal.value.options.findIndex((element) => element.id === id);
        if (index !== -1) {
            indexes.push(index);
        }
        });


        for (let index = 0; index < x.datasets[0].data.length; index++) {
            if(indexes.includes(index)){
                x.datasets[0].data[index] ++;
                x.totalCount++;
            }
        }

        return x;
    })

    display.value = false;
    radioValue.value = null;
    checkboxValue.value = [];
};

const display = ref(false);

const poolhubService = new PoolhubService();

const open = async (poolId) => {
    let _poolOptions = await getPoolOptionListByPostId(poolId);
    poolOptionsModal.value = _poolOptions;

    isMultiple.value = _poolOptions.isMultiple;

    display.value = true;
};


const test = () => {
    console.log("tere");
};

const stopPropagation = (event) => {
      event.stopPropagation(); 
};

onMounted(async () => {
    let res = await poolhubService.getPoolHubList();

    let formatedPoolList = [];

    res.map(pool => {
        let tempData = {
            id: pool.id,
            author: pool.author,
            title: pool.title,
            created: pool.created,
            totalCount: pool.totalCount,
            labels: pool.votes.map(x => truncateString(x.option, 40)),
            datasets: [
                {
                    data: pool.votes.map(x => x.count),
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-800'), documentStyle.getPropertyValue('--teal-600'), documentStyle.getPropertyValue('--primary-600'),  documentStyle.getPropertyValue('--purple-800')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-700'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--primary-500'),  documentStyle.getPropertyValue('--purple-700')]
                }
            ],
        }; 
        
        formatedPoolList.push(tempData); 

    });

    dataviewValue.value = formatedPoolList;
});

</script>

<template>
    <Toast />
    <Dialog :header="poolOptionsModal && poolOptionsModal.title" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <div class="grid mt-1">
            <div class="col-12 md:col-12">
                <span>{{ poolOptionsModal.description }}</span>
            </div>
            <div v-for="(poolOption, id) in poolOptionsModal.options" :key="id" class="col-12 md:col-6">
                <div class="card">
                    <div class="field-checkbox mb-1">
                        <RadioButton v-if="!poolOptionsModal.isMultiple" :id="'checkOption' + id" name="option" :value="poolOption.id" v-model="radioValue" />
                        <Checkbox v-if="poolOptionsModal.isMultiple" :id="'checkOption' + id" name="option" :value="poolOption.id" v-model="checkboxValue" />
                        <label :for="'checkOption' + id">{{poolOption.title}}</label>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Vote" :loading="loadingVoteButton" @click="vote()" icon="pi pi-check" class="p-button-outlined"/>
        </template>
    </Dialog>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Pool hub</h5>
                <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div class="card m-2 border-1 surface-border pl-3 pt-3 pr-3 pb-0" :onClick="test" style="cursor: pointer;">
                                <div class="text-center">
                                    <div class="text-xl font-semibold mb-3">{{ slotProps.data.title }}</div>
                                    <Chart type="pie" :data="slotProps.data" :options="pieOptions">{{title}}</Chart>
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                </div>
                                <Divider class="mt-0 mr-0 ml-0 mb-2" layout="horizontal" align="center">
                                    <span class="outline">{{slotProps.data.totalCount}} votes</span>
                                </Divider>
                                <div>
                                    <div class="flex align-items-center justify-content-between">
                                        <div class="flex align-items-center">
                                            <Avatar :image="'demo/images/avatar/amyelsner.png'" class="mr" size="large" shape="circle"></Avatar>
                                            <span class="text-l ml-2">{{ slotProps.data.author.name }}</span>        
                                        </div>
                                        <span class="text-l ml-2">{{ new Date(slotProps.data.created).getDate()}}.{{(new Date(slotProps.data.created).getMonth() + 1).toString().padStart(2, '0')}}.{{new Date(slotProps.data.created).getFullYear()}}</span>
                                    </div>
                                    <div class="flex align-items-center justify-content-between mt-1" v-if="true">
                                        <Button class="p-button-rounded p-button-info p-button-text" label="more" icon="pi pi-ellipsis-h" @click.stop="stopPropagation" />
                                        <Button class="p-button-rounded p-button-info p-button-text" label="share" icon="pi pi-arrow-circle-up" @click.stop="stopPropagation" />
                                        <Button icon="pi pi-chart-pie" label="vote" class="p-button-rounded p-button-text" @click.stop="stopPropagation" @click="open(slotProps.data.id)"/>
                                        <!-- <Button class="p-button-rounded p-button-sm" label="" icon="pi pi-chart-pie" style="width: auto" @click.stop="stopPropagation" @click="open(slotProps.data.id)" /> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>
    </div>
</template>
