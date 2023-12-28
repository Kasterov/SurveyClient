<script setup>

import { ref, onMounted } from 'vue';
import { repositoryPost } from '@/repository/repositoryPost';
import { useRouter } from 'vue-router'

const router = useRouter();
const { createPost } = repositoryPost();

const poolName = ref(null);
const poolDescription = ref(null);
const poolOptions = ref([{title: ''}]);

const addPoolOption = () => {
    if(poolOptions.value[poolOptions.value.length - 1].title != '' ){

        let option = {
            title: ''
        }

        poolOptions.value.push(option);
    }
}

const createUserDTO = async () => {

    let createPostDTO = {
        title: poolName.value,
        description: poolDescription.value,
        authorId: 6,
        options: poolOptions.value.filter(option => option.title != '' && option.title != null)
    }

    let res = await createPost(createPostDTO);
    
    if(res) {
        router.push({ path: '/poolhub' });
    }
} 

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Create pool</h5>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText type="text" id="inputtext" v-model="poolName" class="col-12 md:col-12"/>
                        <label for="inputtext">Title</label>
                    </span>
                </div>
                <div class="field col-12 md:col-4">
                    <span class="p-float-label">
                        <Textarea inputId="textarea" rows="3" cols="64" v-model="poolDescription"></Textarea>
                        <label for="textarea">Description</label>
                    </span>
                </div>
                <div v-for="(poolOption, index) in poolOptions" :key="index" class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText type="text" :on:input="addPoolOption" :id="'inputtext' + index" v-model="poolOptions[index].title" class="col-12 md:col-12"/>
                        <label :for="'inputtext' + index">Option</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <Button label="Create pool" :onClick="createUserDTO" class="p-button-raised p-button-primary mr-2 mb-2"/>
                </div>
            </div>
        </div>
    </div>
</template>