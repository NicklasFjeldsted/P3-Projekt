import { IComponent } from './component.h';
import { IUpdate, IAwake } from '../lifecycle';

type constr<T> = { new(...args: unknown[]): T; };

export abstract class Entity implements IUpdate, IAwake
{
	// Create a protected array of IComponents.
	// This is the entire list of components associated
	// with this entity.
	protected _components: IComponent[] = [];

	// Get all components on this entity.
	public get Components(): IComponent[]
	{
		return this._components;
	};

	// Add a new component to this entity.
	public AddComponent(component: IComponent): void
	{
		this._components.push(component);
		component.Entity = this;
	}

	// "C" is a generic class that conforms to IComponent.
	// "constr" is the constructer of the class argument.
	// The "constr" will take the constructor from the argument class
	// and build a temporary class with the same attributes.
	// This archetype is used througout this file.
	// This function finds and returns an IComponent from this entity.
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

	// This function removes an IComponent from this entity.
	public RemoveComponent<C extends IComponent>(constr: constr<C>): void
	{
		let toRemove: IComponent | undefined;
		let index: number | undefined;

		// We use a for loop here with an index because we need it
		// for splicing the index off of the components array on this entity.
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
			toRemove.Entity = null;
			this._components.splice(index, 1);
		}
	}

	// This function returns true if the component array on this entity has
	// the component that is equal to the argument.
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
	public Awake(): void
	{
		for (const component of this._components)
		{
			component.Awake();
		}
	}

	// This function is a part of the game loop and will be called everyframe.
	// This entity will also call the Update function of all the components in this entities component array.
	public Update(deltaTime: number): void
	{
		for (const component of this._components)
		{
			component.Update(deltaTime);
		}
	}
}