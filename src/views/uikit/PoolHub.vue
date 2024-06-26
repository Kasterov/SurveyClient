<script setup>
import { ref, onMounted } from 'vue';
import PoolhubService from '@/service/PoolhubService';
import { repositoryPost } from '@/repository/repositoryPost';
import { repositoryVote } from '@/repository/repositoryVote';
import { repositorySavedPost } from '@/repository/repositorySavedPost';
import { useToast } from 'primevue/usetoast';
import { DateTime  } from 'luxon';
import ProgressSpinner from 'primevue/progressspinner';
import { watch } from 'vue';
import eventBus from '@/event-bus.js'
import { useRouter } from 'vue-router'
import { repositoryComplain } from '@/repository/repositoryComplain';

const { createComplain } = repositoryComplain();
const toast = useToast();

const router = useRouter();
const { getPoolOptionListByPostId } = repositoryPost();
const { createVoteList } = repositoryVote();
const { createSavedPost, isSavedPost } = repositorySavedPost();

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');

const checkboxValue = ref([]);
const radioValue = ref(null);
const isMultiple = ref(false);

const dataviewValue = ref(null);
const layout = ref('grid');
const scrolled = ref(true);
const postCount = ref(1);

const customLazyParams = ref({pageSize: 6, page: 1});

const handleScroll = async (event) => {
    const scrollableElement = event.target;
    const scrollPercentage = (scrollableElement.scrollTop / (scrollableElement.scrollHeight - scrollableElement.clientHeight)) * 100;

    if (scrollPercentage >= 80 && dataviewValue.value.length < postCount.value) {
        scrolled.value == false

        customLazyParams.value.page++;

        customLazyParams.value.page = customLazyParams.value.page;

        let mappedPagnationResponseDTO = await poolhubService.getPoolHubList(customLazyParams.value);
        postCount.value = mappedPagnationResponseDTO.totalCount;

        dataviewValue.value = dataviewValue.value.concat(mappedPagnationResponseDTO.responseList);
    } 
}

const menuPoolId = ref(null);
const commentComplain = ref(null);

const menuExprot = () => {
    console.log(menuPoolId.value);
}

const menuComplain = () => {
    displayMenu.value = true; 
    console.log(menuPoolId.value);
}

const menuSave = async () => {
    var res = await createSavedPost({postId: menuPoolId.value});

    if(res == true){
        toast.add({ severity: 'success', summary: 'Post saved!', life: 1000 });
    }
    else {
        toast.add({ severity: 'error', summary: 'Error in post saving!', life: 1000 });
    }
}

const complainSendButtonLoading = ref(false);

const sendComplain = async () => {
    complainSendButtonLoading.value = true;

    let complainDTO = {
        postId: menuPoolId.value,
        comment: commentComplain.value,
        complainReason: complainReason.value.value
    };

    let res = await createComplain(complainDTO);

    if(res == true){
        complainSendButtonLoading.value = false;
        displayMenu.value = true;
        toast.add({ severity: 'success', summary: 'Complain sended! Thanks!', life: 1000 });
    }
    else {
        complainSendButtonLoading.value = false;
        toast.add({ severity: 'error', summary: 'Error in complain sending!', life: 1000 });
    }
}

const complainReasons = ref([
    { name: 'Inappropriate content', value: 0 },
    { name: 'Violence', value: 1 },
    { name: 'Terrorism', value: 2 },
    { name: 'Propaganda', value: 3 },
    { name: 'Violation of law', value: 4 },
    { name: 'Religious appeasement', value: 5 },
    { name: 'Other', value: 6 },
]);

const complainReason = ref(complainReasons.value[0]);

const overlayMenuMoreItems = ref([
    {
        label: 'Export',
        icon: 'pi pi-file-export',
        command: menuExprot
    },
    {
        label: 'Сomplain',
        icon: 'pi pi-flag',
        command: menuComplain
    },
    {
        label: 'Save',
        icon: 'pi pi-bookmark',
        command: menuSave
    }]);

const menu = ref(null);

const isPostSaved = ref(false);

const toggleMenuMore = async (event, _menuPoolId) => {
    // console.log(menu.value);
    //var res = await isSavedPost(_menuPoolId);
    // if (menu.value && menu.value.toggle) {
    //     console.log(menu.value);
    //     menu.value.toggle(event);
    // }

    menu.value.toggle(event);
    menuPoolId.value = _menuPoolId;
};

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

const vote = async (postId) => {
    loadingVoteButton.value = true;

    let createVoteListDTO = {
        postId: postId,
        voteIdList: radioValue.value ? [radioValue.value] : checkboxValue.value
    }

    let res = await createVoteList(createVoteListDTO);
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

    if(res){
        toast.add({ severity: 'success', summary: 'Voted', life: 1000 });
    }
};

const displayMenu = ref(false);
const display = ref(false);
const isPostRevotable = ref(false);
const isPostVoted = ref(false);

const poolhubService = new PoolhubService();

const open = async (poolId) => {
    let _poolOptions = await getPoolOptionListByPostId(poolId);
    poolOptionsModal.value = _poolOptions;

    isMultiple.value = _poolOptions.isMultiple;

    let selectedOptions = _poolOptions.options.filter(o => o.isSelected).map(o => o.id);
    isPostRevotable.value = _poolOptions.isRevotable;

    if(selectedOptions.length == 0){
        display.value = true;
        isPostVoted.value = false;
        return;
    }

    isPostVoted.value = true;

    if(isMultiple.value){
        checkboxValue.value = selectedOptions;
    }
    else {
        radioValue.value = selectedOptions[0];
    }

    display.value = true;
};


