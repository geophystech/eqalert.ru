export const state = () => ({
  locked: false
});

export const getters = {
  lockedRequests: state => {
    return state.locked
  }
};

export const mutations = {
  lockRequests(state) {
    state.locked = true
  },
  unlockRequests(state) {
    state.locked = false
  }
};

export const actions = {
  lockRequests({ commit, state }) {
    commit('lockRequests')
  },
  unlockRequests({ commit, state }) {
    commit('unlockRequests')
  }
};

