export let getElementFromTemplate = (templateHtml) => {
	let template = document.createElement('div');
	template.innerHTML = templateHtml;

	return template.firstChild;
};