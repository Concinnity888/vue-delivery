<template>
  <div class="app" id="app">
    <div class="app__wrapper">
      <input
        type="text"
        v-if="getLastAddress"
        :value="getLastAddress"
        @click="popupShow = !popupShow"
      />
      <button
        class="btn"
        type="button"
        v-else
        @click="popupShow = !popupShow"
      >
        Добавить адрес
      </button>
    </div>

    <Popup
      v-show="popupShow"
      @close="popupShow = false"
      title="Адрес доставки"
      maxWidth="600px"
    >
      <Form
        slot="popup-body"
        @close="popupShow = false"
      />
    </Popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Popup from '@/components/Popup.vue'
import Form from '@/components/Form.vue'

export default {
  name: 'App',
  components: {
    Popup,
    Form
  },
  data () {
    return {
      popupShow: false
    }
  },
  computed: {
    ...mapGetters(['getLastAddress'])
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}

.app {
  display: flex;
  align-items: flex-start;
  min-height: 100vh;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: #2c3e50;

  &__wrapper {
    display: flex;
    justify-content: center;
    align-self: center;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;

    input {
      width: 100%;
      height: 56px;
      padding: 0 32px;
      box-sizing: border-box;
      overflow: hidden;

      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;

      color: inherit;
      outline: none;
      border: none;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  padding: 0 32px;
  box-sizing: border-box;

  font-size: 16px;
  line-height: 18px;
  text-transform: uppercase;

  color: #fff;
  background-color: #4fc08d;
  border-radius: 32px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.75;
    transition: all 0.15s ease;
  }
}
</style>
