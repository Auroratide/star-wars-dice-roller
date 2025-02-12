export const state = {
   chase: createBlank(),
   kathy: createBlank(),
   andrew: createBlank(),
   timothy: createBlank(),
}

function createBlank() {
   return {
      dice: {
         ability: 0,
         proficiency: 0,
         boost: 0,
         difficulty: 0,
         challenge: 0,
         setback: 0,
         force: 0,
      },
      result: {
         dice: {
            ability: [],
            proficiency: [],
            boost: [],
            difficulty: [],
            challenge: [],
            setback: [],
            force: [],
         },
         summary: {
            success: 0,
            sideEffect: 0,
            triumphs: 0,
            despair: 0,
            force: {
               light: 0,
               dark: 0,
            },
         },
      },
   }
}

export function reset(name) {
   state[name] = createBlank()
}

export function updateDiceValue(name, ability, value) {
   state[name].dice[ability] = value
}

export function updateResult(name, result) {
   state[name].result = result
}
