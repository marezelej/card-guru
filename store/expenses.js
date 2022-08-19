export const state = () => ({
  loaded: false,
  cardList: [],
  fixedList: [],
  version: 1,
})

function dbStore(state) {
  localStorage.setItem('expenses', JSON.stringify({
    version: state.version,
    cardList: state.cardList,
    fixedList: state.fixedList,
  }))
}

export const mutations = {
  addCard(state, expenses) {
    state.cardList.push(...expenses)
    dbStore(state)
  },
  deleteCard(state, item) {
    state.cardList = state.cardList.filter(e => e !== item)
    dbStore(state)
  },
  load(state) {
    if (!state.loaded) {
      state.loaded = true
      const expenses = JSON.parse(localStorage.getItem('expenses'))
      if (expenses) {
        if (expenses.version !== state.version || !expenses.cardList || !expenses.fixedList) {
          localStorage.removeItem('expenses')
        } else {
          state.cardList = expenses.cardList
          state.fixedList = expenses.fixedList
        }
      }
    }
  }
}
