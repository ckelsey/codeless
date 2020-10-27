<template>
    <div id="top-section">
        <div class="flex-left-center p-2">
            <div class="items-space">
                <a href="/projects" :class="$route.path === '/projects' ? 'active':''">Projects</a>
                <a href="/pages" :class="$route.path === '/pages' ? 'active':''">Pages</a>
                <a href="/components" :class="$route.path === '/components' ? 'active':''">Components</a>
                <a href="/behaviors" :class="$route.path === '/behaviors' ? 'active':''">Behaviors</a>
                <a href="/services" :class="$route.path === '/services' ? 'active':''">Services</a>
                <a href="/utilities" :class="$route.path === '/utilities' ? 'active':''">Utilities</a>
            </div>
        </div>
    </div>
    <div id="main-section">
        <router-view />
    </div>
</template>

<style lang="scss">
@import "@/styles/index.scss";
</style>
