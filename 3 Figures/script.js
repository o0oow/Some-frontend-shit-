// Получаем основные элементы из HTML
const shapeSelect = document.getElementById('shapeSelect');
const inputsDiv = document.getElementById('inputs');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ---------- ФУНКЦИИ ВСПОМОГАТЕЛЬНЫЕ ---------- //

// Создаёт один блок ввода (метка + поле input type="number")
function createInput(id, labelText, placeholder = '', step = "any") {
  const group = document.createElement('div');
  group.className = 'input-group';
  
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;
  
  const input = document.createElement('input');
  input.id = id;
  input.type = 'number';
  input.placeholder = placeholder;
  input.min = '0';
  input.step = step;
  
  group.appendChild(label);
  group.appendChild(input);
  return group;
}

// Очищает canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Округление числа до 3 знаков после запятой
function rnd(v) {
  return Math.round(v * 1000) / 1000;
}

// Рисует правильный многоугольник (n сторон) с указанной длиной стороны
function drawRegularPolygon(sides, sideLength) {
  // Радиус описанной окружности (R)
  // Формула: R = side / (2 * sin(π / sides))
  const R = sideLength / (2 * Math.sin(Math.PI / sides));
  
  // Масштаб, чтобы уместить фигуру в canvas
  const scale = Math.min(canvas.width, canvas.height) / (2 * R * 1.5);
  const rScaled = R * scale;
  
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    // Угол для i‑й вершины
    const theta = 2 * Math.PI * i / sides - Math.PI / 2; 
    const x = cx + rScaled * Math.cos(theta);
    const y = cy + rScaled * Math.sin(theta);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

// ---------- ФУНКЦИИ ДЛЯ РАБОТЫ С РАЗЛИЧНЫМИ ФИГУРАМИ ---------- //

// Генерирует поля ввода в зависимости от выбранной фигуры
function updateInputs() {
  inputsDiv.innerHTML = '';
  const shape = shapeSelect.value;
  
  switch (shape) {
    case 'square':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      break;
    case 'rectangle':
      inputsDiv.appendChild(createInput('width', 'Ширина'));
      inputsDiv.appendChild(createInput('height', 'Высота'));
      break;
    case 'circle':
      inputsDiv.appendChild(createInput('radius', 'Радиус'));
      break;
    case 'equilateralTriangle':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      break;
    case 'rightTriangle':
      inputsDiv.appendChild(createInput('a', 'Катет A'));
      inputsDiv.appendChild(createInput('b', 'Катет B'));
      break;
    case 'generalTriangle':
      inputsDiv.appendChild(createInput('a', 'Сторона a'));
      inputsDiv.appendChild(createInput('b', 'Сторона b'));
      inputsDiv.appendChild(createInput('c', 'Сторона c'));
      break;
    case 'rhombus':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      inputsDiv.appendChild(createInput('angle', 'Угол (°)'));
      break;
    case 'parallelogram':
      inputsDiv.appendChild(createInput('base', 'Основание'));
      inputsDiv.appendChild(createInput('side', 'Боковая сторона'));
      inputsDiv.appendChild(createInput('height', 'Высота'));
      break;
    case 'trapezoid':
      inputsDiv.appendChild(createInput('base1', 'Основание 1'));
      inputsDiv.appendChild(createInput('base2', 'Основание 2'));
      inputsDiv.appendChild(createInput('height', 'Высота'));
      break;
    case 'ellipse':
      inputsDiv.appendChild(createInput('a', 'Большая полуось'));
      inputsDiv.appendChild(createInput('b', 'Малая полуось'));
      break;
    case 'sector':
      inputsDiv.appendChild(createInput('radius', 'Радиус'));
      inputsDiv.appendChild(createInput('angle', 'Угол (°)'));
      break;
    case 'annulus':
      inputsDiv.appendChild(createInput('R', 'Внешний радиус'));
      inputsDiv.appendChild(createInput('r', 'Внутренний радиус'));
      break;
    case 'pentagon':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      break;
    case 'hexagon':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      break;
    case 'octagon':
      inputsDiv.appendChild(createInput('side', 'Сторона'));
      break;
    default:
      break;
  }
}

// Основная функция для расчёта и отрисовки
function calculateShape() {
  clearCanvas();
  
  const shape = shapeSelect.value;
  // Считываем возможные значения площади и периметра
  const areaInputVal = parseFloat(document.getElementById('areaInput').value);
  const perimeterInputVal = parseFloat(document.getElementById('perimeterInput').value);
  
  // Если areaGiven = null, значит пользователь не вводил площадь
  const areaGiven = isNaN(areaInputVal) ? null : areaInputVal;
  // Если perimeterGiven = null, значит пользователь не вводил периметр
  const perimeterGiven = isNaN(perimeterInputVal) ? null : perimeterInputVal;
  
  let computedArea = 0;
  let computedPerimeter = 0;
  let info = ''; // Строка, которую выведем в resultDiv
  
  // В зависимости от фигуры — разные формулы
  switch (shape) {
    case 'square': {
      let side = parseFloat(document.getElementById('side').value);
      // Если сторона не задана, пробуем найти её из площади или периметра
      if (isNaN(side)) {
        if (areaGiven !== null) {
          side = Math.sqrt(areaGiven);
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 4;
        } else {
          alert("Введите сторону или площадь/периметр для квадрата.");
          return;
        }
      }
      computedArea = side * side;
      computedPerimeter = 4 * side;
      info = `Сторона = ${rnd(side)}, Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}. Формулы: S=a², P=4a.`;
      
      // Отрисовка квадрата
      const scale = Math.min(canvas.width, canvas.height) / (side * 1.5);
      const s = side * scale;
      const x = (canvas.width - s) / 2;
      const y = (canvas.height - s) / 2;
      ctx.beginPath();
      ctx.rect(x, y, s, s);
      ctx.stroke();
      break;
    }
    
    case 'rectangle': {
      let width = parseFloat(document.getElementById('width').value);
      let height = parseFloat(document.getElementById('height').value);
      
      // Если width или height не заданы, пытаемся вывести их из площади/периметра
      if (isNaN(width) && !isNaN(height)) {
        if (areaGiven !== null) {
          width = areaGiven / height;
        } else if (perimeterGiven !== null) {
          width = perimeterGiven / 2 - height;
        } else {
          alert("Введите ширину или используйте обратный расчёт (площадь/периметр).");
          return;
        }
      }
      if (isNaN(height) && !isNaN(width)) {
        if (areaGiven !== null) {
          height = areaGiven / width;
        } else if (perimeterGiven !== null) {
          height = perimeterGiven / 2 - width;
        } else {
          alert("Введите высоту или используйте обратный расчёт (площадь/периметр).");
          return;
        }
      }
      
      if (isNaN(width) || isNaN(height)) {
        alert("Введите корректные значения ширины и высоты.");
        return;
      }
      
      computedArea = width * height;
      computedPerimeter = 2 * (width + height);
      info = `Ширина = ${rnd(width)}, Высота = ${rnd(height)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}. Формулы: S=a·b, P=2(a+b).`;
      
      // Отрисовка прямоугольника
      const scale = Math.min(
        canvas.width / (width * 1.5),
        canvas.height / (height * 1.5)
      );
      const w = width * scale;
      const h = height * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.stroke();
      break;
    }
    
    case 'circle': {
      let radius = parseFloat(document.getElementById('radius').value);
      
      if (isNaN(radius)) {
        if (areaGiven !== null) {
          radius = Math.sqrt(areaGiven / Math.PI);
        } else if (perimeterGiven !== null) {
          radius = perimeterGiven / (2 * Math.PI);
        } else {
          alert("Введите радиус или площадь/периметр для круга.");
          return;
        }
      }
      
      computedArea = Math.PI * radius * radius;
      computedPerimeter = 2 * Math.PI * radius;
      info = `Радиус = ${rnd(radius)}, Площадь = ${rnd(computedArea)}, Периметр (окружность) = ${rnd(computedPerimeter)}. Формулы: S=πr², P=2πr.`;
      
      // Отрисовка круга
      const scale = Math.min(canvas.width, canvas.height) / (radius * 2 * 1.5);
      const r = radius * scale;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }
    
    case 'equilateralTriangle': {
      let side = parseFloat(document.getElementById('side').value);
      
      if (isNaN(side)) {
        if (areaGiven !== null) {
          side = Math.sqrt((4 * areaGiven) / Math.sqrt(3));
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 3;
        } else {
          alert("Введите сторону или площадь/периметр для равностороннего треугольника.");
          return;
        }
      }
      
      computedArea = (Math.sqrt(3) / 4) * side * side;
      computedPerimeter = 3 * side;
      info = `Сторона = ${rnd(side)}, Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}. Формулы: S=(√3/4)a², P=3a.`;
      
      // Отрисовка равностороннего треугольника
      const scale = Math.min(canvas.width, canvas.height) / (side * 1.5);
      const s = side * scale;
      const x0 = canvas.width / 2;
      const y0 = (canvas.height - s * Math.sqrt(3) / 2) / 2;
      
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 - s / 2, y0 + s * Math.sqrt(3) / 2);
      ctx.lineTo(x0 + s / 2, y0 + s * Math.sqrt(3) / 2);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'rightTriangle': {
      let a = parseFloat(document.getElementById('a').value);
      let b = parseFloat(document.getElementById('b').value);
      
      // Если один катет неизвестен, можно вывести из площади (если площадь дана)
      if (isNaN(a) && !isNaN(b)) {
        if (areaGiven !== null) {
          a = (2 * areaGiven) / b;
        } else {
          alert("Введите катет A или используйте площадь для обратного расчёта.");
          return;
        }
      }
      if (isNaN(b) && !isNaN(a)) {
        if (areaGiven !== null) {
          b = (2 * areaGiven) / a;
        } else {
          alert("Введите катет B или используйте площадь для обратного расчёта.");
          return;
        }
      }
      if (isNaN(a) || isNaN(b)) {
        alert("Введите хотя бы катеты треугольника.");
        return;
      }
      
      const c = Math.sqrt(a * a + b * b);
      computedArea = (a * b) / 2;
      computedPerimeter = a + b + c;
      info = `Катеты: a=${rnd(a)}, b=${rnd(b)}, Гипотенуза=${rnd(c)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      // Отрисовка прямоугольного треугольника
      const scale = Math.min(canvas.width, canvas.height) / (Math.max(a, b) * 1.5);
      const A = { x: 50, y: canvas.height - 50 };
      const B = { x: A.x, y: A.y - a * scale };
      const C = { x: A.x + b * scale, y: A.y };
      
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'generalTriangle': {
      let a = parseFloat(document.getElementById('a').value);
      let b = parseFloat(document.getElementById('b').value);
      let c = parseFloat(document.getElementById('c').value);
      
      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        alert("Введите все три стороны треугольника.");
        return;
      }
      
      const s = (a + b + c) / 2; // полупериметр
      computedArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      computedPerimeter = a + b + c;
      info = `Стороны: a=${rnd(a)}, b=${rnd(b)}, c=${rnd(c)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}. Формула площади: Герона.`;
      
      // Приблизительная отрисовка по известным сторонам (через теорему косинусов)
      const scale = Math.min(canvas.width, canvas.height) / (Math.max(a, b, c) * 1.5);
      const A = { x: 50, y: canvas.height - 50 };
      const B = { x: A.x + b * scale, y: A.y };
      // Угол между a и b (c - напротив угла)
      const cosC = (a * a + b * b - c * c) / (2 * a * b);
      const angle = Math.acos(cosC);
      const C = {
        x: A.x + a * scale * Math.cos(angle),
        y: A.y - a * scale * Math.sin(angle),
      };
      
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'rhombus': {
      let side = parseFloat(document.getElementById('side').value);
      let angleDeg = parseFloat(document.getElementById('angle').value);
      
      if (isNaN(side)) {
        // Если задана площадь + угол, можно найти сторону
        if (areaGiven !== null && !isNaN(angleDeg)) {
          side = Math.sqrt(areaGiven / Math.sin(angleDeg * Math.PI / 180));
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 4;
        } else {
          alert("Введите сторону ромба или (площадь и угол) или (периметр).");
          return;
        }
      }
      if (isNaN(angleDeg)) {
        alert("Введите угол ромба в градусах.");
        return;
      }
      
      const angleRad = angleDeg * Math.PI / 180;
      computedArea = side * side * Math.sin(angleRad);
      computedPerimeter = 4 * side;
      info = `Сторона = ${rnd(side)}, Угол = ${rnd(angleDeg)}°. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}. Формула: S=a²·sin(угол).`;
      
      // Отрисовка ромба (приблизительно)
      const scale = Math.min(canvas.width, canvas.height) / (side * 1.5);
      const s = side * scale;
      const dx = s * Math.cos(angleRad);
      const dy = s * Math.sin(angleRad);
      const startX = (canvas.width - s - dx) / 2;
      const startY = (canvas.height - s) / 2;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + dx, startY + dy);
      ctx.lineTo(startX + dx + s, startY + dy);
      ctx.lineTo(startX + s, startY);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'parallelogram': {
      let base = parseFloat(document.getElementById('base').value);
      let side = parseFloat(document.getElementById('side').value);
      let height = parseFloat(document.getElementById('height').value);
      
      if (isNaN(base) || isNaN(side)) {
        alert("Введите основание и боковую сторону параллелограмма.");
        return;
      }
      if (isNaN(height)) {
        if (areaGiven !== null) {
          height = areaGiven / base;
        } else {
          alert("Введите высоту или площадь для параллелограмма.");
          return;
        }
      }
      
      computedArea = base * height;
      computedPerimeter = 2 * (base + side);
      info = `Основание = ${rnd(base)}, Боковая сторона = ${rnd(side)}, Высота = ${rnd(height)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      // Отрисовка параллелограмма (условно под углом 45°)
      const scale = Math.min(canvas.width, canvas.height) / (base * 1.5);
      const bScaled = base * scale;
      const hScaled = height * scale;
      const offset = hScaled / Math.tan(Math.PI / 4); // угол 45° (пример)
      const x0 = (canvas.width - bScaled - offset) / 2;
      const y0 = (canvas.height + hScaled) / 2;
      
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + offset, y0 - hScaled);
      ctx.lineTo(x0 + offset + bScaled, y0 - hScaled);
      ctx.lineTo(x0 + bScaled, y0);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'trapezoid': {
      let base1 = parseFloat(document.getElementById('base1').value);
      let base2 = parseFloat(document.getElementById('base2').value);
      let height = parseFloat(document.getElementById('height').value);
      
      if (isNaN(base1) || isNaN(base2)) {
        alert("Введите оба основания трапеции.");
        return;
      }
      if (isNaN(height)) {
        if (areaGiven !== null) {
          // S = (base1 + base2)/2 * height => height = (2S)/(base1+base2)
          height = (2 * areaGiven) / (base1 + base2);
        } else {
          alert("Введите высоту или площадь для трапеции.");
          return;
        }
      }
      
      computedArea = ((base1 + base2) / 2) * height;
      const leg = Math.sqrt(height * height + Math.pow((base2 - base1) / 2, 2));
      computedPerimeter = base1 + base2 + 2 * leg;
      info = `Основания: ${rnd(base1)} и ${rnd(base2)}, Высота = ${rnd(height)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      // Отрисовка трапеции
      const scale = Math.min(canvas.width, canvas.height) / (Math.max(base1, base2) * 1.5);
      const b1 = base1 * scale;
      const b2 = base2 * scale;
      const h = height * scale;
      const offset = (b2 - b1) / 2;
      const x = (canvas.width - b2) / 2;
      const y = (canvas.height - h) / 2;
      
      ctx.beginPath();
      ctx.moveTo(x + offset, y);
      ctx.lineTo(x + offset + b1, y);
      ctx.lineTo(x + b2, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'ellipse': {
      let a = parseFloat(document.getElementById('a').value);
      let b = parseFloat(document.getElementById('b').value);
      
      // Если одна из полуосей неизвестна, пробуем вывести из площади
      if (isNaN(a) && !isNaN(b)) {
        if (areaGiven !== null) {
          a = areaGiven / (Math.PI * b);
        } else {
          alert("Введите большую полуось или используйте площадь для эллипса.");
          return;
        }
      }
      if (isNaN(b) && !isNaN(a)) {
        if (areaGiven !== null) {
          b = areaGiven / (Math.PI * a);
        } else {
          alert("Введите малую полуось или используйте площадь для эллипса.");
          return;
        }
      }
      if (isNaN(a) || isNaN(b)) {
        alert("Введите обе полуоси эллипса (a и b).");
        return;
      }
      
      computedArea = Math.PI * a * b;
      // Периметр эллипса (аппроксимация Рамануяна)
      computedPerimeter = Math.PI * (3*(a + b) - Math.sqrt((3*a + b)*(a + 3*b)));
      info = `Большая полуось a=${rnd(a)}, Малая полуось b=${rnd(b)}. Площадь = πab=${rnd(computedArea)}, Периметр ≈ ${rnd(computedPerimeter)}.`;
      
      // Отрисовка эллипса
      const scale = Math.min(
        canvas.width / (2 * a),
        canvas.height / (2 * b)
      ) * 0.8;
      
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        a * scale,
        b * scale,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      break;
    }
    
    case 'sector': {
      let radius = parseFloat(document.getElementById('radius').value);
      let angleDeg = parseFloat(document.getElementById('angle').value);
      
      if (isNaN(radius)) {
        if (areaGiven !== null && !isNaN(angleDeg)) {
          // S = (πr² * angleDeg)/360 => r = sqrt( (S*360)/(π*angleDeg) )
          radius = Math.sqrt((areaGiven * 360) / (Math.PI * angleDeg));
        } else {
          alert("Введите радиус сектора или (площадь и угол).");
          return;
        }
      }
      if (isNaN(angleDeg)) {
        alert("Введите угол сектора (в градусах).");
        return;
      }
      
      computedArea = (Math.PI * radius * radius * angleDeg) / 360;
      computedPerimeter = radius * (angleDeg * Math.PI / 180) + 2 * radius;
      info = `Радиус = ${rnd(radius)}, Угол = ${rnd(angleDeg)}°. Площадь = ${rnd(computedArea)}, Длина дуги + 2r = ${rnd(computedPerimeter)}.`;
      
      // Отрисовка сектора
      const scale = Math.min(canvas.width, canvas.height) / (radius * 2 * 1.5);
      const r = radius * scale;
      const startAngle = 0;
      const endAngle = (angleDeg * Math.PI) / 180;
      
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, r, startAngle, endAngle);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    
    case 'annulus': {
      let R = parseFloat(document.getElementById('R').value);
      let r = parseFloat(document.getElementById('r').value);
      
      // Если R или r не заданы, пытаемся вывести из площади или периметра
      // Площадь кольца: π(R² - r²)
      // Периметр кольца: 2π(R + r)
      if (isNaN(R) && !isNaN(r)) {
        if (areaGiven !== null) {
          R = Math.sqrt(areaGiven / Math.PI + r * r);
        } else if (perimeterGiven !== null) {
          // perimeter = 2π(R + r) => R = perimeter/(2π) - r
          R = perimeterGiven / (2 * Math.PI) - r;
        } else {
          alert("Введите внешний радиус (R) или (площадь/периметр и внутренний радиус).");
          return;
        }
      }
      if (isNaN(r) && !isNaN(R)) {
        if (areaGiven !== null) {
          r = Math.sqrt(R * R - areaGiven / Math.PI);
        } else if (perimeterGiven !== null) {
          r = perimeterGiven / (2 * Math.PI) - R;
        } else {
          alert("Введите внутренний радиус (r) или (площадь/периметр и внешний радиус).");
          return;
        }
      }
      if (isNaN(R) || isNaN(r)) {
        alert("Введите оба радиуса кольца (R и r).");
        return;
      }
      
      computedArea = Math.PI * (R * R - r * r);
      computedPerimeter = 2 * Math.PI * (R + r);
      info = `Внешний радиус R=${rnd(R)}, Внутренний радиус r=${rnd(r)}. Площадь = ${rnd(computedArea)}, Периметр(2 окружности) = ${rnd(computedPerimeter)}.`;
      
      // Отрисовка кольца
      const scale = Math.min(canvas.width / (2 * R), canvas.height / (2 * R)) * 0.8;
      
      ctx.beginPath();
      // Внешняя окружность
      ctx.arc(canvas.width / 2, canvas.height / 2, R * scale, 0, 2 * Math.PI);
      // Внутренняя окружность
      ctx.moveTo(canvas.width / 2 + r * scale, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, r * scale, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    }
    
    case 'pentagon': {
      let side = parseFloat(document.getElementById('side').value);
      if (isNaN(side)) {
        if (areaGiven !== null) {
          // Формула площади правильного пятиугольника: S = (sqrt(5(5+2√5))/4) * a²
          // => a = sqrt( (4*S) / sqrt(5(5+2√5)) )
          let k = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));
          side = Math.sqrt((4 * areaGiven) / k);
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 5;
        } else {
          alert("Введите сторону или площадь/периметр для правильного пятиугольника.");
          return;
        }
      }
      computedArea = (Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) / 4) * side * side;
      computedPerimeter = 5 * side;
      info = `Сторона = ${rnd(side)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      drawRegularPolygon(5, side);
      break;
    }
    
    case 'hexagon': {
      let side = parseFloat(document.getElementById('side').value);
      if (isNaN(side)) {
        if (areaGiven !== null) {
          // Площадь правильного шестиугольника: S = (3√3/2) a² => a = sqrt((2S)/(3√3))
          side = Math.sqrt((2 * areaGiven) / (3 * Math.sqrt(3)));
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 6;
        } else {
          alert("Введите сторону или площадь/периметр для правильного шестиугольника.");
          return;
        }
      }
      computedArea = (3 * Math.sqrt(3) / 2) * side * side;
      computedPerimeter = 6 * side;
      info = `Сторона = ${rnd(side)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      drawRegularPolygon(6, side);
      break;
    }
    
    case 'octagon': {
      let side = parseFloat(document.getElementById('side').value);
      if (isNaN(side)) {
        if (areaGiven !== null) {
          // Площадь правильного восьмиугольника: S = 2(1+√2)a²
          // => a = sqrt( S / [2(1+√2)] )
          side = Math.sqrt(areaGiven / (2 * (1 + Math.SQRT2)));
        } else if (perimeterGiven !== null) {
          side = perimeterGiven / 8;
        } else {
          alert("Введите сторону или площадь/периметр для правильного восьмиугольника.");
          return;
        }
      }
      computedArea = 2 * (1 + Math.SQRT2) * side * side;
      computedPerimeter = 8 * side;
      info = `Сторона = ${rnd(side)}. Площадь = ${rnd(computedArea)}, Периметр = ${rnd(computedPerimeter)}.`;
      
      drawRegularPolygon(8, side);
      break;
    }
    
    default:
      alert("Неизвестная фигура. Проверьте выбор.");
      return;
  }
  
  // Вывод итоговой информации
  resultDiv.innerHTML = `<p>${info}</p>`;
}

// ---------- СВЯЗЫВАЕМ СОБЫТИЯ ---------- //

// При смене фигуры пересоздаём поля ввода
shapeSelect.addEventListener('change', updateInputs);
// Инициализация при загрузке
updateInputs();

// При клике на "Рассчитать" запускаем расчёт
calculateBtn.addEventListener('click', calculateShape);
