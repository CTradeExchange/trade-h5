import { Button } from 'vant'

const components = [Button]
const install = (app, options) => {
    console.log(app, options, components)
    components.forEach(component => {
        app.use(component)
    })
}
export default {
    install
}
