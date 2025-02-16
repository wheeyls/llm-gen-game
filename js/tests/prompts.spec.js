import ItemPrompt from '../prompts/itemPrompt.js';
import ExitPrompt from '../prompts/exitPrompt.js';
import Item from '../item.js';

describe('Prompts', () => {
    describe('ItemPrompt', () => {
        let prompt;
        let item;

        beforeEach(() => {
            item = new Item(0, 0, 'TestItem');
            prompt = new ItemPrompt(item);
        });

        it('starts with slot 0 selected', () => {
            expect(prompt.selectedSlot).toBe(0);
        });

        it('changes selection with arrow keys', () => {
            prompt.handleInput('ArrowDown');
            expect(prompt.selectedSlot).toBe(1);
            
            prompt.handleInput('ArrowUp');
            expect(prompt.selectedSlot).toBe(0);
        });

        it('handles WASD keys', () => {
            prompt.handleInput('s');
            expect(prompt.selectedSlot).toBe(1);
            
            prompt.handleInput('w');
            expect(prompt.selectedSlot).toBe(0);
        });

        it('confirms selection with Enter', () => {
            prompt.selectedSlot = 2;
            const result = prompt.handleInput('Enter');
            
            expect(result).toEqual({
                action: 'confirm',
                slot: 2
            });
            expect(prompt.visible).toBe(false);
        });

        it('cancels with Escape', () => {
            const result = prompt.handleInput('Escape');
            
            expect(result).toEqual({
                action: 'cancel'
            });
            expect(prompt.visible).toBe(false);
        });

        it('allows number key shortcuts', () => {
            const result = prompt.handleInput('3');
            
            expect(result).toEqual({
                action: 'confirm',
                slot: 2
            });
            expect(prompt.visible).toBe(false);
        });
    });

    describe('ExitPrompt', () => {
        let prompt;
        let inventory;

        beforeEach(() => {
            inventory = new Array(5).fill(null);
            inventory[0] = new Item(0, 0, 'Item1');
            inventory[2] = new Item(0, 0, 'Item2');
            prompt = new ExitPrompt(inventory);
        });

        it('starts with first option selected', () => {
            expect(prompt.selectedOption).toBe(0);
        });

        it('changes selection with arrow keys', () => {
            prompt.handleInput('ArrowDown');
            expect(prompt.selectedOption).toBe(1);
            
            prompt.handleInput('ArrowUp');
            expect(prompt.selectedOption).toBe(0);
        });

        it('handles WASD keys', () => {
            prompt.handleInput('s');
            expect(prompt.selectedOption).toBe(1);
            
            prompt.handleInput('w');
            expect(prompt.selectedOption).toBe(0);
        });

        it('confirms exit with Enter', () => {
            prompt.selectedOption = 0;
            const result = prompt.handleInput('Enter');
            
            expect(result).toEqual({
                action: 'exit'
            });
            expect(prompt.visible).toBe(false);
        });

        it('continues exploring when second option selected', () => {
            prompt.selectedOption = 1;
            const result = prompt.handleInput('Enter');
            
            expect(result).toEqual({
                action: 'continue'
            });
            expect(prompt.visible).toBe(false);
        });

        it('cancels with Escape', () => {
            const result = prompt.handleInput('Escape');
            
            expect(result).toEqual({
                action: 'continue'
            });
            expect(prompt.visible).toBe(false);
        });
    });
});
