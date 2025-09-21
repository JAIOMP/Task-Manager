<template>
  <div class="home">
    <AppHeader />

    <div v-if="!user" class="home__landing">
      <section class="home__hero">
        <h1 class="home__title">End the chaos. Plan with clarity.</h1>
        <p class="home__subtitle">Capture tasks in seconds, prioritize with tags and due dates, and stay focused.</p>
        <div class="home__cta">
          <button class="home__cta-primary" @click="signInWithGoogle">Get started with Google</button>
        </div>
      </section>

      <section class="home__media">
        <div class="home__media-text">
          <h2>Everything you need to stay on track</h2>
          <ul>
            <li>Capture tasks in seconds</li>
            <li>Filter by status, due date, and tags</li>
            <li>Clean, focused interface</li>
          </ul>
        </div>
        <div class="home__media-visual">
          <img class="home__media-img" src="@/assets/images/app.png" alt="App preview" />
        </div>
      </section>

      <section class="home__features">
        <div class="feature">
          <h3>Fast capture</h3>
          <p>Add tasks instantly and keep momentum.</p>
        </div>
        <div class="feature">
          <h3>Stay focused</h3>
          <p>See only what matters with simple filters.</p>
        </div>
        <div class="feature">
          <h3>Sync securely</h3>
          <p>Sign in to sync your tasks across devices.</p>
        </div>
      </section>
    </div>

    <div v-else class="home__app">
      <main>
        <TaskManager class="task-manager"/>
      </main>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { useAuth } from '../../lib/useAuth'
// @ts-ignore
import TaskManager from '../task/TaskManager.vue'
// @ts-ignore
import AppHeader from '../shared/Header.vue'

const { user, signInWithGoogle } = useAuth()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/main.scss';
.home {
  padding: 24px;
}
.home__hero {
  margin: 48px 0 24px;
  text-align: center;
}
.home__title {
  margin: 0 0 12px;
  font-size: 32px;
}
.home__subtitle {
  margin: 0 0 24px;
  color: #555;
}
.home__cta {
  display: flex;
  justify-content: center;
}
.home__cta-primary {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid $primary-color;
  background: $primary-color;
  color: #fff;
}
.home__media {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  align-items: center;
  gap: 32px;
  margin: 32px auto 8px;
  max-width: 1280px;
}
.home__media-text {
  text-align: left;
}
.home__media-text h2 {
  margin: 0 0 12px;
}
.home__media-text ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}
.home__media-visual {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}
.home__media-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.home__features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px auto;
  max-width: 900px;
}
.feature {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}
@media (max-width: 1000px) {
  .home__media { grid-template-columns: 1fr; }
  .home__features { grid-template-columns: 1fr; }
}
</style>
