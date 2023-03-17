<template>
  <el-form ref="formRef" :model="formData" :rules="formRules">
    <h1>Create my countdown</h1>
    <el-form-item prop="eventName">
      <el-input v-model="formData.eventName" placeholder="Event name" />
    </el-form-item>
    <el-form-item prop="eventPreviewName">
      <el-input v-model="formData.eventPreviewName" placeholder="Event preview name" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmitForm(formRef)">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>

  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a>
    provides you with all information you need to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>. The
    recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a> +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank" rel="noopener">Volar</a>. If
    you need to test your components and web pages, check out
    <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a> and
    <a href="https://on.cypress.io/component" target="_blank">Cypress Component Testing</a>.

    <br />

    More instructions are available in <code>README.md</code>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and libraries for your project:
    <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>,
    <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>,
    <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a>, and
    <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>. If
    you need more resources, we suggest paying
    <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue</a>
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>, our official
    Discord server, or
    <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener">StackOverflow</a>. You
    should also subscribe to
    <a href="https://news.vuejs.org" target="_blank" rel="noopener">our mailing list</a> and follow
    the official
    <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">@vuejs</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem>
</template>



<script setup lang="ts">
import { reactive, ref } from "vue"
import type { FormInstance, FormRules } from 'element-plus'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import { FirestoreDatabase } from "@/services/firestore_database"
import { useRouter } from "vue-router"

const router = useRouter();

const formRules = reactive<FormRules>({
  eventName: [
    { validator: validateIsNotWhitespaceEmpty, message: 'Mandatory field', trigger: 'blur' },
  ],
})

const formRef = ref<FormInstance>()

const formData = ref({
  eventName: "",
  eventPreviewName: "",
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
</script>
