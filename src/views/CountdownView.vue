<template>
  <el-rcol>
    <h1>{{ countdown?.eventName }}</h1>
  </el-rcol>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router'
// import { ElLoading, ElMessageBox } from 'element-plus'

import { FirestoreDatabase } from "@/services/firestore_database";
import type { CountdownModel } from "@/models/countdown_model";

const errorMessage = ref<string | null>(null);
const countdown = ref<CountdownModel | null>(null);

const route = useRoute();
const router = useRouter();

if (route.params.countdownId != null) {
  FirestoreDatabase.getCountdown(route.params.countdownId.toString()).then((countdownData) => {
    countdown.value = countdownData;
    if (countdownData == null) {
      return router.push('/404');
    }
    document.title = `Countdown | ${countdownData.eventPreviewName ? countdownData.eventPreviewName : countdownData.eventName}`;
  }).catch((error) => {
    console.log(error);
    errorMessage.value = "An error occurred.";
  });
} else {
  router.push('/404');
}
</script>
