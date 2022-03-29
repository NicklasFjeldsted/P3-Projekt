import { Guid } from '../guid';
import { IUpdate, IAwake, IStart } from '../lifecycle';
import { IFeature } from './feature.h';

// Read up on JavaScript prototype inheritance.
// This Type basicly is this "thing" must be a function AND has to extend <T>
type AbstractFeature<T> = Function & { prototype: T; };

type constr<T> = AbstractFeature<T> | { new(...args: unknown[]): T; };

export abstract class Entity implements IUpdate, IAwake, IStart
{
	/** This is a unique identifier for this Entity. */
	public entityId: string;

	constructor(){ this.entityId = Guid.newGuid() }

	// Create a protected array of IFeature.
	/** This is the entire array of features associated with this entity. */
	protected _features: IFeature[] = [];

	/** Public getter for the all features on this entity. */
	public get Features(): IFeature[]
	{
		return this._features;
	};

	/** Add a new feature to this entity. */
	public AddFeature(feature: IFeature): void
	{
		this._features.push(feature);
	}

	// "C" is a generic class that conforms to IFeature.
	// "constr" is the constructer of the class argument.
	// The "constr" will take the constructor from the argument class
	// and build a temporary class with the same attributes.
	// This archetype is used througout this file.
	/** Get a Feature from this entity. */
	public GetFeature<C extends IFeature>(constr: constr<C>): C
	{
		for (const feature of this._features)
		{
			// Check if the feature we are on in the loop is the same
			// as the constructor, meaning we found the feature we were looking for.
			if (feature instanceof constr)
			{
				return feature as C;
			}
		}
		throw new Error(`Feature ${constr.name} not found on Entity ${this.constructor.name}!`);
	}

	/** Remove a Feature from this entity. */
	public RemoveFeature<C extends IFeature>(constr: constr<C>): void
	{
		let toRemove: IFeature | undefined;
		let index: number | undefined;

		// We use a for loop here with an index because we need it
		// for splicing the index off of the features array on this entity.
		for (let i = 0; i < this._features.length; i++)
		{
			const feature = this._features[ i ];

			// Check if the feature we are on in the loop is the same
			// as the constructor, meaning we found the feature we were looking for.
			if (feature instanceof constr)
			{
				// If we found the feature set the feature to remove equal to that feature
				// and set the index of the feature equal to the current loop index.
				toRemove = feature;
				index = i;
				break;
			}
		}

		// If we found the index and the feature we want to remove we can then proceed to remove them.
		if (toRemove && index)
		{
			toRemove.Entity = null;
			this._features.splice(index, 1);
		}
	}

	// This function returns true if the feature array on this entity has
	// the feature that is equal to the argument.
	/** Returns whether or not this entity contains a Feature of the argument. */
	public HasFeature<C extends IFeature>(constr: constr<C>): boolean
	{
		for (const feature of this._features)
		{
			// Check if the feature is of the same instance as the constructor.
			if (feature instanceof constr)
			{
				return true
		  	}
		}
	
		return false
	}

	// This function is a part of the start up of the game loop.
	// This entity will also call the Awake function of all the features in this entities feature array.
	/** This is the first call made to this entity when the game compiles. */
	public Awake(): void
	{
		for (const feature of this._features)
		{
			feature.Awake();
		}
	}

	public Start(): void
	{
		
	}

	// This function is a part of the game loop and will be called everyframe.
	// This entity will also call the Update function of all the features in this entities feature array.
	/** This method will be called every frame, the deltaTime is the time that passed since the last frame call. */
	public Update(deltaTime: number): void
	{
		for (const feature of this._features)
		{
			feature.Update(deltaTime);
		}
	}
}