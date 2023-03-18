<template>
  <div class="background-img" v-if="countdown != null"
    v-bind:style="{ backgroundImage: 'url(' + backgroundImageUrl + ')' }"></div>
  <div class="content">
    <h1 class="centered">{{ countdown?.eventName }}</h1>
    <Timer class="centered-clock" :seconds="timer.seconds.value" :minutes="timer.minutes.value" :hours="timer.hours.value"
      :days="timer.days.value" />
  </div>
</template>

<style>
h1 {
  text-align: center;
}

.background-img {
  background-size: cover;
  width: 100vw;
  height: 100vh;
  opacity: 30%
}

.content {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.centered {
  top: 45%;
  -ms-transform: translateY(-45%);
  transform: translateY(-45%);
}

.centered-clock {
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router'
import { useTimer } from 'vue-timer-hook';
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFileUrl } from 'vuefire'
import { FirestoreDatabase } from "@/services/firestore_database";
import type { CountdownModel } from "@/models/countdown_model";
import Timer from "@/components/Timer.vue"

const errorMessage = ref<string | null>(null);
const countdown = ref<CountdownModel | null>(null);
const backgroundImageUrl = ref<string | null | undefined>(null);

let timer = useTimer(new Date());

const route = useRoute();
const router = useRouter();
const storage = useFirebaseStorage()

if (route.params.countdownId != null) {
  FirestoreDatabase.getCountdown(route.params.countdownId.toString()).then((countdownData) => {
    countdown.value = countdownData;
    if (countdownData == null) {
      return router.push('/404');
    }
    document.title = `Countdown | ${countdownData.eventPreviewName ? countdownData.eventPreviewName : countdownData.eventName}`;
    timer = useTimer(countdownData.eventDate);

    if (countdownData.backgroundImagePath) {
      const backgroundImageRef = storageRef(storage, countdownData.backgroundImagePath)
      const {
        url,
        refresh,
      } = useStorageFileUrl(backgroundImageRef)

      refresh().then((value) => backgroundImageUrl.value = value)
      backgroundImageUrl.value = url.value
    }
  }).catch((error) => {
    errorMessage.value = "An error occurred.";
  });
} else {
  router.push('/404');
}
</script>
