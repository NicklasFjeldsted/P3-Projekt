import { Vector2 } from "../vector2";

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
	public get Size(): Vector2
	{
		return new Vector2(
			this._image.naturalWidth - this._image.width,
			this._image.naturalHeight - this._image.height
		)
	}
}