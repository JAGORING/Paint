const canvas = document.getElementById('paint');
let ctx = canvas.getContext('2d');

const lineWidthRange = document.querySelector('#line-weight');
const colorBtns = document.querySelectorAll('.select-btn');
const toolBtn = document.querySelector('.tool-btn');
const paintPen = document.querySelector('.paint-pen');

const INITIAL_COLOR = "black";

// 캔버스 초기 배경 크기 및 바탕색
canvas.width = 500;
canvas.height = 550;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 500, 550);
// 선 기본값 설정
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 1;
ctx.lineCap = 'round';

const pos = {
	painting: false,
	pen: true,
	x: 0,
	y: 0
}
let lastPoint;
let crayonColor;

function penDrawingStop() {
	pos.painting = false;
	ctx.globalAlpha = 1.0;
}

// 'pen' 선택 시 실행되는 함수
function normalPenDrawing(e) {
	if(!pos.pen) {
		return
	}
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

// 'crayon' 선택 시 실행되는 함수
function crayonPenDrawing(e){
	if(pos.pen) {
		return
	}
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
				ctx.stroke();
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
function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y);
}

// 그림 파일 이미지 저장 함수
function saveImage() {
	const image = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = image;
	link.download = "Paint"
	link.click()
}

paintPen.addEventListener('click', (e) => {
	if(e.target.classList.contains('pen')) {
		pos.pen = true;
		canvas.addEventListener('mousedown', normalPenDrawing);
		canvas.addEventListener('mousemove', normalPenDrawing);
	}
	if(e.target.classList.contains('crayon')) {
		pos.pen = false;
		canvas.addEventListener('mousedown', crayonPenDrawing);
		canvas.addEventListener('mousemove', crayonPenDrawing);
	}
	canvas.addEventListener('mouseup', penDrawingStop);
	canvas.addEventListener('mouseout',penDrawingStop);
});

lineWidthRange.addEventListener('change', () => {
	ctx.lineWidth = lineWidthRange.value;
});

colorBtns.forEach(btn => {
	if(btn.classList.contains('select')){
		btn.addEventListener('change', () => {
			ctx.strokeStyle = btn.value;
			ctx.fillStyle = btn.value;
			crayonColor = btn.value;
		})
	}
	btn.addEventListener('click', () => {
		ctx.strokeStyle = btn.name;
		ctx.fillStyle = btn.name;
		crayonColor = btn.name;
	})
});

toolBtn.addEventListener('click', (e)=> {
	if(e.target.innerText == 'FILL') {
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	if(e.target.innerText == 'ALL REMOVE') {
		if(!crayonColor) {
			crayonColor = 'black';
		}
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = crayonColor;
	}
	if(e.target.innerText == 'SAVE') {
		saveImage();
	}
});


