export default class GameState {
    static EXPLORING = 'exploring';  // Normal movement and exploration
    static ITEM_PROMPT = 'itemPrompt';  // Showing item pickup dialog
    static RETURNING = 'returning';  // Attempting to return items
    
    constructor() {
        this.current = GameState.EXPLORING;
        this.stateData = null;  // Store state-specific data
        this.culturalTension = 0;  // Increases as you hold sacred items
        this.securityLevel = 1;    // Increases over time
        this.movesRemaining = 50;  // Decreases with each move
        this.itemsReturned = 0;    // Track success
    }

    updateTension(inventory) {
        this.culturalTension = inventory.reduce((tension, item) => {
            if (!item) return tension;
            if (item.hasProperty(ItemProperties.SACRED)) tension += 2;
            if (item.hasProperty(ItemProperties.CEREMONIAL)) tension += 1;
            return tension;
        }, 0);
    }

    tick() {
        this.movesRemaining--;
        if (this.movesRemaining % 10 === 0) {
            this.securityLevel++;
        }
    }

    getScore() {
        return this.itemsReturned * 100 - this.culturalTension * 10;
    }

    transition(to, data = null) {
        this.current = to;
        this.stateData = data;
    }

    is(state) {
        return this.current === state;
    }
}
