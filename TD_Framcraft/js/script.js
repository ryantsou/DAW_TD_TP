function generateFields() {
    const fieldParts = document.querySelector('field-parts');

    for (let i = 0; i < 25; i++){
        const fieldPart = document.createElement('field-part'); 
        fieldPart.classList.add('grass');
        fieldParts.append(fieldPart)
    }
}
window.addEventListener("load", generateFields);

function attachToolsEvent(){
    const tools = document.querySelectorAll('tool');
    tools.forEach((tool) => {
        tool.addEventListener("click", () => {
            tools.forEach((selection) => selection.classList.remove('active'));
            tool.classList.add('active');
        })
    });
}

window.addEventListener("load", attachToolsEvent);

function LABOURER(field) {
    field.classList.remove('grass');
    field.classList.add('farmland');
}

function ARROSER(field) {
    if (field.classList.contains('farmland')) {
        field.classList.add('hydrated');
    }
}

function SEMER(field) {
    if (field.classList.contains('farmland')) {
        field.dataset.seed = 1;
    }
}

function MOISSONNER(field) {
    const wheatStock = document.getElementById('stock-wheat');
    const seedValue = Number(field.dataset.seed || 0);

    if (seedValue === 7 && wheatStock) {
        wheatStock.textContent = String(Number(wheatStock.textContent) + 1);
    }

    field.dataset.seed = 0;
}

function applyToolOnField(field) {
    const activeTool = document.querySelector('tool.active');
    if (!activeTool) return;

    if (activeTool.id === 'tool-hoe') {
        LABOURER(field);
    } else if (activeTool.id === 'tool-water') {
        ARROSER(field);
    } else if (activeTool.id === 'tool-sow') {
        SEMER(field);
    } else if (activeTool.id === 'tool-harvest') {
        MOISSONNER(field);
    }
}

function attachFieldsEvent() {
    const fields = document.querySelectorAll('field-part');

    fields.forEach((field) => {
        field.addEventListener('click', () => {
            applyToolOnField(field);
        });
    });
}



window.addEventListener("load", attachFieldsEvent);