class App {
	scrollToElement(anchor: HTMLElement | null) {
		const page = document.getElementById(`page`)

		if (anchor && page) {
			page.scrollTop += anchor.getBoundingClientRect().top - page.getBoundingClientRect().top
		}
	}

	setPath(target: any, _p: any) {
		if (!_p.split) {
			target.push(_p)
		} else {
			_p.split(`.`).forEach((p: any) => {
				if (p.trim() !== ``) {
					target.push(p)
				}
			})
		}
	}

	getBase(base: any, _path: any) {
		let path: any[] = []

		this.setPath(path, _path)

		path.forEach((p: any, i) => {
			if (i !== path.length - 1) {
				base = base[p]
			}
		})

		return base
	}

	deleteThis(base: any, _path: any) {
		let path: any[] = []

		this.setPath(path, _path)

		path.forEach((p: any, i) => {
			if (i === path.length - 1) {
				if (Array.isArray(base)) {
					base.splice(p, 1)
				} else {
					delete base[p]
				}
				return
			}

			base = base[p]
		})
	}

	addThis(base: any, _path: any, item: any) {
		let path: any[] = []

		this.setPath(path, _path)

		path.forEach((p: any, i) => {
			if (i === path.length - 1) {
				if (Array.isArray(base)) {
					base.splice(p, 0, item)
				} else {
					base[p] = item
				}
				return
			}

			base = base[p]
		})
	}

	moveThis(base: any, from: any, to: any) {
		let startBase = this.getBase(base, from)
		let endBase = this.getBase(base, to)
		let startPath: any[] = []
		let endPath: any[] = []

		this.setPath(startPath, from)
		this.setPath(endPath, to)

		let startKey = startPath[startPath.length - 1]
		let endKey = endPath[endPath.length - 1]

		if (Array.isArray(endBase)) {
			endKey = parseInt(endKey)

			if (Array.isArray(startBase)) {
				startKey = parseInt(startKey)

				if (endBase === startBase) {
					let item = endBase[startKey]

					if (startKey > endKey) {
						endBase.splice(startKey, 1)
						endBase.splice(endKey, 0, item)
					} else {
						endBase.splice(endKey, 0, item)
						endBase.splice(startKey, 1)
					}

					return
				}

				endBase.splice(endKey, 0, startBase.splice(startKey, 1)[0])
			} else {
				delete startBase[startKey]
			}
		} else {
			endBase[endKey] = startBase[startKey]

			if (Array.isArray(startBase)) {
				startKey = parseInt(startKey)
				startBase.splice(startKey, 1)
			} else {
				delete startBase[startKey]
			}
		}
	}

	getThis(el: any, path: Array<any> | string, emptyVal?: any) {
		// if can parse path string
		if (path && path.toString().split) {
			path = [el].concat(path.toString().split(`.`))
		} else {
			// else set the element as the first item to get
			path = [el]
		}

		// follow path
		let result = path.reduce(function (accumulator, currentValue) {
			if (accumulator === undefined) {
				return emptyVal
			}

			if (currentValue.indexOf(`.`) === -1 && currentValue.indexOf(`(`) > -1) {
				let argsString: string = ''

				let argsObj = /\((.*?)\)/g.exec(currentValue)

				if (argsObj) {
					argsString = argsObj[1] || ``
				}

				let args = argsString.split(`,`).map((arg) => { return arg.trim() })
				let functionName = currentValue.split(`(`)[0]

				if (typeof accumulator[functionName] === `function`) {
					let result = accumulator[functionName].apply(accumulator, args)
					return result
				}
			}

			if (currentValue) {
				return accumulator[currentValue]
			} else {
				return accumulator
			}

		})

		if (result === undefined) {
			return emptyVal
		}

		return result
	}

	isTruthy(value: any) {
		if (typeof value === `string` && value.trim() === ``) {
			return false
		}

		return value !== undefined &&
			value !== null &&
			value !== `undefined` &&
			value !== `null`
	}

	getTypeOfElement(val: any) {
		try {
			val = JSON.parse(val)
		} catch (e) { }

		if (val === undefined) {
			return "undefined";
		}

		if (val === null) {
			return "null";
		}

		if (val === true || val === false) {
			return "boolean";
		}

		if (typeof val === "number") {
			return "number";
		}

		let possibleDate = new Date(val)

		if (Object.prototype.toString.call(possibleDate) === "[object Date]" && !isNaN(possibleDate.getTime())) {
			return "date";
		}

		if (typeof val === "string") {
			return "string";
		}

		if (Array.isArray(val)) {
			return "array";
		}

		var string = {}.toString.apply(val);

		if (string === "[object Object]") {
			return "object";
		}
		if (string === "[object Function]") {
			return "function";
		}
	}

	isObject(item: any) {
		return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
	}

	deepMerge(original_Object: any, new_Object: any) {
		if (this.isObject(new_Object) && this.isObject(original_Object)) {
			Object.keys(new_Object).forEach(key => {
				if (this.isObject(new_Object[key])) {
					if (!new_Object[key]) Object.assign(new_Object, { [key]: {} });
					this.deepMerge(new_Object[key], new_Object[key]);
				} else {
					Object.assign(new_Object, { [key]: new_Object[key] });
				}
			});
		}
		return new_Object
	}

	selection: any = null

	saveSelection() {
		const sel = window.getSelection()

		if (!sel.focusNode) {
			return
		}

		const parentNode = this.findParentPath(sel.baseNode as HTMLElement, [], `primitive-element`)
		const node = this.findParentPath(sel.extentNode as HTMLElement, [], `editable-text-element`)
		const start = this.findParentPath(sel.anchorNode as HTMLElement, [], `editable-text-element`)

		if (!node || !node.path.length) {
			return
		}

		if (!parentNode || !(parentNode.node as any).id) {
			return
		}

		this.selection = {
			id: (parentNode.node as any).id,
			offsetEnd: sel.extentOffset,
			offsetStart: sel.anchorOffset,
			path: node.path,
			pathStart: start.path
		}
	}

	restoreSelection() {
		if (!this.selection) {
			return
		}

		const mainEl = document.body.querySelector(`#${this.selection.id} .editable-text-element`)
		let el = mainEl
		let startEl = mainEl

		if (!el) {
			return
		}

		this.selection.path.forEach((i: number) => {
			if ((el as any).childNodes[i]) {
				el = (el as any).childNodes[i]
			}
		})

		this.selection.pathStart.forEach((i: number) => {
			if ((startEl as any).childNodes[i]) {
				startEl = (startEl as any).childNodes[i]
			}
		})

		if (!el) {
			return
		}

		if (!startEl) {
			return
		}

		const sel = window.getSelection()
		const range = document.createRange()
		range.setStart(startEl, this.selection.offsetStart)
		range.setEnd(el, this.selection.offsetEnd)
		// range.collapse(true)
		sel.removeAllRanges()
		sel.addRange(range)
	}

	clearSelection() {
		window.getSelection().removeAllRanges()
		this.selection = null
	}

	findParentPath(target: Node, arr: Array<any>, _class: string): { node: Node, path: Array<any> } {
		const index = () => {
			if (target.parentNode) {
				for (let i = 0; i < target.parentNode.childNodes.length; i++) {
					if (target.parentNode.childNodes[i] === target) {
						return i
					}
				}
			}
		}

		if ((target as any).className && (target as any).className.indexOf(_class) > -1) {
			return { node: target, path: arr }
		} else if (target.parentNode) {
			arr.unshift(index())
			return this.findParentPath(target.parentNode, arr, _class)
		}

		return { node: target, path: arr }
	}
}

export default new App()