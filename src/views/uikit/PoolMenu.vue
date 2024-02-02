<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { repositoryPost } from '@/repository/repositoryPost';
import { useRouter } from 'vue-router'

const router = useRouter();

const { getPostMenu, deletePost } = repositoryPost();

const toast = useToast();

const postToDeleteId = ref({});
const product = ref(null);
const deleteProductDialog = ref(false);
const postMenuContent = ref([]);

const confirmDeletePostModal = (postId) => {
    postToDeleteId.value = postId;
    deleteProductDialog.value = true;
};

const deletePostById = async () => {
    await deletePost(postToDeleteId.value);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Post deleted', life: 4000 });
    postMenuContent.value.responseList = postMenuContent.value.responseList.filter((post) => post.id !== postToDeleteId.value);
    deleteProductDialog.value = false;
};

onMounted(() => {
    loading.value = true;

    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
        filters: filters.value
    };

    loadLazyData();
});

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const customers = ref();
const selectedCustomers = ref();
const selectAll = ref(false);
const first = ref(0);
const searchText = ref(null);
const filters = ref({
    'name': {value: '', matchMode: 'contains'},
    'country.name': {value: '', matchMode: 'contains'},
    'company': {value: '', matchMode: 'contains'},
    'representative.name': {value: '', matchMode: 'contains'},
});
const lazyParams = ref({});
const customLazyParams = ref({});

const loadLazyData = async (event) => {
    loading.value = true;

    if(event){
        customLazyParams.value = {
            searchQuery: searchText,
            pageSize: event.rows ? event.rows : 10,
            page: event.page ? event.page + 1 : 1,
            sortColumn: event.sortField,
            sortOrder: event.sortOrder == 1 ? "desc" : "asc"
        }
    }

    postMenuContent.value = await getPostMenu(customLazyParams.value);
    totalRecords.value = postMenuContent.value.totalCount
    loading.value = false;
};

const onSearchInput = (event) => {
    loadLazyData(event);
}

const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onSort = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onFilter = (event) => {
    lazyParams.value.filters = filters.value ;
    loadLazyData(event);
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                
                <DataTable 
                    :value="postMenuContent.responseList" lazy paginator 
                    :first="first" 
                    :rows="5"
                    ref="dt" dataKey="id"
                    :totalRecords="totalRecords" 
                    :loading="loading" 
                    @page="onPage($event)"
                    @sort="onSort($event)" 
                    @filter="onFilter($event)"
                    v-model:selection="selectedCustomers">
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <router-link to="/createpool" target="_blank">
                                <Button type="button" icon="pi pi-plus" label="Create pool" class="p-button-outlined mb-2"/>
                            </router-link>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText placeholder="Search" style="width: 100%" v-model="searchText" @input="onSearchInput"/>
                            </span>
                        </div>
                    </template>
                    <Column field="title" header="Title" :sortable="false   " headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Title</span>
                            {{ slotProps.data.title }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag class="mr-2" icon="pi pi-check" severity="success" value="Published"></Tag>
                        </template>
                    </Column>
                    <Column field="votes" header="Votes" :sortable="false" headerStyle="width:20%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Votes</span>
                            {{ slotProps.data.votes }}
                        </template>
                    </Column>
                    <Column field="people" header="People" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">People</span>
                            {{ slotProps.data.people }}
                        </template>
                    </Column>
                    <Column field="options" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-primary mr-2" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-info mt-2" @click="confirmDeletePostModal(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to delete this post?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePostById" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
