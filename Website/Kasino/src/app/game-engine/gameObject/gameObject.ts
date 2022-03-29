import { Game } from "../game/game";
import { Entity, IComponent, Transform, Vector2, Vector3 } from "../utils";

type AbstractComponent<T> = Function & { prototype: T; };

type constr<T> = AbstractComponent<T> | { new(...args: unknown[]): T; };

export class GameObject extends Entity
{
	/** All GameObjects that exists, **NOT** instantiated. */
	private static _gameObjects: GameObject[] = [];

	public isActive: boolean = true;

	/** This GameObject's parent. */
	private _parent: GameObject;

	/** This GameObject's children. */
	private _children: GameObject[] = [];

	/** Public getter for all this GameObject's children. */
	public get Children(): GameObject[]
	{
		return this._children;
	}

	public Child(index: number): GameObject
	{
		return this._children[ index ];
	}

	/** Add a child to this GameObject. */
	public SetParent(newParent: GameObject): void
	{
		this.transform.position = new Vector3(
			this.transform.position.x + newParent.transform.position.x,
			this.transform.position.y + newParent.transform.position.y,
			this.transform.position.z + newParent.transform.position.z
		);

		this._parent = newParent;
		this._parent._children.push(this);
	}

	/** This GameObjects name, this is not a unique identifier. */
	public gameObjectName: string;
	
	private _transform: Transform;
	/** Transform for this GameObject, it contains a position, rotation, and a scale. */
	public get transform(): Transform
	{
		if (!this._transform)
		{
			this._transform = new Transform();
		}

		return this._transform;
	}

	private _size: Vector2 = new Vector2(100, 100);

	/** **deprecated** 
	 * Get the size of the GameObject.
	 * 
	 * This is the overall Width and Height of the GameObject.
	 */
	public get Size(): Vector2
	{
		return this._size;
	}

	/** **deprecated**
	 * Set the size of the GameObject.
	 * 
	 * This is the overall Width and Height of the GameObject.
	 * 
	 * This is **ONLY** supposed to be set by a rendering component.
	*/
	public set Size(value: Vector2)
	{
		this._size = value;
	}

	// Create a protected array of IComponents.
	/** This is the entire array of components associated with this entity. */
	private _components: IComponent[] = [];

	/** Public getter for the all components on this entity. */
	public get Components(): IComponent[]
	{
		return this._components;
	}

	constructor(name?: string, instantiate: boolean = true)
	{
		super();
		GameObject._gameObjects.push(this);

		name ? this.gameObjectName = name : this.gameObjectName = 'New GameObject';

		if (instantiate === true)
		{
			Game.Instance.Instantiate(this);
		}
	}

	/** Returns the first GameObjects with the given component. */
	public static FindOfType<C extends IComponent>(constr: constr<C>): GameObject
	{
		for (const gameObject of this._gameObjects)
		{
			if (gameObject.HasComponent(constr))
			{
				return gameObject;
			}
		}
		throw new Error(`No GameObject has ${constr.name}!`);
	}

	/** Return all GameObjects with the given component. */
	public static FindAllOfType<C extends IComponent>(constr: constr<C>): GameObject[]
	{
		const outputArray: GameObject[] = [];

		for (const gameObject of this._gameObjects)
		{
			if (gameObject.HasComponent(constr))
			{
				outputArray.push(gameObject);
			}
		}

		return outputArray;
	}

	/** Add a new component to this entity. */
	public AddComponent(component: IComponent): void
	{
		component.gameObject = this;
		this._components.push(component);
	}

	// "C" is a generic class that conforms to IComponent.
	// "constr" is the constructer of the class argument.
	// The "constr" will take the constructor from the argument class
	// and build a temporary class with the same attributes.
	// This archetype is used througout this file.
	/** Get a Component from this entity. */
	public GetComponent<C extends IComponent>(constr: constr<C>): C
	{
		for (const component of this._components)
		{
			// Check if the component we are on in the loop is the same
			// as the constructor, meaning we found the component we were looking for.
			if (component instanceof constr)
			{
				return component as C;
			}
		}
		throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}!`);
	}

	/** Remove a Component from this entity. */
	public RemoveComponent<C extends IComponent>(constr: constr<C>): void
	{
		let toRemove: IComponent | undefined;
		let index: number | undefined;

		// We use a for loop here with an index because we need it
		// for splicing the index off of the components array on this GameObject.
		for (let i = 0; i < this._components.length; i++)
		{
			const component = this._components[ i ];

			// Check if the component we are on in the loop is the same
			// as the constructor, meaning we found the component we were looking for.
			if (component instanceof constr)
			{
				// If we found the component set the component to remove equal to that component
				// and set the index of the component equal to the current loop index.
				toRemove = component;
				index = i;
				break;
			}
		}

		// If we found the index and the component we want to remove we can then proceed to remove them.
		if (toRemove && index)
		{
			toRemove.gameObject = null;
			this._components.splice(index, 1);
		}
	}

	// This function returns true if the component array on this entity has
	// the component that is equal to the argument.
	/** Returns whether or not this entity contains a Component of the argument. */
	public HasComponent<C extends IComponent>(constr: constr<C>): boolean
	{
		for (const component of this._components)
		{
			// Check if the component is of the same instance as the constructor.
			if (component instanceof constr)
			{
				return true
		  	}
		}
	
		return false
	}

	// This function is a part of the start up of the game loop.
	// This entity will also call the Awake function of all the components in this entities component array.
	/** This is the first call made to this entity when the game compiles. */
	public override Awake(): void
	{
		for (const child of this._children)
		{
			child.Awake();
		}

		for (const component of this._components)
		{
			component.Awake();
		}
	}

	public override Start(): void
	{
		for (const child of this._children)
		{
			child.Start();
		}

		for (const component of this._components)
		{
			component.Start();
		}
	}

	// This function is a part of the game loop and will be called everyframe.
	// This entity will also call the Update function of all the components in this entities component array.
	/** This method will be called every frame, the deltaTime is the time that passed since the last frame call. */
	public override Update(deltaTime: number): void
	{
		if (this._parent)
		{
			this.isActive = this._parent.isActive;
		}

		for (const child of this._children)
		{
			child.Update(deltaTime);
		}

		for (const component of this._components)
		{
			component.Update(deltaTime);
		}
	}
}