import { markRaw } from 'vue'

let state = [

];

function findModalIndex (state, payload) {
    let modalIndex =  payload.index != undefined ? payload.index : -1;

    if (modalIndex == -1 && payload.id) {
        modalIndex = state.findIndex(x => x.id == payload.id);
    }

    return modalIndex;
}

const mutations = {
    show (state, payload) {
        const modalIndex = findModalIndex(state, payload);
        payload.component = markRaw(payload.component)

        if (modalIndex == -1)
            state.push({ ...payload, visible: true });
        else
            state[modalIndex].visible = true;
    },

    hide (state, payload) {
        const modalIndex = findModalIndex(state, payload);

        if(modalIndex != -1) {
            state[modalIndex].visible = false;
        }
    },

    close (state, payload) {
        const modalIndex = findModalIndex(state, payload);

        if(modalIndex != -1) {
            state.splice(modalIndex, 1);
        }
    },

    push (state, payload) {
        state.push(payload);
    },

    pop (state) {
        state.pop();
    },

    clear (state) {
        state.length = 0;
    }
}

let actions = {};
Object.keys(mutations).map(x => { actions[x] = ({commit}, payload) => commit(x, payload) });

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
