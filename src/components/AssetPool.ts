//*************************** */
//Asset Pool
//*************************** */
import { Assets } from "@peasy-lib/peasy-assets";

export enum ASSET_TYPE {
  audio = "audio",
  image = "image",
  font = "font",
}
const ASSETPATH = "./content/Assets/";

export class AssetManager {
  static init(assetPath?: string) {
    let path;
    assetPath ? (path = assetPath) : (path = ASSETPATH);
    Assets.initialize({ src: path }); // Not necessary, but shortens future paths
  }

  static async loadAssets(assets: Array<string>) {
    Assets.load([...assets]);
  }

  static checkLoad(): { remaining: number; percentComplete: number } {
    console.log("assetpool: loaded: ", Assets.loaded, " reqeusted: ", Assets.requested);

    return {
      remaining: Assets.pending,
      percentComplete: Assets.loaded / Assets.requested,
    };
  }

  static getAsset(assetName: string, type: ASSET_TYPE): HTMLAudioElement | HTMLImageElement | FontFace | -1 {
    switch (type) {
      case ASSET_TYPE.audio:
        return Assets.audio(assetName);
      case ASSET_TYPE.image:
        return Assets.image(assetName);
      case ASSET_TYPE.font:
        return Assets.font(assetName);
      default:
        return -1;
    }
  }

  async clearAssets() {
    await Assets.clear();
    return true;
  }
}
