<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { repositoryUser } from '@/repository/repositoryUser';
import router from '@/router/index.js'
import { useToast } from 'primevue/usetoast';

const { signInUser } = repositoryUser();
const { layoutConfig } = useLayout();
const loadingSignInButton = ref(false);
const userName = ref('');
const password = ref('');
const toast = useToast();

let invalidUserName = ref('');

const signInUserWithDTO = async () => {
    loadingSignInButton.value = true;
    let signInUserDTO = {
        Name: userName.value,
        Password: password.value
    }

    let isSignedIn = await signInUser(signInUserDTO);
    loadingSignInButton.value = false;

    if(isSignedIn) {
        router.push('/');
    }
    else {
        toast.add({ severity: 'error', summary: 'Filed to sign in!', detail: 'Wrong user name or paasword', life: 3000 });
    }
} 

</script>

<template>
    <Toast />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <div class="mb-5 w-9rem flex-shrink-0 text-5xl mt-5">Survery</div> -->
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Sign in survey!</div>
                        <!-- <span class="text-600 font-medium">Sign up to continue</span> -->
                    </div>

                    <div>
                        <label for="userName1" class="block text-900 text-xl font-medium mb-2">User name</label>
                        <InputText id="userName1" type="text" placeholder="User name" :onClick="() => {invalidUserName = ''}" :class="invalidUserName" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="userName" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <InputText id="password1" v-model="password" placeholder="Password" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></InputText>

                        <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div> -->
                        <Button :onClick="signInUserWithDTO" :loading="loadingSignInButton" label="Sign in" class="w-full p-3 text-xl"></Button>
                    </div>

                    <div class="text-center mt-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <Button :onclick="() => router.push({ path: 'signup' })" label="I do not have an account" class="p-button-info p-button-text mr-2 mb-2" />
                        <!-- <span class="text-600 font-medium">Sign up to continue</span> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
