<script setup lang="ts">
const applicationManager = useApplicationManager()
</script>

<template>
  <div class="owd-dock-bar">
    <Dock :model="applicationManager.appsRunning">
      <template #itemicon="{ item }">
        <DockBarButtonApp
            :application="item"
        />
      </template>
    </Dock>

    <DockBarButtonApp
        v-for="application of applicationManager.appsRunning"
        :application="application"
    />
    <Divider layout="vertical" />
    <DockBarButtonMenu />
  </div>
</template>

<style scoped lang="scss">
.owd-dock-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);

  .p-divider-vertical:before {
    color: transparent;
  }
}
</style>