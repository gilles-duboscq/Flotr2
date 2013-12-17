/** Stats 
 * assumes [x, yAverage, yMax, yMin, yStdDev, n]
 * Where n is the number of samples
 **/
Flotr.addType('stats', {
  options: {
    show: false,           // => setting to true will show stats, false will hide
    lineWidth: 1,          // => line width in pixels
    moustacheWidth: 8,
    moustache: 'stderr',
  },

  draw : function (options) {
    var
      context     = options.context,
      lineWidth   = options.lineWidth,
      shadowSize  = options.shadowSize;

    context.save();

    if (shadowSize > 0) {
      context.lineWidth = shadowSize / 2;
      
      context.strokeStyle = 'rgba(0,0,0,0.1)';
      this.plot(options, shadowSize / 2 + context.lineWidth / 2);

      context.strokeStyle = 'rgba(0,0,0,0.2)';
      this.plot(options, context.lineWidth / 2);
    }

    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.color;
    if (options.fill) context.fillStyle = options.fillStyle;

    this.plot(options);
    context.restore();
  },

  plot : function (options, offset) {
    var
      data    = options.data,
      context = options.context,
      xScale  = options.xScale,
      yScale  = options.yScale,
      moustacheWidth = options.moustacheWidth,
      moustache = options.moustache,
      i, x, yAverage, yMax, yMin, yStdDev, yMoustachePos, yMoustacheNeg;
      
    try {
      for (i = data.length - 1; i > -1; --i) {
        yAverage = data[i][1];
        yMax = data[i][2];
        yMin = data[i][3];
        yStdDev = data[i][4];
        n = data[i][5];
        if (yMax === null || yMin === null || yStdDev === null) continue;

        x = xScale(data[i][0]);
        yMax = yScale(yMax);
        yMin = yScale(yMin);
        if (moustache == 'stddev') {
          yMoustachePos = yScale(yAverage + yStdDev);
          yMoustacheNeg = yScale(yAverage - yStdDev);
        } else if (moustache == 'stderr') {
          var yStdErr = yStdDev / Math.sqrt(n);
          yMoustachePos = yScale(yAverage + yStdErr);
          yMoustacheNeg = yScale(yAverage - yStdErr);
        }
        yAverage = yScale(yAverage);


        if (x < 0 || x > options.width || yStdDev === 0) continue;
        
        if (yMin >= 0 && yMax < options.height){
          context.beginPath();
          if (offset) {
            context.moveTo(x, yMax + offset);
            context.lineTo(x, yMin + offset);
          } else {
            context.moveTo(x, yMax);
            context.lineTo(x, yMin);
          }
          context.stroke();
          context.closePath();
        }

        if (yMoustachePos >= 0 && yMoustachePos < options.height) {
          context.beginPath();
          if (offset) {
            context.moveTo(x - (moustacheWidth / 2), yMoustachePos + offset);
            context.lineTo(x + (moustacheWidth / 2), yMoustachePos + offset);
          } else {
            context.moveTo(x - (moustacheWidth / 2), yMoustachePos);
            context.lineTo(x + (moustacheWidth / 2), yMoustachePos);
          }
          context.stroke();
          context.closePath();
        }

        if (yMoustacheNeg >= 0 && yMoustacheNeg < options.height) {
          context.beginPath();
          if (offset) {
            context.moveTo(x - (moustacheWidth / 2), yMoustacheNeg + offset);
            context.lineTo(x + (moustacheWidth / 2), yMoustacheNeg + offset);
          } else {
            context.moveTo(x - (moustacheWidth / 2), yMoustacheNeg);
            context.lineTo(x + (moustacheWidth / 2), yMoustacheNeg);
          }
          context.stroke();
          context.closePath();
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
});
