export const state = () => ({
  list: []
})

export const mutations = {
  add(state, expenses) {
    state.list.push(...expenses)
    localStorage.setItem('expenses', JSON.stringify(state.list))
  },
  load(state) {
    if (state.list.length === 0) {
      const expenses = JSON.parse(localStorage.getItem('expenses'))
      if (expenses) {
        state.list = expenses
      }
    }
  }
}
