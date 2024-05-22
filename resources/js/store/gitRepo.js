import axios from 'axios'

const state = {
  myData: [],
  loading: false
}

const mutations = {
    SET_DATA(state, data) {
        state.myData = data
    },
    LOADING(state, data) {
        state.loading = data
    },
}

const actions = {
    async fetchData({ commit }, payload) {
        commit('LOADING', true);
    
        try {
            const response = await axios.get('http://localhost:8000/items', {
                params: payload
            });
    
            if (response.data.items.length) {
                commit('SET_DATA', response.data.items);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('error');
            } else {
                console.error('An error occurred:', error);
            }
        } finally {
            commit('LOADING', false);
        }
    }
}

const getters = {
  fetchedData: (state) => (state.myData.length > 0 ? [...new Set(state.myData)] : []),
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
