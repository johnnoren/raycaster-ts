export function drawBox() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const context = canvas.getContext('2d');
    
    const box = document.getElementById('box') as HTMLDivElement;
    box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
    box.appendChild(canvas);
    
    context!.fillStyle = 'black';
    context!.fillRect(0, 0, canvas.width, canvas.height);
  }
  