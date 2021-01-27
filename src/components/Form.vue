<template>
  <form
    class="form"
    @submit.prevent="validate"
  >
    <div class="form__select">
      <select v-model="selected">
        <option value="Московская область">Москва</option>
        <option value="Нижегородская область">Нижний Новгород</option>
      </select>
    </div>

    <div class="form__input-field" :class="error ? 'error' : ''">
      <input
        type="text"
        id="suggest"
        placeholder="Начните вводить адрес"
        :value="value"
        @input="yaMapInit"
        @focus="getSuggestions"
      />
      <div
        class="form__input-suggestions"
        v-if="suggestions"
      >
        <div
          class="form__input-suggestions-item"
          v-for="(item, idx) in suggestions"
          :key="idx"
          @click="addAddress(item)"
        >
          {{ item }}
        </div>
      </div>

      <p class="form__input-error" v-if="error">{{ error }}</p>
    </div>
    <button class="btn" type="submit">Сохранить</button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      selected: 'Московская область',
      error: null,
      value: '',
      suggestions: null
    }
  },
  created: function () {
    const script = document.createElement('script')
    script.id = 'ymaps'
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=cdd63693-b9c8-49e8-90c2-5437a7d0aa14&lang=ru_RU'
    document.head.append(script)

    script.onload = () => {
      window.ymaps.ready(() => this.yaMapInit())
    }
  },
  computed: {
    ...mapGetters(['getAddresses'])
  },
  methods: {
    ...mapActions(['addNewAddress', 'setLastAddress']),
    yaMapInit () {
      this.suggestions = null
      const region = this.selected

      const provider = {
        suggest: function (request, options) {
          return window.ymaps.suggest(region + ', ' + request)
        }
      }

      const suggestView = new window.ymaps.SuggestView('suggest', { provider: provider })
      return suggestView

      // const handler = function (evt) {
      //   this.value = evt.get('item').value
      // }

      // suggestView.events.add('select', handler.bind(this))
    },
    getSuggestions () {
      this.suggestions = this.getAddresses.map(({ key, value }) => value)
    },
    addAddress (item) {
      this.value = item
      this.suggestions = null
    },
    validate () {
      const request = this.value

      window.ymaps.geocode(request).then(function (res) {
        const obj = res.geoObjects.get(0)

        if (obj) {
          switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
            case 'exact':
              break
            case 'number':
            case 'near':
            case 'range':
              this.error = 'Неточный адрес, уточните номер дома'
              break
            case 'street':
              this.error = 'Неполный адрес, уточните номер дома'
              break
            case 'other':
            default:
              this.error = 'Уточните адрес'
          }
        } else {
          this.error = 'Адрес не найден'
        }

        if (!this.error) {
          this.error = null
          this.suggestions = null
          const addresses = this.getAddresses.map(({ key, value }) => value)

          this.setLastAddress(request)

          if (!addresses.includes(request)) {
            const jsonData = JSON.stringify({
              value: request,
              lat: obj.geometry.getCoordinates()[0],
              lon: obj.geometry.getCoordinates()[1],
              country: obj.getCountry(),
              city: obj.getLocalities()[0] || obj.getAdministrativeAreas()[0],
              street: obj.getThoroughfare(),
              house: obj.getPremiseNumber()
            })
            const newAddress = {
              value: request
            }

            this.addNewAddress(newAddress)

            const data = JSON.stringify(jsonData)
            axios.post('http://localhost:8080/', data)
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                console.log(error)
              })
          }

          this.$emit('close')
        }
      }, function (err) {
        console.log(err)
      })
    }
  },
  destroyed: function () {
    document.head.querySelector('script#ymaps').remove()
  }
}
</script>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__select {
    width: 100%;
    padding: 0 32px;
    box-sizing: border-box;

    border-bottom: 1px solid #e5e5e5;

    select {
      width: 100%;
      height: 56px;

      font-size: 12px;

      color: inherit;
      outline: none;
      border: none;
    }
  }

  &__input-field {
    position: relative;

    width: 100%;
    margin-bottom: 32px;
    padding: 0 32px;
    box-sizing: border-box;

    text-align: left;

    border-bottom: 1px solid #e5e5e5;

    &.error {
      border-bottom: 1px solid #d63200;
    }

    input {
      width: 100%;
      height: 56px;
      overflow: hidden;

      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;

      border: none;
      outline: none;
      color: inherit;

      &::placeholder {
        color: inherit;
      }
    }
  }

  &__input-error {
    position: absolute;
    top: calc(100% + 8px);
    margin: 0;

    font-size: 12px;

    color: #d63200;
  }

  &__input-suggestions {
    z-index: 10;
    position: absolute;
    top: calc(100% - 3px);
    right: 26px;
    left: 33px;

    display: flex;
    flex-direction: column;
    padding: 4px 0;
    box-sizing: border-box;

    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #e5e5e5;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    touch-action: none;
    box-shadow: 0 10px 20px -5px rgba(0,0,0,.2);

    div {
      display: flex;
      align-items: center;
      min-height: 34px;
      padding: 0 8px;
      box-sizing: border-box;

      font-size: 12px;

      cursor: pointer;

      &:hover {
        background-color: #e5e5e5;
      }
    }
  }

  ymaps ymaps ymaps ymaps {
    font-size: 12px;

    &:hover {
      background-color: #e5e5e5;
    }
  }
}
</style>
