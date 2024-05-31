<script setup>
import { ref, onBeforeMount} from 'vue';
import { useRoute } from 'vue-router'
import { repositoryUser } from '@/repository/repositoryUser';
import { DateTime  } from 'luxon';

const { getProfileViewData } = repositoryUser();
const route = useRoute();

const userData = ref({})
const countryCodeIcon = ref("");

const educationList = ref(["Software developer", "Recruties spesialist"]);


onBeforeMount(async () => {
    let _userData = await getProfileViewData(route.params.id);

    userData.value = {
        avatar: _userData.avatarLink,
        name: _userData.name,
        bio: _userData.bio,
        country: _userData.country.countryCode,
        registrationDate: _userData.registrationDate,
        educations: _userData.educations,
        jobs: _userData.jobs,
        hobbies: _userData.hobbies,
    }

    countryCodeIcon.value = "ml-2 flag flag-" + userData.value.country.toLowerCase();
    console.log(userData.value);
});

</script>



<template>
    <Toast/>
    <!-- style="background-image: url('demo/images/avatar//Space_love_fall.jpg');" -->
    <div class="card">
        <div class="grid p-fluid rounded-section">
            <div class="field col-12 md:col-4">
                <Avatar :image="userData.avatar" style="width: 10rem; height: 10rem;" shape="circle"></Avatar>
            </div>
        </div>
        <div class="grid p-fluid rounded-section">
            <div class="field col-12 md:col-4 text-5xl">
                <span> {{userData.name}} </span>
                <span :class="countryCodeIcon" style="width: 36px; height: 24px" />
            </div>
            <!-- <div class="field col-12 md:col-2 text-xl flex align-items-center">
                <span class="align-items-center justify-content-between">1242 subscribers</span>
            </div> -->
            <div class="field col-12 md:col-3 text-xl flex align-items-center">
                <span class="align-items-center justify-content-between">With Survey from {{DateTime.fromJSDate(new Date(userData.registrationDate)).toFormat('dd LLLL yyyy')}}</span>
            </div>
        </div>
        <TabView>
            <TabPanel header="Bio">
                <div class="field col-12 md:col-12">
                    <Panel header="Bio" :toggleable="true"> 
                        <span>{{userData.bio}}</span>
                    </Panel>
                </div>
                <div class="col-12 xl:col-12">
                    <Panel header="Educations" :toggleable="true">
                        <div v-for="(education, index) in userData.educations" :key="index" class="field col-12 md:col-6">
                            <div class="text-left w-full text-xl">{{ education.name }} - {{ education.description }}</div>
                        </div>
                    </Panel>
                </div>
                <div class="col-12 xl:col-12">
                    <Panel header="Jobs" :toggleable="true">
                        <div v-for="(job, index) in userData.jobs" :key="index" class="field col-12 md:col-6">
                            <div class="text-left w-full text-xl">{{ job.name }} - {{ job.description }}</div>
                        </div>
                    </Panel>
                </div>
                <div class="col-12 xl:col-12">
                    <Panel header="Hobbies" :toggleable="true">
                        <div v-for="(hobby, index) in userData.hobbies" :key="index" class="field col-12 md:col-6">
                            <div class="text-left w-full text-xl">{{ hobby.name }} - {{ hobby.description }}</div>
                        </div>
                    </Panel>
                </div>
            </TabPanel>
            <TabPanel header="Posts">
            </TabPanel>
        </TabView>
    </div>
</template>