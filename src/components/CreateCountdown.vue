<template>
  <el-form class="form-content" ref="formRef" :model="formData" :rules="formRules" label-position="top">
    <h1 class="main-title">Create my countdown</h1>
    <el-form-item prop="eventName">
      <el-input class="form-input" v-model="formData.eventName" placeholder="Event name" />
    </el-form-item>
    <el-form-item prop="eventPreviewName">
      <el-input class="form-input" v-model="formData.eventPreviewName" placeholder="Event preview name (optional)" />
    </el-form-item>
    <el-form-item prop="eventDate">
      <el-date-picker class="form-input" v-model="formData.eventDate" type="datetime" placeholder="Event date"
        format="DD-MM-YYYY HH:mm" :disabled-date="isInvalidDate" />
    </el-form-item>
    <el-form-item label="Cover picture (optional)" class="form-element-with-label">
      <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="onImageUploaded">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="Cover image" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmitForm(formRef)">Create my countdown</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.form-content {
  padding-left: 5vw;
  padding-right: 5vw;
  width: 100vw;
}

.main-title {
  padding-top: 50px;
  padding-bottom: 50px;
}


.avatar-uploader .avatar {
  width: 640px;
  height: 360px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}

.form-input {
  --el-fill-color-blank: var(--color-input_background);
  --el-border-color: var(--color-border);
  --el-border-color-hover: var(--color-border-hover);
  --el-text-color-regular: var(--color-text);
}

.form-element-with-label {
  --el-text-color-regular: var(--color-text);
}
</style>


<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, type UploadFile, type UploadFiles } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { FirestoreDatabase } from "@/services/firestore_database"
import { StorageService } from "@/services/storage"
import { useRouter } from "vue-router"
import { Plus } from '@element-plus/icons-vue'

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

const imageUrl = ref<string>("");
const coverImage = ref<Blob>()

const onImageUploaded = (uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
  if (!uploadFile.raw) {
    ElMessage.error('No file provided')
    return false
  }

  const rawFile = uploadFile.raw;

  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Cover picture must be in JPG format')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Cover picture size can not exceed 10MB')
    return false
  }
  coverImage.value = rawFile
  imageUrl.value = URL.createObjectURL(rawFile)
  return true
}

const onSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      let backgroundImagePath = ""
      if (coverImage.value) {
        backgroundImagePath = await StorageService.uploadPicture(coverImage.value);
      }
      FirestoreDatabase.createCountdown(Object.assign({}, formData.value, { backgroundImagePath: backgroundImagePath })).then((countdownId) => {
        router.push(`/${countdownId}`)
      })
    }
  })
}

function validateIsNotWhitespaceEmpty(_rules: unknown, value: string, callback: (err?: Error) => void) {
  if (value.trim() === "") {
    callback(new Error("Please provide a value"));
    return;
  }
  callback();
}


function validateEventDate(_rules: unknown, eventDate: Date, callback: (err?: Error) => void) {
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
