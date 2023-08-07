class Cursor {
    _box 
    x = 0
    y = 0
    _elementsHover = []

    constructor({ box, tag, className, elementsHover = {}, isDefultElementsHover = true, mouseEvent, timout }) {
        const defultElementsHover = isDefultElementsHover ? {
            'a': {},
            'button': {},
            'input': {},
            'textarea': {},
            'select': {},
            'option': {},
        } : {}
        
        this.cursor = tag
        this.className = className ?? 'cursor'
        this.box = box
        this.elementsHover = {
            ...defultElementsHover,
            ...elementsHover
        }
        this.isAndroin = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        this.mouseEvent = mouseEvent ?? {}
        this.timout = timout ?? 0
    }

    setMouseMove(e, cursor) {
        cursor.classList.remove(`${this.className}--hidden`)
        let width = cursor.offsetWidth / 2
        let height = cursor.offsetHeight / 2

        const coordinatX = e.clientX - this.boxCoordinat.left
        const coordinatY = e.clientY - this.boxCoordinat.top

        if (width >= coordinatX) width =coordinatX
        if (height >= coordinatY) height = coordinatY

        let x = coordinatX - width
        let y = coordinatY - height
        
        if ( coordinatX + width >= this.box.offsetWidth ) x = this.x
        if ( coordinatY + height >= this.box.offsetHeight ) y = this.y

        return [x, y]
    }

    mousemove(e) {
        if (this.isAndroin) return
        const [x, y] = this.setMouseMove(e, this.cursor)

        setTimeout(() => {
            this.cursor.style.top = `${y}px`
            this.cursor.style.left = `${x}px`
            this.x = x
            this.y = y
            
            this.mouseEvent['mousemove'] && this.mouseEvent['mousemove'](e, this.cursor)
        }, this.timout)
    }

    mouseup(e) {
        if (this.isAndroin) return
        this.cursor.classList.remove(`${this.className}--down`)
        this.mouseEvent['mouseup'] && this.mouseEvent['mouseup'](e, this.cursor)
    }

    mousedown(e) {
        if (this.isAndroin) return
        this.cursor.classList.add(`${this.className}--down`)
        this.mouseEvent['mousedown'] && this.mouseEvent['mousedown'](e, this.cursor)
    }

    mouseleave(e) {
        if (this.isAndroin) return
        this.cursor.classList.add(`${this.className}--hidden`)
        this.mouseEvent['mouseleave'] && this.mouseEvent['mouseleave'](e, this.cursor)
    }

    get box() {
        return this._box
    }

    set box(value) {
        this._box = value

        this.boxCoordinat = this._box.getBoundingClientRect()

        this.cursor.classList.add(`${this.className}--hidden`)

        window.addEventListener('resize', () => (
            this.isAndroin = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ))

        this.box.addEventListener('mousemove', (e) => this.mousemove(e))
        this.box.addEventListener('mouseup', (e) => this.mouseup(e))
        this.box.addEventListener('mousedown', (e) => this.mousedown(e))
        this.box.addEventListener('mouseleave', (e) => this.mouseleave(e))
    }

    get elementsHover() {
        return this._elementsHover
    }

    set elementsHover(object) {
        this._elementsHover = object
        const keys = Object.keys(object)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const el = object[key]
            let hovers = this.box.querySelectorAll(key)
            hovers.forEach((item, i) => {
                item.addEventListener('mouseenter', e => {
                    if (this.isAndroin) return
                    this.cursor.classList.add(`${this.className}--hover`)
                    el.enter && el.enter(e, this.cursor)
                })
                item.addEventListener('mousemove', e => {
                    if (this.isAndroin) return
                    el.move && el.move(e, this.cursor)
                })
                item.addEventListener('mouseleave', e => {
                    if (this.isAndroin) return
                    this.cursor.classList.remove(`${this.className}--hover`)
                    el.leave && el.leave(e, this.cursor)
                })
            })
        }
    }
}