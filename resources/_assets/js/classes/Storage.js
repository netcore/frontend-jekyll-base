export default class Storage {
	constructor () {
		this.storage = global.localStorage
	}

	/**
	 * Gets a value of an item from localStorage
	 * @function get
	 * @param {string} key
	 * @returns {string|object} Item
	 */
	get (key) {
		if (typeof key !== 'string')
			throw new Error(`Invalid parameter - Storage.get(key). Expected string - got ${typeof key}`)

		try {
			this.item = JSON.parse(this.storage.getItem(key))
		} catch (error) {
			this.item = this.storage.getItem(key)
		}

		return this.item
	}

	/**
	 * Sets a value to an item in localStorage
	 * @function set
	 * @param {string} key
	 * @param {string|boolean|object|number} value
	 * @returns {string|object} Updated item
	 */
	set (key, value) {
		if (typeof key !== 'string' || !(['string', 'boolean', 'number', 'object'].includes(typeof value)))
			throw new Error(`Invalid parameter - Storage.set(key, value). Expected string & string|boolean|object|number - got ${typeof key} & ${typeof value}`)

		this.storage.setItem(key, JSON.stringify(value))
		return this.get(key)
	}

	/**
	 * Removes an item from the localStorage
	 * @function remove
	 * @param {string} key
	 * @returns {string|object} Removed item
	 */
	remove (key) {
		if (typeof key !== 'string')
			throw new Error(`Invalid parameter - Storage.get(key). Expected string - got ${typeof key}`)

		this.item = this.get(key)
		this.storage.removeItem(key)

		return this.item
	}

	/**
	 * Clears localStorage
	 * @function clear
	 * @returns {number} Removed item amount
	 */
	clear () {
		let length = this.storage.length
		this.storage.clear()
		return length
	}
}