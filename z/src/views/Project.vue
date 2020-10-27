<template>
    <div id="left-section" class="p-2 hide-empty">
        <ProjectSettings :name="name"></ProjectSettings>
    </div>
    <div id="center-section" class="p-2 hide-empty"></div>
    <div id="right-section" class="p-2 hide-empty"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import ProjectSettings from '@/components/ProjectSettings.vue'

@Options({
    components: {
        ProjectSettings,
    },
    
})

export default class Project extends Vue {}
</script>
