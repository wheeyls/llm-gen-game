class GameState {
    static EXPLORING = 'exploring';  // Normal movement and exploration
    static ITEM_PROMPT = 'itemPrompt';  // Showing item pickup dialog
    
    constructor() {
        this.current = GameState.EXPLORING;
        this.stateData = null;  // Store state-specific data
    }

    transition(to, data = null) {
        this.current = to;
        this.stateData = data;
    }

    is(state) {
        return this.current === state;
    }
}
