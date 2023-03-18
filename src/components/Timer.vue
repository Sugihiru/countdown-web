<template>
    <div class="timer-container">
        <TimerDigit v-if="days" :digit="days" title="DAYS" />
        <span class="separator-container" v-if="days"><span class="separator" /><span /></span>
        <TimerDigit :digit="hours" title="HOURS" />
        <span class="separator-container"><span class="separator" /><span /></span>
        <TimerDigit :digit="minutes" title="MINUTES" />
        <span class="separator-container"><span class="separator" /><span /></span>
        <TimerDigit :digit="seconds" title="SECONDS" />
    </div>
</template>

<script setup lang="ts">
import TimerDigit from './TimerDigit.vue'

defineProps({
    days: {
        type: Number,
        required: false
    },
    hours: {
        type: Number,
        required: true
    },
    minutes: {
        type: Number,
        required: true
    },
    seconds: {
        type: Number,
        required: true
    },
});

</script>
<style scoped>
.timer-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 75%;
    margin: auto;
    justify-content: center;
}

.separator-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-end;
    margin: 0 0 10px 0px;
}

.separator {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #404549;
    border-radius: 6px;
    margin: 5px 0px;
}
</style>
