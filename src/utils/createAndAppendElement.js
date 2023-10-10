// Function to create and append a DOM element
export const createAndAppendElement = (type, attributes, parent) => {
    const element = document.createElement(type);
    Object.keys(attributes).forEach((key) => {
        element[key] = attributes[key];
    });
    parent.appendChild(element);
    return element;
};