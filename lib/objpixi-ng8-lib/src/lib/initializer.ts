import {ITexId} from './interface/itex-id';
import {Point} from './geometries/Point/point';
import {Mover} from './interaction/moving/mover';
import {ScaleArrow} from './interaction/scaling/objects/scale-arrow';
import {TextureManager} from './utils/texture-manager';

export class Initializer {
    public static Initialized = false;
    OnLoading: () => void;
    OnBeforeLoading: (texIds: Array<ITexId>) => Array<ITexId>;
    OnInitialized: (result: boolean) => void;

    Init() {
        if (Initializer.Initialized) {
            if (this.OnInitialized !== undefined) {
                this.OnInitialized(true);
                return;
            }
        }
        let ids: Array<ITexId> = [];
        Point.TextureIds.forEach(t => {
           ids.push(t);
        });
        Mover.TextureIds.forEach(t => ids.push(t));
        ScaleArrow.TextureIds.forEach(t => ids.push(t));
        if (this.OnBeforeLoading !== undefined) {
            ids = this.OnBeforeLoading(ids);
        }
        if (this.OnLoading !== undefined) {
            this.OnLoading();
        }

        TextureManager.AddTextures(ids, results => {
            let success = true;
            for (const k of Object.keys(results)) {
                if (!results[k]) {
                    console.log('failed to get texture: %s', k);
                    success = false;
                }
            }
            if (this.OnInitialized !== undefined) {
                this.OnInitialized(success);
            }
            Initializer.Initialized = success;
        }, true);
    }
}
