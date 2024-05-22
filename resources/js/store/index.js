import { createStore } from 'vuex'
import gitRepo from './gitRepo'

export default function () {
  return createStore({
    modules: {
      gitRepo,
    },
  })
}
