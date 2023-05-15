//*************************** */
//Asset Pool
//*************************** */
import { Assets } from "@peasy-lib/peasy-assets";

export enum ASSET_TYPE {
  audio = "audio",
  image = "image",
  font = "font",
}

interface iImageType {
  src: string;
  name: string;
}

interface iAudioType {
  src: string;
  name: string;
  family: string;
}

interface iFontType {
  src: string;
  name: string;
}

interface iAssetType {
  type: iImageType | iAudioType | iFontType;
}

const ASSETPATH = "../../content/Assets/";

export class AssetManager {
  assets: Array<iAssetType> = [];
  percentComplete: number = 0;
  numberOfAssets: number = 0;
  isInitialized: boolean = false;

  public init(assetPath: string) {
    Assets.initialize({ src: assetPath }); // Not necessary, but shortens future paths
    this.isInitialized = true;
  }

  loadAssets(assets: Array<iAssetType>): Promise<void> | undefined {
    if (!this.isInitialized) return undefined;
    this.numberOfAssets += assets.length;
    return new Promise((res, rej) => {
      let loopIndex = 0;
      for (const asset in assets) {
        const ast = assets[asset];
        Assets.load([ast.type.name]);
        loopIndex++;
        this.percentComplete = Math.floor(loopIndex / this.numberOfAssets);
      }
    });
  }

  checkLoad(): number {
    return this.percentComplete;
  }

  getAsset(assetName: string, type: ASSET_TYPE): HTMLAudioElement | HTMLImageElement | FontFace | -1 {
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
}