const routeToPost = (id) => {
    router.push({ path: `/pool/${id}` });
};

const routeToProfile = (id) => {
    router.push({ path: `/profile-view/${id}` });
};

const copyUrl = (id) => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(`${currentUrl}pool/${id}`);
    toast.add({ severity: 'success', summary: 'Link copied', life: 1000 });   
}

const stopPropagation = (event) => {
      event.stopPropagation(); 
};

// watch(display => {
//     if(display.value){
//         dataviewValue.value = [];
//         radioValue.value = [];
//     }
// });

onMounted(async () => {
    let mappedPagnationResponseDTO = await poolhubService.getPoolHubList(customLazyParams.value);
    postCount.value = mappedPagnationResponseDTO.totalCount;

    dataviewValue.value = mappedPagnationResponseDTO.responseList;
});

const postSearchQuery = ref('');

eventBus.on("SearchPostsQueryEvent", async (data) => {
    postSearchQuery.value = data;
    customLazyParams.value.searchQuery = postSearchQuery.value;
    customLazyParams.value.pageSize = 6;
    customLazyParams.value.page = 1;

    let mappedPagnationResponseDTO = await poolhubService.getPoolHubList(customLazyParams.value);
    postCount.value = mappedPagnationResponseDTO.totalCount;

    dataviewValue.value = mappedPagnationResponseDTO.responseList;
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
            <Tag v-if="isPostVoted && !isPostRevotable" class="mr-2 mb-2" con="pi pi-exclamation-triangle" severity="primary" value="You have already voted"></Tag>
            <Button v-if="!isPostVoted || isPostRevotable" label="Vote" :loading="loadingVoteButton" @click="vote(poolOptionsModal.id)" icon="pi pi-check" class="p-button-outlined"/>
        </template>
    </Dialog>
    <Dialog header="Create complain" v-model:visible="displayMenu" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <div class="grid mt-1">
            <div class="col-12 md:col-12">
                <span class="p-float-label">
                    <Dropdown id="complainReasons" :options="complainReasons" v-model="complainReason" optionLabel="name"></Dropdown>
                    <label for="complainReasons">Reason</label>
                </span>
            </div>
            <div class="col-12 md:col-12">
                <span class="p-float-label">
                    <Textarea inputId="textarea" rows="3" cols="25" v-model="commentComplain"></Textarea>
                    <label for="textarea">Description (optional)</label>
                </span>
            </div>
        </div>
        <template #footer>
            <Button label="Send complain" :loading="complainSendButtonLoading" @click="sendComplain" icon="pi pi-flag-fill" class="p-button-outlined"/>
        </template>
    </Dialog>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <!-- <h5>Pool hub</h5> -->
                <DataView :value="dataviewValue" :layout="layout" :paginator="false" :rows="9" style="max-height: 40rem; overflow-y: auto;" @scroll="handleScroll">
                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div class="card m-2 border-1 surface-border pl-3 pt-3 pr-3 pb-0" @click="routeToPost(slotProps.data.id)" style="cursor: pointer;">
                                <div class="text-center">
                                    <div class="text-xl font-semibold mb-3">{{ slotProps.data.title }}</div>
                                    <Chart type="doughnut" :data="slotProps.data" :options="pieOptions">{{title}}</Chart>
                                    <!-- <div class="flex align-items-center justify-content-between" v-if="slotProps.data.totalCount == 0">No answers yet :/</div> -->
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                </div>
                                <Divider class="mt-0 mr-0 ml-0 mb-2" layout="horizontal" align="center">
                                    <span class="outline">{{slotProps.data.totalCount}} votes</span>
                                </Divider>
                                <div>
                                    <div class="flex align-items-center justify-content-between">
                                        <div class="flex align-items-center" @click.stop="stopPropagation" @click="routeToProfile(slotProps.data.author.id)">
                                            <Avatar :image="slotProps.data.author.avatarLink" class="mr" size="large" shape="circle"></Avatar>
                                            <span class="text-l ml-2">{{ slotProps.data.author.name }}</span>        
                                        </div>
                                        <span class="text-l ml-2">{{ DateTime.fromJSDate(new Date(slotProps.data.created)).setLocale("en").toRelative()}}</span>
                                    </div>
                                    <div class="flex align-items-center justify-content-between mt-1">
                                        <Button class="p-button-rounded p-button-info p-button-text" label="more" icon="pi pi-ellipsis-h" @click="(event) => toggleMenuMore(event, slotProps.data.id)" @click.stop="stopPropagation" />
                                        <Menu ref="menu" :model="overlayMenuMoreItems" :popup="true"/>
                                        <Button class="p-button-rounded p-button-info p-button-text" label="share" icon="pi pi-send" @click="copyUrl(slotProps.data.id)" @click.stop="stopPropagation" />
                                        <Button icon="pi pi-chart-pie" label="vote" class="p-button-rounded p-button-text" @click.stop="stopPropagation" @click="open(slotProps.data.id)"/>
                                        <!-- <Button class="p-button-rounded p-button-sm" label="" icon="pi pi-chart-pie" style="width: auto" @click.stop="stopPropagation" @click="open(slotProps.data.id)" /> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
                <!-- <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" /> -->
            </div>
        </div>
    </div>
</template>

<!-- <style>
  body {
    overflow: hidden;
  }
</style> -->
