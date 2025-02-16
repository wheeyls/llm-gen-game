import Game from '../game.js';
import { ItemProperties } from '../itemProperties.js';
import { FakeCanvas } from './fakeCanvas.js';

describe('Game Integration', () => {
    let game;
    let canvas;

    beforeEach(() => {
        // Setup canvas in test environment
        canvas = new FakeCanvas();
        canvas.id = 'gameCanvas';
        canvas.width = 600;
        canvas.height = 600;

        game = new Game(canvas);
    });

    describe('Game Flow', () => {
        it('starts in transition world', () => {
            expect(game.currentWorld).toBe(game.transitionWorld);
        });

        it('transitions to game world after dialog completion', () => {
            // Complete transition dialog
            game.currentWorld.handleInput('Enter'); // Select "Let's just explore"
            game.currentWorld.handleInput('Enter'); // Confirm "Let's begin"
            game.currentWorld.handleInput('Enter'); // Enter world
            
            expect(game.currentWorld).toBe(game.gameWorld);
        });
    });

    describe('Item Collection', () => {
        beforeEach(() => {
            // Move to game world
            game.startGameWorld();
        });

        it('allows picking up items', () => {
            const world = game.gameWorld;
            const item = world.items[0];
            
            // Move player to item
            world.player.x = item.x;
            world.player.y = item.y;
            world.update();

            // Verify item prompt appears
            expect(world.itemPrompt).not.toBeNull();
            
            // Pick up item
            world.handleInput('1'); // Select slot 1
            
            expect(world.inventory[0]).toBe(item);
            expect(world.items).not.toContain(item);
        });

        it('maintains item properties after pickup', () => {
            const world = game.gameWorld;
            const item = world.items[0];
            const initialProperties = new Set(item.properties);
            
            // Pickup item
            world.player.x = item.x;
            world.player.y = item.y;
            world.update();
            world.handleInput('1');
            
            expect(world.inventory[0].properties).toEqual(initialProperties);
        });
    });

    describe('Room Navigation', () => {
        beforeEach(() => {
            game.startGameWorld();
        });

        it('maintains inventory across rooms', () => {
            const world = game.gameWorld;
            
            // Pick up item in first room
            const item = world.items[0];
            world.player.x = item.x;
            world.player.y = item.y;
            world.update();
            world.handleInput('1');
            
            const initialInventory = [...world.inventory];
            
            // Move to next room
            world.player.x = world.width;
            world.update();
            
            expect(world.inventory).toEqual(initialInventory);
        });

        it('maintains unique items per room', () => {
            const world = game.gameWorld;
            const initialRoomKey = `${world.gridX},${world.gridY}`;
            const initialItems = [...world.roomItems[initialRoomKey]];
            
            // Move to next room
            world.player.x = world.width;
            world.update();
            
            const newRoomKey = `${world.gridX},${world.gridY}`;
            expect(world.roomItems[newRoomKey]).not.toEqual(initialItems);
        });
    });

    describe('Item Properties', () => {
        beforeEach(() => {
            game.startGameWorld();
        });

        it('assigns valid properties to items', () => {
            const world = game.gameWorld;
            const item = world.items[0];
            
            // Check that item has 2-3 properties
            expect(item.properties.size).toBeGreaterThanOrEqual(2);
            expect(item.properties.size).toBeLessThanOrEqual(3);
            
            // Check that all properties are valid
            for (const prop of item.properties) {
                expect(Object.values(ItemProperties)).toContain(prop);
            }
        });

        it('generates appropriate descriptions based on properties', () => {
            const world = game.gameWorld;
            const item = world.items[0];
            
            if (item.hasProperty(ItemProperties.SUSPICIOUS)) {
                expect(item.description).toContain("legitimate means");
            }
            if (item.hasProperty(ItemProperties.SACRED)) {
                expect(item.description).toContain("altar marks");
            }
        });
    });
});
