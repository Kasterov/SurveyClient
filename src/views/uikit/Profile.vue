<script setup>
import { ref, onMounted } from 'vue';
import { repositoryProfile } from '@/repository/repositoryProfile';
import { useToast } from 'primevue/usetoast';

const { getListJob,
    getListEducation,
    getListCountry,
    getListHobby,
    addProfileData,
    getProfileByUserId } = repositoryProfile();
const toast = useToast();

const genders = ref([
    { name: 'Male', value: 1 },
    { name: 'Female', value: 2 },
]);
const gender = ref(null);

const relationships = ref([
    {status: "Dismissed", value: 1},
    {status: "In active search", value: 2},
    {status: "In relationship", value: 3},
    {status: "Married", value: 4},
    {status: "Inlove", value: 5},
    {status: "Complicated", value: 6},
    {status: "Divorced", value: 7}
]);
const relationship = ref(null);
const submitted = ref(false);

const spendingPerMonth = ref(null);

const country = ref(null);
const countries = ref([]);

const bio = ref(null);
const name = ref(null);
const email = ref(null);
const avatar = ref(null);
const idOfAvatar = ref(null);

const hobbies = ref([]);
const hobbyList = ref([]);

const jobs = ref([]);
const jobList = ref([]);

const educationList = ref([]);
const educations = ref([]);

const dateOfBirth = ref(null);

const loadingUpdateProfile = ref(false);

const addJob = (event) => {    
    let indexToHide = jobList.value.findIndex(job => job.id === event.value.id);
    
    if (indexToHide !== -1) {
        jobList.value[indexToHide].visible = false;
    }

    jobs.value.push(event.value);
}

const unselectJob = (id) => {    
    let indexToRemove = jobs.value.findIndex(job => job.id === id);
    if (indexToRemove !== -1) {
        jobs.value.splice(indexToRemove, 1);
        jobList.value.filter(job => job.id === id)[0].visible = true;
    }
}

const addEducation = (event) => {    
    let indexToHide = educationList.value.findIndex(e => e.id === event.value.id);
    
    if (indexToHide !== -1) {
        educationList.value[indexToHide].visible = false;
    }

    educations.value.push(event.value);
}

const addEducationList = (uploadedEducations) => { 
    
    if(uploadedEducations == null) {
        return;
    }
    
    uploadedEducations.forEach(ue => {
        let indexToHide = educationList.value.findIndex(e => e.id === ue.id);
        educationList.value[indexToHide].visible = false;
    });

    educations.value.push(...uploadedEducations);
}

const addHobbyList = (uploadedHobbies) => {    

    if(uploadedHobbies == null) {
        return;
    }

    uploadedHobbies.forEach(uh => {
        let indexToHide = hobbyList.value.findIndex(e => e.id === uh.id);
        hobbyList.value[indexToHide].visible = false;
    });

    hobbies.value.push(...uploadedHobbies);
}

const addJobList = (uploadedJobs) => { 
    
    if(uploadedJobs == null) {
        return;
    }
    
    uploadedJobs.forEach(uj => {
        let indexToHide = jobList.value.findIndex(e => e.id === uj.id);
        jobList.value[indexToHide].visible = false;
    });

    jobs.value.push(...uploadedJobs);
}

const unselectEducation = (id) => {  
    let indexToRemove = educations.value.findIndex(e => e.id === id);
    if (indexToRemove !== -1) {
        educations.value.splice(indexToRemove, 1);
        educationList.value.filter(e => e.id === id)[0].visible = true;
    }
} 

const addHobby = (event) => {    
    let indexToHide = hobbyList.value.findIndex(e => e.id === event.value.id);
    
    if (indexToHide !== -1) {
        hobbyList.value[indexToHide].visible = false;
    }

    hobbies.value.push(event.value);
}

const unselectHobby = (id) => {  
    let indexToRemove = hobbies.value.findIndex(e => e.id === id);
    if (indexToRemove !== -1) {
        hobbies.value.splice(indexToRemove, 1);
        hobbyList.value.filter(e => e.id === id)[0].visible = true;
    }
} 
 
