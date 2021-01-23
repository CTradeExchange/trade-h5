import { Button, popup, Dialog, Cell, CellGroup, Stepper, Checkbox, CheckboxGroup, Tab, Tabs, ActionSheet, Swipe, SwipeItem, Icon } from 'vant'

const components = [Button, popup, Dialog, Cell, CellGroup, Stepper, Checkbox, CheckboxGroup, Tab, Tabs, ActionSheet, Swipe, SwipeItem, Icon]
const install = (app, options) => {
    console.log(app, options, components)
    components.forEach(component => {
        app.use(component)
    })
}
export default {
    install
}
