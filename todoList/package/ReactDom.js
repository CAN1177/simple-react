import React from './React.js'

const ReactDom = {
	createRoot(container) {
		return {
			render(APP) {
				React.render(APP, container);
			}
		}
	}
}

export default ReactDom