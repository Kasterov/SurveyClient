<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import store from '@/store';
import eventBus from '../event-bus';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    store.dispatch('clearToken');
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const searchButton = () => {
    eventBus.emit("SearchPostsQueryEvent", searchPostInput.value  );
}

const searchPostInput = ref('');

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo">
            <router-link to="/">
                <span>Survey</span>
            </router-link>
        </div>

        <div class="p-inputgroup search-topbar" v-if="router.currentRoute.value.path === '/'">
            <span class="p-inputgroup-addon" style="cursor: pointer;" @click="searchButton">
                <i class="pi pi-search"></i>
            </span>
            <InputText placeholder="Start typing..." @keyup.enter="searchButton" v-model="searchPostInput"/>
        </div>

        <!-- <div class="p-inputgroup search-topbar" v-if="router.currentRoute.value.path === '/'">
            <Button label="Search" @click="searchButton"/>
            <InputText placeholder="What are you looking for?" @keyup.enter="searchButton" v-model="searchPostInput"/>
        </div> -->

        <div class="layout-topbar-right-side" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>
            <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
