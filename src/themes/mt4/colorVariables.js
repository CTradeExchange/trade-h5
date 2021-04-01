const colors = {
    'color':'#333',
    'mutedColor':'#989898',
    'placeholder':'#c2c2c2',
    'tabColor':'#333',
    'tabLine':'#333',
    'bdColor':'#e5e5e5',
    'btnColor':'#f6f6f6',
    'btnLine':'#e5e5e5',
    'btnText':'#333',
    'btnText2':'#989898',
    'btnSelected':'#ff7418',
    'btnInterval':'#e5e5e5',
    'iconColor':'#333',
    'iconColor2':'#333',
    'white':'#fff',
    'bgColor':'#fff',
    'riseColor':'#E3525C',
    'fallColor':'#007AFF',
    'sellColor':'#E3525C',
    'buyColor':'#007AFF',
    'primary':'#007AFF',
}

// 设置root变量
export function setRootVariable(colors){
    const style = document.documentElement.style
    for (const key in colors) {
        if (Object.hasOwnProperty.call(colors, key)) {
            const el = colors[key];
            style.setProperty(`--${key}`, el)
        }
    }
}
export default colors
