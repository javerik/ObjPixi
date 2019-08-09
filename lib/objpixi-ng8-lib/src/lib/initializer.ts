import {ITexId} from './interface/itex-id';
import {Point} from './geometries/Point/point';
import {Mover} from './interaction/moving/mover';
import {ScaleArrow} from './interaction/scaling/objects/scale-arrow';
import {TextureManager} from './utils/texture-manager';

export class Initializer {
  private static Initialized: boolean = false;
  OnLoading: () => void;
  OnBeforeLoading: (texIds: Array<ITexId>) => Array<ITexId>;
  OnInitialized: (result: boolean) => void;

  Init() {
    Initializer.Initialized = true;
    this.OnInitialized(true);
  }
}
