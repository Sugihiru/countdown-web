<template>
  <el-form class="form-content" ref="formRef" :model="formData" :rules="formRules">
    <h1>Create my countdown</h1>
    <el-form-item prop="eventName">
      <el-input v-model="formData.eventName" placeholder="Event name" />
    </el-form-item>
    <el-form-item prop="eventPreviewName">
      <el-input v-model="formData.eventPreviewName" placeholder="Event preview name (optional)" />
    </el-form-item>
    <el-form-item prop="eventDate">
      <el-date-picker v-model="formData.eventDate" type="datetime" placeholder="Event date" format="DD-MM-YYYY HH:mm"
        :disabled-date="isInvalidDate" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmitForm(formRef)">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.form-content {
  padding-left: 5vw;
  padding-right: 5vw;
  width: 100vw;
}
</style>


<script setup lang="ts">
import { reactive, ref } from "vue"
import type { FormInstance, FormRules } from 'element-plus'
import { FirestoreDatabase } from "@/services/firestore_database"
import { useRouter } from "vue-router"

const router = useRouter();

const formRules = reactive<FormRules>({
  eventName: [
    { validator: validateIsNotWhitespaceEmpty, trigger: 'blur' },
  ],
  eventDate: [
    { validator: validateEventDate, trigger: 'blur' },
  ],
})

const formRef = ref<FormInstance>()

const formData = ref({
  eventName: "",
  eventPreviewName: "",
  eventDate: "",
})

document.title = "Countdown";

const onSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      FirestoreDatabase.createCountdown(formData.value).then((countdownId) => {
        router.push(`/${countdownId}`)
      })
    }
  })
}

function validateIsNotWhitespaceEmpty(rules: unknown, value: string, callback: (err?: Error) => void) {
  if (value.trim() === "") {
    callback(new Error("Please provide a value"));
    return;
  }
  callback();
}


function validateEventDate(rules: unknown, eventDate: Date, callback: (err?: Error) => void) {
  if (eventDate < new Date()) {
    callback(new Error("Please provide a date in the future"));
    return;
  }
  callback();
}

function isInvalidDate(eventDate: Date) {
  return eventDate < new Date()
}

</script>
