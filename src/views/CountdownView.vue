<template>
  <el-col>
    <div v-if="countdown != null">
      <h1>{{ countdown?.eventName }}</h1>
      <Timer :seconds="timer.seconds.value" :minutes="timer.minutes.value" :hours="timer.hours.value"
        :days="timer.days.value" />
    </div>
  </el-col>
</template>

<style>
.h1 {
  text-align: center;
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router'
import { useTimer } from 'vue-timer-hook';
// import { ElLoading, ElMessageBox } from 'element-plus'

import { FirestoreDatabase } from "@/services/firestore_database";
import type { CountdownModel } from "@/models/countdown_model";
import Timer from "@/components/Timer.vue"

const errorMessage = ref<string | null>(null);
const countdown = ref<CountdownModel | null>(null);

let timer = useTimer(new Date());

const route = useRoute();
const router = useRouter();

if (route.params.countdownId != null) {
  FirestoreDatabase.getCountdown(route.params.countdownId.toString()).then((countdownData) => {
    countdown.value = countdownData;
    if (countdownData == null) {
      return router.push('/404');
    }
    document.title = `Countdown | ${countdownData.eventPreviewName ? countdownData.eventPreviewName : countdownData.eventName}`;
    timer = useTimer(countdownData.eventDate);

  }).catch((error) => {
    console.log(error);
    errorMessage.value = "An error occurred.";
  });
} else {
  router.push('/404');
}
</script>
