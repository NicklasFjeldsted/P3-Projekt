import { Vector3 } from "../vector3";

export class Sprite
{
	private _image: HTMLImageElement;

	public set ImageSrc(source: string)
	{
		this._image.src = source;
	}

	public get Image(): HTMLImageElement
	{
		let output: HTMLImageElement = new HTMLImageElement();
		output.src = this._image.src;
		return output;
	}

	/** Public getter for the Size of this Sprite. */
	public get Size(): Vector3
	{
		return new Vector3(
			this._image.naturalWidth - this._image.width,
			this._image.naturalHeight - this._image.height,
			0
		)
	}
}