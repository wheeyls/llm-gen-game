export default class GameState {
  static EXPLORING = 'exploring'; // Normal movement and exploration
  static ITEM_PROMPT = 'itemPrompt'; // Showing item pickup dialog
  static RETURNING = 'returning'; // Attempting to return items
  static EXIT_PROMPT = 'exitPrompt'; // Found the exit, deciding to leave

  constructor() {
    this.current = GameState.EXPLORING;
    this.stateData = null; // Store state-specific data
  }

  transition(to, data = null) {
    this.current = to;
    this.stateData = data;
  }

  is(state) {
    return this.current === state;
  }
}
