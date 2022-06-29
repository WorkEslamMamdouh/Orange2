
var decreaseButton = document.querySelector('[data-id="decrease"]');
var increaseButton = document.querySelector('[data-id="increase"]');
if (decreaseButton != null) {
    decreaseButton.addEventListener("click", () => {
        var value = parseInt(document.querySelector('[data-id="number"]').value, 10);
        value = isNaN(value) ? 0 : value;
        value < 1 ? value = 1 : '';
        value--;
        document.querySelector('[data-id="number"]').value = value;
    });
}

if (increaseButton != null) {
    increaseButton.addEventListener("click", () => {
        var value = parseInt(document.querySelector('[data-id="number"]').value, 10);
        value = isNaN(value) ? 0 : value;
        value++;
        document.querySelector('[data-id="number"]').value = value;
    });
}
