export const state = () => ({
  list: []
})

export const mutations = {
  add(state, expense) {
    state.list.push(expense)
  }
}
