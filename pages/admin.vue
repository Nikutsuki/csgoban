<script setup>
    import { ref } from 'vue'
    const url = useRequestURL()
    const id = ref('')
    const team1 = ref('')
    const team2 = ref('')
    const starts = ref('')
    const bo = ref('')
    const popup_open = ref(false)
    async function submit_form() {
        if(!id.value || !team1.value || !team2.value || !starts.value || !bo.value || starts == "") return;
        starts.value = starts.value == "t1" ? team1.value : team2.value
        await fetch('/api/create_lobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id.value,
                t1_name: team1.value,
                t2_name: team2.value,
                banned_maps: [],
                map1: "",
                map2: "",
                map3: "",
                starts: starts.value,
                type: bo.value
            })
        }).then(res => {
            if(res.status == 200) {
                popup_open.value = true
                starts.value = null;
            }
        }).catch(err => {
            console.log(err)
        })
    }
</script>

<template>
    <div class="justify-center items-center flex w-full h-screen bg-black">
        <form class="w-1/3 bg-teal-600 h-2/5 rounded-lg flex justify-center items-center flex-col p-4" onsubmit="return false">
            <input v-model="id" type="text" class="w-full h-10 bg-gray-200 rounded-lg input my-4" placeholder="Id" required>
            <input v-model="team1" type="text" class="w-full h-10 bg-gray-200 rounded-lg input my-4" placeholder="Team name 1" required>
            <input v-model="team2" type="text" class="w-full h-10 bg-gray-200 rounded-lg input my-4" placeholder="Team name 2" required>  
            <div>
                <input type="radio" v-model="starts" value="t1" class="px-4" name="starts">
                <label for="starts">Team 1 starts</label>
                <input type="radio" v-model="starts" value="t2" class="px-4" name="starts">
                <label for="starts">Team 2 starts</label>
            </div>
            <div>
                <input type="radio" v-model="bo" value="bo1" class="px-4" name="bo">
                <label for="starts">bo1</label>
                <input type="radio" v-model="bo" value="bo3" class="px-4" name="bo">
                <label for="starts">bo3</label>
            </div>
            <button @click="submit_form" class="w-full h-10 bg-blue-500 rounded-lg text-white">Submit</button>
        </form>
        <LinkPopup @close="popup_open = false" v-if="popup_open" :id="id" :route="url.origin"/>
    </div>
</template>

<style>
    .input {
        padding: 4px;
    }
</style>