const uploadProfileDTO = async() => {

    submitted.value = true;

    if(name.value && email.value && country.value){
        loadingUpdateProfile.value = true;
        let avatarToUpload = null;

        if(avatar.value != null){
            avatarToUpload = avatar.value
        }

        let profileDTO = {
            name: name.value,
            email: email.value,
            DateOfBirth: dateOfBirth.value,
            gender: gender.value?.value,
            bio: bio.value,
            relationship: relationship.value?.value,
            spendingPerMonth: spendingPerMonth.value,
            avatar: avatarToUpload,
            countryId: country.value?.id,
            jobs: jobs.value.map(j => ({jobId: j.id})),
            hobbies: hobbies.value.map(h => ({hobbyId: h.id})),
            educations: educations.value.map(e => ({educationId: e.id}))
        };

        toast.add({ severity: 'success', summary: 'Successful', detail: 'Profile updated!', life: 4000 });

        let res = await addProfileData(profileDTO);
        loadingUpdateProfile.value = false;
    }
}

const uploadedImage = ref(null);

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);

    console.log(avatar.value);

    avatar.value = {
        id: idOfAvatar.value,
        name: file.name,
        base64: "",
        contentType: file.type,
        expression: file.name.split('.').pop()
    } 

    reader.onloadend = function () {
        let base64Full = reader.result;
        avatar.value.base64 = base64Full.split(',')[1];
        uploadedImage.value = base64Full;
    };
};

onMounted(async () => {
    jobList.value = await getListJob();
    jobList.value.forEach(job => {
        job.visible = true;
    });

    educationList.value = await getListEducation();
    educationList.value.forEach(e => {
        e.visible = true;
    });

    hobbyList.value = await getListHobby();
    hobbyList.value.forEach(hobby => {
        hobby.visible = true;
    });

    countries.value = await getListCountry();

    var profileExistData = await getProfileByUserId();

    name.value = profileExistData.name;
    email.value = profileExistData.email;
    dateOfBirth.value = new Date(profileExistData.dateOfBirth);
    spendingPerMonth.value = profileExistData.spendingPerMonth;

    relationship.value = relationships.value.filter(s => s.value == profileExistData.relationship)[0];
    gender.value = genders.value.filter(s => s.value == profileExistData.gender)[0];
    country.value = countries.value.filter(s => s.id == profileExistData.country?.id)[0];
    uploadedImage.value = profileExistData.avatarLink;
    idOfAvatar.value = profileExistData.avatarId;

    addEducationList(profileExistData.educations);
    addJobList(profileExistData.jobs);
    addHobbyList(profileExistData.hobbies);
    bio.value = profileExistData.bio;
});

</script>

