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
      console.log('retrieve textures');
      if (callback !== null) {
        TextureManager._fetch(id, callback);
        console.log('retrieve textures callback');
      } else {
        console.log('retrieve textures no callback');
        TextureManager._fetch(id, () => {
        });
      }
    } else {
      console.log('not retrieve textures');
      if (callback !== null) {
        callback(true);
      }
    }
  }

  static AddTextures(items: Array<ITexId>, callback: (results: { [id: string]: boolean }) => void,
                     retrieve: boolean = false) {
    console.log('Add textures');
    const retrieves: { [id: string]: boolean } = {};
    items.forEach(value => {
      TextureManager.AddTexture(value.id, value.url, retrieve, (result) => {
        retrieves[value.id] = result;
        console.log('Texture added');
        if (Object.keys(retrieves).length === items.length) {
          callback(retrieves);
          console.log(retrieves);
        }
      });
    });
  }

  static Retrieve(id: string): PIXI.Texture {
    const keys = Object.keys(TextureManager.Textures);
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
    console.log('loading %s', TextureManager.Textures[id].url);
    tmpTex.baseTexture.on('loaded', () => {
      TextureManager.Textures[id].texture = tmpTex;
      callback(true);
      console.log('Texture loaded');
    });
    tmpTex.baseTexture.on('error', () => {
      callback(false);
      console.log('Texture error');

    });
  }

}
