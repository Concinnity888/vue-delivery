import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addresses: [
      {
        value: 'г Нижний Новгород, деревня Комарово, ул Животноводов, д 1'
      },
      {
        value: 'г Нижний Новгород, пер. Мотальный, д 8'
      }
    ],
    lastAddress: ''
  },
  getters: {
    getAddresses: (state) => state.addresses,
    getLastAddress: (state) => state.lastAddress
  },
  actions: {
    addNewAddress ({ commit }, payload) {
      commit('ADD_ADDRESS', payload)
    },
    setLastAddress ({ commit }, payload) {
      commit('SET_LAST_ADDRESS', payload)
    }
  },
  mutations: {
    ADD_ADDRESS (state, payload) {
      state.addresses.push(payload)
    },
    SET_LAST_ADDRESS (state, payload) {
      state.lastAddress = payload
    }
  }
})