<template>
    <Toast/>
    <!-- style="background-image: url('demo/images/avatar//Space_love_fall.jpg');" -->
    <div class="card">
        <h5>Profile</h5>
        <!-- <div class="grid p-fluid mt-3 rounded-section">
            <div class="field col-12 md:col-4">
                <Avatar :image="'demo/images/avatar/xuxuefeng.png'" style="width: 10rem; height: 10rem;" shape="circle"></Avatar>
            </div>
        </div>
        <div class="grid p-fluid rounded-section">
            <div class="field col-12 md:col-3 text-5xl">
                <span> Viacheslav </span>
                <span class="ml-2 flag flag-us" style="width: 36px; height: 24px" />
            </div>
            <div class="field col-12 md:col-2 text-xl flex align-items-center">
                <span class="align-items-center justify-content-between">1242 subscribers</span>
            </div>
            <div class="field col-12 md:col-3 text-xl flex align-items-center">
                <span class="align-items-center justify-content-between">With Survey from 12/12/2023</span>
            </div>
            <div class="field col-12 md:col-2 text-xl flex align-items-center">
                <Button label="Update profile" :loading="loadingUpdateProfile" :onClick="uploadProfileDTO" class="p-button-raised p-button-primary mr-2 mb-2"/>
            </div>
        </div> -->
        <TabView>
            <TabPanel header="Bio">
                <Button label="Update profile" :loading="loadingUpdateProfile" :onClick="uploadProfileDTO" class="p-button-raised p-button-primary mr-2 mb-2"/>
                <div class="grid p-fluid mt-3">
                    <div class="field col-12 md:col-2">
                        <Avatar :image="uploadedImage" style="width: 8rem; height: 8rem;" shape="circle"></Avatar>
                        <FileUpload
                            class="mt-1"
                            mode="basic"
                            name="demo[]"
                            url="/api/upload"
                            accept="image/*"
                            customUpload
                            :auto="true"
                            @uploader="customBase64Uploader"
                            />
                    </div>
                    <div class="field col-12 md:col-10">
                        <Textarea v-model="bio" placeholder="Bio" :autoResize="true" rows="8" cols="25" />
                    </div>
                </div>
                <div class="grid p-fluid mt-3">
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label flex align-items-center justify-content-between">
                            <InputText id="username" type="text" v-model="name" :class="{ 'p-invalid': submitted && !name }" :required="true" />
                            <label for="username">Name <span v-if="submitted && !name"> is required</span></label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-2">
                        <span class="p-float-label">
                            <Dropdown id="dropdown" :options="genders" v-model="gender" optionLabel="name"></Dropdown>
                            <label for="dropdown">Gender</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-3">
                        <span class="p-float-label">
                            <Dropdown id="dropdown" :options="countries" v-model="country" optionLabel="name" :class="{ 'p-invalid': submitted && !country }" :required="true"></Dropdown>
                            <label for="dropdown">Country <span v-if="submitted && !country"> is required</span> </label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-3">
                        <span class="p-float-label">
                            <Calendar inputId="calendar" v-model="dateOfBirth" :class="{ 'p-invalid': submitted && !dateOfBirth }" :required="true"></Calendar>
                            <label for="calendar">Date of birth <span v-if="submitted && !dateOfBirth"> is required</span> </label>
                        </span>
                    </div>
                </div>
                <div class="grid p-fluid mt-3">
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label flex align-items-center justify-content-between">
                            <InputText id="email" type="text" v-model="email" :class="{ 'p-invalid': submitted && !email }" :required="true" />
                            <label for="username">Email <span v-if="submitted && !email"> is required</span></label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <Dropdown id="dropdown" :options="relationships" v-model="relationship" optionLabel="status"></Dropdown>
                            <label for="dropdown">Relationship</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-4">
                        <span class="p-float-label">
                            <InputText v-model.number="spendingPerMonth" />
                            <Slider v-model="spendingPerMonth" :max="5000" :step="100"/>
                            <label for="dropdown">Spending pre month $</label>
                        </span>
                    </div>
                </div>
                <div class="grid p-fluid mt-3">
                    <div class="field col-12 md:col-4">
                        <Panel header="Jobs" :toggleable="true" :collapsed="false">
                            <span class="p-float-label">
                                <Dropdown id="dropdown" :options="jobList.filter(job => job.visible == true)" @change="addJob" optionLabel="name" filter filterPlaceholder="Search..."></Dropdown>
                                <label for="dropdown">Jobs</label>
                            </span>
                            <div v-for="(job, index) in jobs" :key="index" class="grid p-field col-12 md:col-12 mt-0 mb-0">
                                <span class="flex align-items-center justify-content-between" :id="'inputtext' + index">{{job.name}}</span>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-text flex rigth ml-auto" @click="unselectJob(job.id)" />
                            </div>
                        </Panel>
                    </div>
                    <div class="field col-12 md:col-4">
                        <Panel header="Educations" :toggleable="true" :collapsed="false">
                            <span class="p-float-label">
                                <Dropdown id="dropdown" :options="educationList.filter(e => e.visible == true)" @change="addEducation" optionLabel="name" filter filterPlaceholder="Search..."></Dropdown>
                                <label for="dropdown">Educations</label>
                            </span>
                            <div v-for="(education, index) in educations" :key="index" class="grid p-field col-12 md:col-12 mt-0 mb-0">
                                <span class="flex align-items-center justify-content-between" :id="'inputtext' + index">{{education.name}}</span>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-text flex rigth ml-auto" @click="unselectEducation(education.id)" />
                            </div>
                        </Panel>
                    </div>
                    <div class="field col-12 md:col-4">
                        <Panel header="Hobbies" :toggleable="true" :collapsed="false">
                            <span class="p-float-label">
                                <Dropdown id="dropdown" :options="hobbyList.filter(e => e.visible == true)" @change="addHobby" optionLabel="name" filter filterPlaceholder="Search..."></Dropdown>
                                <label for="dropdown">Hobbies</label>
                            </span>
                            <div v-for="(hobby, index) in hobbies" :key="index" class="grid p-field col-12 md:col-12 mt-0 mb-0">
                                <span class="flex align-items-center justify-content-between" :id="'inputtext' + index">{{hobby.name}}</span>
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-text flex rigth ml-auto" @click="unselectHobby(hobby.id)" />
                            </div>
                        </Panel>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Posts">
            </TabPanel>
        </TabView>
    </div>
</template>