const canvas = document.getElementById('paint');
let ctx = canvas.getContext('2d');

const lineWidthRange = document.querySelector('#line-weight');
const colorBtns = document.querySelectorAll('.select-btn');
const toolBtn = document.querySelector('.tool-btn');
const paintPen = document.querySelector('.paint-pen');

const INITIAL_COLOR = "black";
canvas.width = 500;
canvas.height = 550;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 500, 550);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 1;
ctx.lineCap = 'round';

const pos = {
	painting: false,
	x: 0,
	y: 0
}

canvas.addEventListener('mouseup', penDrawingStop);
canvas.addEventListener('mouseout',penDrawingStop);

function penDrawingStop() {
	pos.painting = false;
	ctx.globalAlpha = 1.0;
}

function normalPenDrawing(e) {
	switch (e.type) {
		case 'mousemove':
			pos.x = e.offsetX;
			pos.y = e.offsetY;
			if(!pos.painting){
				return
			}
			ctx.lineTo(pos.x, pos.y);
			ctx.stroke();
			break;
		case 'mousedown':
			pos.painting = true;
			ctx.beginPath();
			ctx.moveTo(pos.x, pos.y);		
			ctx.closePath();
			break;
		default:
			break;
	}
}

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y);
}

let lastPoint;
function crayonPenDrawing(e){
	ctx.globalAlpha = 0.03;
	ctx.globalCompositeOperation = 'source-over';
	switch (e.type) {
		case 'mousemove':
			if(!pos.painting){
				return;
			}
			let currentPoint = { x: e.offsetX, y: e.offsetY };
			let dist = distanceBetween(lastPoint, currentPoint);
			let angle = angleBetween(lastPoint, currentPoint);
			
			for (let i = 0; i < dist; i+=3) {
				x = lastPoint.x + (Math.sin(angle) * i) - 25;
				y = lastPoint.y + (Math.cos(angle) * i) - 25;
				ctx.beginPath();
				ctx.arc(x+15, y+15, 15, false, Math.PI * 2, false);
				ctx.closePath();
				ctx.fill();
			}
			lastPoint = currentPoint;
			break;
		case 'mousedown':
			pos.painting = true;
			lastPoint = { x: e.offsetX, y: e.offsetY };
			break;
		default:
			break;
	}
}

paintPen.addEventListener('click', (e) => {
	if(e.target.classList.contains('pen')) {
		canvas.addEventListener('mousedown', normalPenDrawing);
		canvas.addEventListener('mousemove', normalPenDrawing);
	}
	if(e.target.classList.contains('crayon')) {
		canvas.addEventListener('mousedown', crayonPenDrawing);
		canvas.addEventListener('mousemove', crayonPenDrawing);
	}
});

lineWidthRange.addEventListener('change', () => {
	ctx.lineWidth = lineWidthRange.value;
});

colorBtns.forEach(btn => {
	if(btn.classList.contains('select')){
		btn.addEventListener('change', () => {
			ctx.strokeStyle = btn.value;
			ctx.fillStyle = btn.value;
		})
	}
	btn.addEventListener('click', () => {
		ctx.strokeStyle = btn.name;
		ctx.fillStyle = btn.name;
	})
});

	toolBtn.addEventListener('click', (e)=> {
		if(e.target.innerText == 'FILL') {
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		if(e.target.innerText == 'ALL REMOVE') {
			ctx.fillStyle = "white";
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		if(e.target.innerText == 'SAVE') {
			saveImage();
		}
	});

function saveImage() {
	const image = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = image;
	link.download = "Paint"
	link.click()
}
