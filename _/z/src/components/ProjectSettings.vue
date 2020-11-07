<template>
    <div>
        <label>Name</label>
        <input :v-model="name" type="text">
    </div>
    <div>
        <button>Save</button>
    <div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        name: String,
    },
})
export default class ProjectSettings extends Vue {
    name!: string;
}
</script>

<style lang="scss">

</style>
