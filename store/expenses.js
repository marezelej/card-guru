export const state = () => ({
  list: [],
  version: 1
})

export const mutations = {
  add(state, expenses) {
    state.list.push(...expenses)
    localStorage.setItem('expenses', JSON.stringify({version: state.version, list: state.list}))
  },
  load(state) {
    if (state.list.length === 0) {
      const expenses = JSON.parse(localStorage.getItem('expenses'))
      if (expenses) {
        if (expenses.version !== state.version) {
          localStorage.removeItem('expenses')
        } else {
          state.list = expenses.list
        }
      }
    }
  }
}
