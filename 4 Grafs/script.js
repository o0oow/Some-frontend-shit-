// Плагин для рисования толстых осей через (0,0)
const crosshairAxesPlugin = {
    id: 'crosshairAxes',
    afterDraw(chart, args, options) {
      const { ctx, chartArea, scales } = chart;
      const { left, right, top, bottom } = chartArea;
      const xScale = scales.x;
      const yScale = scales.y;
  
      // Координаты (0,0) в пикселях
      const xZero = xScale.getPixelForValue(0);
      const yZero = yScale.getPixelForValue(0);
  
      ctx.save();
      ctx.strokeStyle = options.color || 'black';
      ctx.lineWidth = options.lineWidth || 2;
  
      // Рисуем горизонтальную ось через y=0, если она в видимой области
      if (yZero >= top && yZero <= bottom) {
        ctx.beginPath();
        ctx.moveTo(left, yZero);
        ctx.lineTo(right, yZero);
        ctx.stroke();
      }
  
      // Рисуем вертикальную ось через x=0, если она в видимой области
      if (xZero >= left && xZero <= right) {
        ctx.beginPath();
        ctx.moveTo(xZero, top);
        ctx.lineTo(xZero, bottom);
        ctx.stroke();
      }
  
      ctx.restore();
    }
  };
  
  // Регистрируем плагин
  Chart.register(crosshairAxesPlugin);
  
  // Функция для динамического определения шага сетки (чтобы при больших диапазонах не было слишком густо)
  function getStepSize(min, max) {
    const range = max - min;
    // Простейшая логика: чем больше диапазон, тем крупнее шаг
    if (range <= 10)  return 1;
    if (range <= 20)  return 2;
    if (range <= 50)  return 5;
    if (range <= 100) return 10;
    return Math.round(range / 10); 
    // Можно придумать любую другую формулу, которая вам подходит
  }
  
  document.getElementById("generateChart").addEventListener("click", function() {
    // Считываем параметры
    const chartType = document.getElementById("chartType").value;
    const funcType  = document.getElementById("functionSelect").value;
    const xMin      = parseFloat(document.getElementById("xMin").value);
    const xMax      = parseFloat(document.getElementById("xMax").value);
    const yMin      = parseFloat(document.getElementById("yMin").value);
    const yMax      = parseFloat(document.getElementById("yMax").value);
    const displayGrid = document.getElementById("grid").checked;
  
    // Генерация массива точек
    const dataCount = 100; 
    const step = (xMax - xMin) / (dataCount - 1);
  
    const labels = [];
    const dataPoints = [];
  
    for (let i = 0; i < dataCount; i++) {
      const xVal = xMin + i * step;
      let yVal;
      if (funcType === "sin") {
        yVal = Math.sin(xVal);
      } else if (funcType === "cos") {
        yVal = Math.cos(xVal);
      } else {
        // Случайные данные
        yVal = Math.random() * (yMax - yMin) + yMin;
      }
      labels.push(xVal.toFixed(2));
      dataPoints.push(yVal);
    }
  
    // Уничтожаем предыдущий график, если он есть
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
      
    }
  
    const ctx = document.getElementById("myChart").getContext("2d");
  
    // Подготавливаем данные для Chart.js
    let chartData;
    if (chartType === "scatter") {
      // Для scatter нужен массив объектов {x, y}
      const scatterData = [];
      for (let i = 0; i < dataCount; i++) {
        scatterData.push({
          x: parseFloat(labels[i]), 
          y: dataPoints[i]
        });
      }
      chartData = {
        datasets: [{
          label: 'График',
          data: scatterData,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          showLine: true // рисовать линию между точками
        }]
      };
    } else {
      // Для line/bar — массив labels + массив data
      chartData = {
        labels: labels,
        datasets: [{
          label: 'График',
          data: dataPoints,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor:
            chartType === "line"
              ? 'rgba(75,192,192,0.2)'
              : 'rgba(75,192,192,0.5)',
          fill: chartType === "line"
        }]
      };
    }
  
    // Рассчитываем шаги для сетки
    const xStep = getStepSize(xMin, xMax);
    const yStep = getStepSize(yMin, yMax);
  
    // Создаём диаграмму
    window.myChart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        // Убираем aspectRatio, чтобы canvas занимал всё пространство контейнера (600x600)
        aspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: xMin,
            max: xMax,
            grid: {
              display: displayGrid,
              drawBorder: false // убираем рамку оси
            },
            ticks: {
              stepSize: xStep,
              autoSkip: false // чтобы не пропускались подписи
            }
          },
          y: {
            type: 'linear',
            min: yMin,
            max: yMax,
            grid: {
              display: displayGrid,
              drawBorder: false
            },
            ticks: {
              stepSize: yStep,
              autoSkip: false
            }
          }
        },
        plugins: {
          crosshairAxes: {
            lineWidth: 2,
            color: '#000000'
          }
        }
      }
    });
  });
  