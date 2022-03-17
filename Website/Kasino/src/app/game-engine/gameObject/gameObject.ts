import { Entity, IComponent, Transform, Vector3 } from "../utils";

export class GameObject extends Entity
{
	public transform: Transform;
	
	constructor()
	{
		super();
		this.transform = new Transform(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0));
	}

	public override AddComponent(component: IComponent): void
	{
		component.gameObject = this;
	}
}