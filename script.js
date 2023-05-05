const canvas = document.querySelector('canvas');
toolBtns = document.querySelectorAll('.tool')
fillColor = document.querySelector('#fill_color');
sizeSlider = document.querySelector('#size_slider');
colorBtns = document.querySelectorAll('.colors .option');
colorPicker = document.querySelector('#color_picker');
clearCanvas = document.querySelector('.clear_canvas');
saveImg = document.querySelector('.save_img');
ctx = canvas.getContext('2d');

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = 'brush',
brushWidth = 5,
selectedColor = '#000';

const setCanvasBackground = function() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = function(e) {
    if(!fillColor.checked) {
        //creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);    
}

const drawCircle = function(e) {
    ctx.beginPath(); //creating new path to draw circle
    //getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2 ) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = function(e) {
    ctx.beginPath(); //creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
    ctx.closePath(); //closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawLine = function(e) {
    ctx.beginPath(); //creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.stroke();
}

const startDraw = function(e) {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor; //passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; //passing selectedColor as fill style
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = function(e) {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0,0);

    if(selectedTool === 'brush' || selectedTool === 'eraser') {
        //if selected tool is eraser, then set strokeStyle to white
        //to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating the line according to the mouse pointer
        ctx.stroke(); //drawing line with color
    } else if(selectedTool === 'rectangle') {
        drawRect(e);
    } else if(selectedTool === 'circle') {
        drawCircle(e);
    } else if(selectedTool === 'triangle') {
        drawTriangle(e);
    } else {
        drawLine(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool);
    })
});

sizeSlider.addEventListener('change', () => {
    brushWidth = sizeSlider.value;
});

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    })
});

colorPicker.addEventListener('change', () => {
    //passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setCanvasBackground();
})

saveImg.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); //passing canvasData as link href value
    link.click(); //clicking link to download image
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => {isDrawing = false});
