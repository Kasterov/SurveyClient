<script setup>
import { ref, onBeforeMount} from 'vue';
import { useRoute } from 'vue-router'
import AppConfig from '@/layout/AppConfig.vue';
import { repositoryUser } from '@/repository/repositoryUser';

const route = useRoute();
const { verifyEmail } = repositoryUser();

const congrats = ref("You successfully joined Survey!")
const error = ref("Something went wrond...")
const isVerified = ref(false);

onBeforeMount(async () => {
    isVerified.value = await verifyEmail(route.params.code);
});

const isVerifiedMessage = () => {
    return isVerified.value ? "You successfully joined Survey!" : "Something went wrond...";
}

const isVerifiedMessageDescription = () => {
    return isVerified.value ? "Welcome to the family, son!" : "Wrong code or maybe you already used it"
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                    <span class="text-blue-500 font-bold text-3xl">Survey</span>
                    <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">{{isVerifiedMessage()}}</h1>
                    <div class="text-600 mb-5">{{isVerifiedMessageDescription()}}</div>
                    <router-link to="/auth/signIn" class="w-full flex align-items-center py-5 border-300 border-bottom-1">
                        <span class="flex justify-content-center align-items-center bg-cyan-400 border-round" style="height: 3.5rem; width: 3.5rem">
                            <i class="text-50 pi pi-fw pi-table text-2xl"></i>
                        </span>
                        <span class="ml-4 flex flex-column">
                            <span class="text-900 lg:text-xl font-medium mb-0 block">Sign in</span>
                            <span class="text-600 lg:text-xl">Your account is ready!</span>
                        </span>
                    </router-link>
                    <router-link to="/" class="w-full flex align-items-center py-5 border-300 border-bottom-1">
                        <span class="flex justify-content-center align-items-center bg-orange-400 border-round" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                        </span>
                        <span class="ml-4 flex flex-column">
                            <span class="text-900 lg:text-xl font-medium mb-0">Go to pool hub</span>
                            <span class="text-600 lg:text-xl">Stay unauthorized</span>
                        </span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
