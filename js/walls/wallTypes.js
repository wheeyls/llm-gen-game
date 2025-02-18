import ConfusionWall from './confusionWall.js';
import DarknessWall from './darknessWall.js';
import ForgottenWall from './forgottenWall.js';
import OfrendaWall from './ofrendaWall.js';
import PortalWall from './portalWall.js';
import VoidWall from './voidWall.js';
import Wall from './wall.js';

export const manualMap = {
  C: ConfusionWall,
  D: DarknessWall,
  F: ForgottenWall,
  O: OfrendaWall,
  P: PortalWall,
  V: VoidWall,
  '#': Wall,
};
