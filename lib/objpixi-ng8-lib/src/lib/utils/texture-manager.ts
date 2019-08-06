import * as PIXI from 'pixi.js';
import {ITexId} from '../interface/itex-id';


export interface ITexItem {
    texture?: PIXI.Texture;
    url: string;
}

// Holds and creates textures for central management
export class TextureManager {
    static Textures: { [id: string]: ITexItem } = {};

    static AddTexture(id: string, url: string, retrieve: boolean = false, callback: (result: boolean) => void = null) {
        TextureManager.Textures[id] = {url};
        if (retrieve) {
            if (callback !== null) {
                TextureManager._fetch(id, callback);
            } else {
                TextureManager._fetch(id, () => {
                });
            }
        } else {
            if (callback !== null) {
                callback(true);
            }
        }
    }

    static AddTextures(items: Array<ITexId>, callback: (results: { [id: string]: boolean }) => void,
                       retrieve: boolean = false) {
        const retrieves: { [id: string]: boolean } = {};
        items.forEach(value => {
            TextureManager.AddTexture(value.id, value.url, retrieve, (result) => {
                retrieves[value.id] = result;
                if (Object.keys(retrieves).length === items.length) {
                    callback(retrieves);
                }
            });
        });
    }

    static Retrieve(id: string): PIXI.Texture {
        if (!(id in TextureManager.Textures)) {
            return null;
        }
        if (TextureManager.Textures[id].texture === undefined) {
            return null;
        }
        return TextureManager.Textures[id].texture;
    }

    static RetrieveAsync(id: string, callback: (result: boolean, tex: PIXI.Texture) => void,
                         forceRetrieve: boolean = false) {
        if (!(id in TextureManager.Textures)) {
            callback(false, null);
            return;
        }
        if (TextureManager.Textures[id].texture === undefined) {
            TextureManager._fetch(id, result => {
                if (result) {
                    callback(true, TextureManager.Textures[id].texture);
                } else {
                    callback(false, null);
                }
            });
        } else {
            callback(true, TextureManager.Textures[id].texture);
        }
    }

    private static _fetch(id: string, callback: (result: boolean) => void) {
        const tmpTex = PIXI.Texture.from(TextureManager.Textures[id].url);
        tmpTex.on('loaded', () => {
            TextureManager.Textures[id].texture = tmpTex;
            callback(true);
        });
        tmpTex.on('error', () => {
            callback(false);
        });
    }

}
