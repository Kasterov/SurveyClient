<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, onMounted, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { repositoryUser } from '@/repository/repositoryUser';
import { useRouter } from 'vue-router'
import store from '@/store';

const router = useRouter();
const { registerUser } = repositoryUser();
const { layoutConfig } = useLayout();

const userName = ref('');
const email = ref('');
const password = ref('');
const dateOfBirthValue = ref(null);

const submitted = ref(false);
const isUserRgistered = ref(false);

const createUserDTO = async () => {

    submitted.value = true;

    if(userName.value && email.value && password.value && dateOfBirthValue.value){

        let createUserDTO = {
            Name: userName.value,
            Password: password.value,
            Email: email.value,
            Gender: 0,
            DateOfBirth: dateOfBirthValue.value
        }

        var res = await registerUser(createUserDTO);
        
        if(res){
            isUserRgistered.value = true;
        }
        else{
            isUserRgistered = false;
        }
    }
} 

onMounted(() => {
    const token = store.getters.getToken
    console.log(token);
    if(token != null) {
        router.push("/"); 
    }
});


</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <div class="mb-5 w-9rem flex-shrink-0 text-5xl mt-5">Survery</div> -->
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div v-if="!isUserRgistered" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Sign up survey!</div>
                        <!-- <span class="text-600 font-medium">Sign up to continue</span> -->
                    </div>
                    <div>
                        <label for="userName1" class="block text-900 text-xl font-medium mb-2">User name</label>
                        <InputText id="userName1" type="text" placeholder="User name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="userName" required="true" :class="{ 'p-invalid': submitted && !userName }"/>

                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" required="true" :class="{ 'p-invalid': submitted && !email }"/>

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }" required="true" :class="{ 'p-invalid': submitted && !password }">
                        </Password>

                        <label for="dateOfBirth" class="p-invalid block text-900 font-medium text-xl mb-2">Date of birth</label>
                        <Calendar class="w-full" :showIcon="true" :showButtonBar="true" v-model="dateOfBirthValue" required="true" :class="{ 'p-invalid': submitted && !dateOfBirthValue }"></Calendar> 
                        <Button :onClick="createUserDTO" label="Sign Up" class="w-full p-3 text-xl mt-5"></Button>
                        <div class="text-center mt-5">
                            <Button :onclick="() => router.push({ path: 'signin' })" label="I have an account" class="p-button-info p-button-text mr-2 mb-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isUserRgistered" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                    <span class="text-blue-500 font-bold text-3xl">Survey</span>
                    <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Please, check your email and verify it</h1>
                    <div class="text-600 mb-5">You almost become member of Survey!</div>
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
