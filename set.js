/**
 * This is an implementation of custom set class.
 * @author Ramesh Kumar
 *
 */
class Set {
	/**
	 * initialization of an object.
	 */
	constructor() {
		this.collection = [];
	}
	/**
	 * Adds an element to the set.
	 * @param Set value an element for Set
	 */
	add(value) {
		if (!this.has(value)) {
			this.collection.push(value);
			return true;
		}
		return false;
	}
	/**
	 * Checks weather a particular element is exists or not in set.
	 * @param Set value an element of Set.
	 */
	has(value) {
		if (this.collection.indexOf(value) !== -1) {
			return true;
		}
		return false;
	}
	/**
	 * Returns all the values on the set.
	 */
	values() {
		return this.collection;
	}
	/**
	 * Removes an element from the set.
	 * @param Set value an element of Set.
	 */
	remove(value) {
		if (this.has(value)) {
			var index = this.collection.indexOf(value);
			this.collection.splice(index, 1);
			return true;
		}
		return false;
	}
	/**
	 * Returns union of two sets.
	 * @param Set otherSet object of set.
	 */
	union(otherSet) {
		var set = new Set();
		this.collection.forEach((element) => {
			set.add(element);
		});
		otherSet.values().forEach((element) => {
			set.add(element);
		});
		return set;
	}
	/**
	 * Returns intersection of two sets.
	 * @param Set otherSet object of set.
	 */
	intersection(otherSet) {
		var set = new Set();
		this.collection.forEach((element) => {
			if (otherSet.has(element)) {
				set.add(element);
			}
		});
		return set;
	}
	/**
	 * Returns difference of two sets.
	 * @param Set otherSet object of set.
	 */
	difference(otherSet) {
		var set = new Set();
		this.collection.forEach((element) => {
			if (!otherSet.has(element)) {
				set.add(element);
			}
		});
		return set;
	}
	/**
	 * Returns symmetric difference of two sets.
	 * @param Set otherSet object of set.
	 */
	symmetricDifference(otherSet) {
		return this.difference(otherSet).union(otherSet.difference(this));
	}
}