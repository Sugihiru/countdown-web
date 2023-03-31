<template>
  <el-form class="form-content" ref="formRef" :model="formData" :rules="formRules" label-position="top">
    <h1 class="main-title">Create my countdown</h1>
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
    <el-form-item label="Cover picture (optional)">
      <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :show-file-list="false" :on-success="handleImageUpload" :before-upload="beforeImageUpload">
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
</style>


<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
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

const handleImageUpload: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  coverImage.value = uploadFile.raw!
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Cover picture must be in JPG format')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Cover picture size can not exceed 10MB')
    return false
  }
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
