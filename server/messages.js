export function rollResultMessage(forid, dice) {
   return {
      type: "roll result",
      forid: forid,
      dice: dice,
   }
}
