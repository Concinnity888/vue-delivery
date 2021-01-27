<template>
  <transition name="popup">
    <div class="popup">
      <div class="popup__wrapper"
        @click="$emit('close')"
      >
        <div
          class="popup__content"
          @click.stop=""
          v-bind:style="{ maxWidth: maxWidth }"
        >
          <button class="popup__btn-close" type="button" @click="$emit('close')">Закрыть</button>
          <div class="popup__header" v-if="title">
            <h2 class="popup__title">{{ title }}</h2>
          </div>
          <div class="popup__body">
            <slot name="popup-body">Default body</slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: false
    },
    maxWidth: {
      type: String,
      required: true
    }
  },
  mounted () {
    document.body.addEventListener('keyup', (evt) => {
      if (evt.keyCode === 27) {
        this.$emit('close')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.popup-enter,
.popup-leave-active {
  opacity: 0;
  transition: all .3s ease;
}

.popup-enter .popup__content,
.popup-leave-active .popup__content {
  transform: scale(1.2);
  transition: all .3s ease;
}

.popup {
  &__wrapper {
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(00,00,00,.48);
  }

  &__content {
    z-index: 1001;
    position: relative;

    width: 100%;
    padding: 48px 0;
    box-sizing: border-box;

    background-color: #fff;
    border: 1px solid #808080;
    border-radius: 8px;
  }

  &__btn-close {
    position: absolute;
    top: 8px;
    right: 8px;

    width: 48px;
    height: 48px;

    font-size: 0;

    background-color: transparent;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.1988 11.9999L23.5439 2.65453C24.152 2.04665 24.152 1.06379 23.5439 0.45591C22.936 -0.15197 21.9531 -0.15197 21.3453 0.45591L11.9999 9.80131L2.65474 0.45591C2.04658 -0.15197 1.064 -0.15197 0.456123 0.45591C-0.152041 1.06379 -0.152041 2.04665 0.456123 2.65453L9.80124 11.9999L0.456123 21.3453C-0.152041 21.9532 -0.152041 22.9361 0.456123 23.5439C0.759067 23.8472 1.15739 23.9995 1.55543 23.9995C1.95347 23.9995 2.35151 23.8472 2.65474 23.5439L11.9999 14.1985L21.3453 23.5439C21.6485 23.8472 22.0465 23.9995 22.4446 23.9995C22.8426 23.9995 23.2406 23.8472 23.5439 23.5439C24.152 22.9361 24.152 21.9532 23.5439 21.3453L14.1988 11.9999Z' fill='%23E5E5E5'/%3E%3C/svg%3E%0A");
    background-position: center;
    background-repeat: no-repeat;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all .2s ease;

    &:hover {
      opacity: 0.75;
      transition: all .2s ease;
    }
  }

  &__header {
    margin-bottom: 32px;
  }

  &__title {
    margin: 0;
    font-size: 30px;
    line-height: 36px;
  }
}
</style>
