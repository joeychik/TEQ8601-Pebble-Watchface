var rocky = require('rocky');

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, color) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  //YDDY - YMMY - (24H time)2 - s3
  var d = new Date();
  var year = d.toLocaleDateString(undefined, {year: 'numeric'});
  var month = d.toLocaleDateString(undefined, {month: '2-digit'});
  var day = d.toLocaleDateString(undefined, {day: '2-digit'});
  var hour = d.toLocaleTimeString(undefined, {hour: 'numeric'});
  var minute = d.toLocaleTimeString(undefined, {minute: 'numeric'});
  var second = d.toLocaleTimeString(undefined, {second: 'numeric'});
  //text splitting
  var yearSplit = year.toString().split("");
  
  var yearDay = yearSplit[0].concat(day, yearSplit[1]);
  var yearMonth = yearSplit[2].concat(month, yearSplit[3]);
  var hourMinuteString = hour.toString().concat(minute.toString());
  var hourMinute = Math.pow(Number(hourMinuteString), 2).toString();
  var secondCubed = Math.pow(Number(second), 3).toString();
  
  // Set the text color
  ctx.fillStyle = 'white';
  // Center align the text
  ctx.textAlign = 'center';

  //Display the standard at top of screen
  ctx.fillText('TEQ8601 CERTIFIED', w / 2, 0, w);
  
  // Draw a filled circle
  ctx.fillStyle = 'grey';
  ctx.rockyFillRadial( w / 2, h - 130, 0, 18, 0, 2 * Math.PI);
  
  // Calculate the minute hand angle
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);
  
  // Draw the minute hand
  drawHand(ctx, w / 2, h - 130, minuteAngle, 14, 'black');
  
  // Calculate the second hand angle
  var secondFraction = (d.getSeconds()) / 60;
  var secondAngle = fractionToRadian(secondFraction);
  
  // Draw the second hand
  drawHand(ctx, w / 2, h - 130, secondAngle, 16, 'white');
  
  // Calculate the hour hand angle
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);
  
  // Draw the hour hand
  drawHand(ctx, w / 2, h - 130, hourAngle, 11, 'black');
  
  // Set the font
  ctx.font = '20px bold Leco-numbers';
  
  // Display the time, in the middle of the screen
  ctx.fillText(yearDay.concat('-', yearMonth, '\n', hourMinute, '\n', secondCubed), w / 2, h / 3, w * 0.75); 
  
  // Set the font
  ctx.font = '14px bold Gothic';
  
  // Display guide to time format
  ctx.fillText('YDDY - YMMY\n24HR^2 - S^3', w / 2, h / 2 + 45, w/1.2);
});
  
rocky.on('secondchange', function(event) {
  // Display a message in the system logs
  console.log("conform to teq8601 please");

  // Request the screen to be redrawn on next pass 
  rocky.requestDraw();
});
