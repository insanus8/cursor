const box = document.querySelector('.pole')

const cursor = new Cursor({
    box: document.body,
    tag: document.querySelector('.dot')
})
const cursor2 = new Cursor({
    box: document.body,
    tag: document.querySelector('.circle'),
    className: 'circle',
    elementsHover: {
        '.block': {
            enter: (e, cursor) => console.log(true),
            leave: (e, cursor) => cursor2.timout = 50,
        } 
    },
    timout: 50,
})