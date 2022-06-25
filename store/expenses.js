export const state = () => ({
  list: []
})

export const mutations = {
  add(state, expenses) {
    state.list.push(...expenses)
  }
}
