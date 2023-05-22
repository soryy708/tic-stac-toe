const elementId = 'message-bar';

let timeout: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

export function showMessageBar(text: string): void {
    assertElement();
    setContent(text);
    setTimeout(() => {
        showElement();
        scheduleHiding();
    }, 1);
}

function assertElement(): void {
    const exists = getElement();
    if (!exists) {
        const node = document.createElement('div');
        node.id = elementId;
        node.style.position = 'fixed';
        node.style.left = '0';
        node.style.bottom = '0';
        node.style.width = '100%';
        node.style.padding = '0.5em';
        node.style.textAlign = 'center';
        node.style.opacity = '0';
        node.style.transition = 'opacity 0.3s';
        node.style.color = '#fff';
        node.style.fontFamily = 'sans-serif';
        node.style.fontSize = '2em';
        node.style.backgroundColor = '#202020';
        node.style.boxShadow = '0 -1px 8px #000';
        document.body.append(node);
    }
}

function getElement(): HTMLDivElement {
    return document.getElementById(elementId) as HTMLDivElement;
}

function setContent(text: string): void {
    getElement().innerText = text;
}

function showElement(): void {
    getElement().style.opacity = '1';
}

function scheduleHiding(): void {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    timeout = setTimeout(() => {
        hideElement();
    }, 5000);
}

function hideElement(): void {
    getElement().style.opacity = '0';
}
