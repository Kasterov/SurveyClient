<script setup>

import { ref, onBeforeMount } from 'vue';
import { repositoryPost } from '@/repository/repositoryPost';
import { useRouter, useRoute } from 'vue-router'
import { DateTime  } from 'luxon';

const router = useRouter();
const route = useRoute();
const { editPost, getPostForEdit } = repositoryPost();
const loadingCreatePoolButton = ref(false);
const poolId = ref(null);

const mutlipleSelect = ref(false);
const possibleReVote = ref(false);
const privatePost = ref(false);
const createDate = ref(null);
const updateDate = ref(null);

const poolName = ref(null);
const poolDescription = ref(null);
const poolOptions = ref([{title: ''}]);

const addPoolOption = () => {
    if(poolOptions.value[poolOptions.value.length - 1].title != '' ){

        let option = {
            title: '',
            iterationId: poolOptions.value.length + 1
        }

        poolOptions.value.push(option);
    }
}

const editUserDTO = async () => {

    loadingCreatePoolButton.value = true;

    let editUserDTO = {
        id: poolId.value,
        title: poolName.value,
        description: poolDescription.value,
        isMultiple: mutlipleSelect.value,
        isRevotable: possibleReVote.value,
        IsPrivate: privatePost.value,
        options: poolOptions.value.filter(option => option.title != '' && option.title != null)
    }

    let res = await editPost(editUserDTO);

    loadingCreatePoolButton.value = false;

    if(res) {
        router.push({ path: '/pool-menu' });
    }
} 

const removePoolOption = async (iterationId) => {
    let indexToRemove = poolOptions.value.findIndex(p => p.iterationId === iterationId);
    if (indexToRemove !== -1) {
        poolOptions.value.splice(indexToRemove, 1);
    }
}

onBeforeMount(async () => {
    let postForUpdate = await getPostForEdit(route.params.id);

    poolId.value = postForUpdate.id;
    poolName.value = postForUpdate.title;
    poolDescription.value = postForUpdate.description;
    poolOptions.value = postForUpdate.options;
    mutlipleSelect.value = postForUpdate.isMultiple;
    possibleReVote.value = postForUpdate.isRevotable;
    privatePost.value = postForUpdate.isPrivate;
    createDate.value = postForUpdate.created;
    updateDate.value = postForUpdate.lastModified;

    poolOptions.value.push({
        title: '',
        iterationId: poolOptions.value.length + 1
    });
});

</script>

<template>
    <Toast />
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Edit pool</h5>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText type="text" id="inputtext" v-model="poolName" class="col-12 md:col-12"/>
                        <label for="inputtext">Title</label>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <Textarea inputId="textarea" rows="3" cols="25" v-model="poolDescription"></Textarea>
                        <label for="textarea">Description</label>
                    </span>
                </div>
                <div class="field col-12 md:col-4">Last change: 
                    {{ DateTime.fromJSDate(new Date(updateDate)).toFormat('dd LLLL yyyy') }}
                </div>
                <div class="field col-12 md:col-4">Created: 
                    {{ DateTime.fromJSDate(new Date(createDate)).toFormat('dd LLLL yyyy') }}
                </div>
                <div class="field col-6 md:col-">
                    <label class="block text-xl font-small mb-2">Private (access only by link)</label>
                    <InputSwitch v-model="privatePost" />
                </div> 
                <div class="field col-6 md:col-">
                    <label class="block text-xl font-small mb-2">Multiple selection</label>
                    <InputSwitch v-model="mutlipleSelect" />
                </div>
                <div class="field col-6 md:col-">
                    <label class="block text-xl font-small mb-2">Possible to re-vote</label>
                    <InputSwitch v-model="possibleReVote" />
                </div> 
                <div v-for="(poolOption, index) in poolOptions" :key="index" class="field col-12 md:col-6">
                    <div class="formgroup-inline">
                        
                    </div>
                    <span class="p-float-label">
                        <InputText type="text" :on:input="addPoolOption" :id="'inputtext' + index" v-model="poolOptions[index].title" class="col-12 md:col-12 flex align-items-center justify-content-between"/>
                        <label :for="'inputtext' + index">Option</label>
                    </span>
                    <Button v-if="index + 1 != poolOptions.length" icon="pi pi-trash" class="p-button-rounded p-button-text flex rigth ml-auto" @click="removePoolOption(poolOption.iterationId)" />
                </div>
                <div class="field col-12 md:col-6">
                    <Button label="Edit pool" :loading="loadingCreatePoolButton" :onClick="editUserDTO" class="p-button-raised p-button-primary mr-2 mb-2"/>
                </div>
            </div>
        </div>
    </div>
</template>