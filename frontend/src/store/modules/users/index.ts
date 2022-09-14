import { GetterTree, MutationTree, ActionTree } from 'vuex';

export default {
  namespaced: true,
  state() {
    return {
      //dummy users to test
      users: [
        {
          id: 'c1',
          username: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30
        },
        {
          id: 'c2',
          username: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30
        }
      ]
    }
  },
  mutations: {},
  actions: {},
  getters: {
    users(state: { users: any; }) {
      return state.users;
    },
    hasUsers(state: { users: string | any[]; }) {
      return state.users && state.users.length > 0;
    }
  },
};
