document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var number = 15;
    var minimumDistance = 40;
    var points = new Array(number);
    var movingStep = 2;

    for (var i = 0; i < number; i++) {
        points[i] = spawnPoint()
        drawPoint(points[i]);
    }

    var mouse = {};
    anime();

    function anime() {
        setTimeout(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < number; i++) {
                if (mouse.x && mouse.y && (mouse.x < canvas.width - 20 && mouse.x > 20) && (mouse.y < canvas.height - 20 && mouse.y > 20))
                    points[i] = moveToMouse(mouse, points[i]);
                else
                    points[i] = randomMove(points[i]);
                drawPoint(points[i]);
            }
            for (var i = 0; i < number; i++) {
                drawLines();
            }

            anime();
        }, 100);
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function (evt) {
        mouse = getMousePos(canvas, evt);
    }, false);

    function spawnPoint() {
        var point = {};
        point.x = Math.floor((Math.random() * canvas.width) + 1);
        point.y = Math.floor((Math.random() * canvas.height) + 1);
        return point
    }

    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    function drawLines() {
        for (var i = 0; i < number; i++) {
            for (var j = 0; j < number; j++) {
                if (i == j)
                    continue;

                if (distance(points[i], points[j]) < minimumDistance) {
                    context.beginPath();
                    context.moveTo(points[i].x, points[i].y);
                    context.lineTo(points[j].x, points[j].y);
                    context.lineWidth = 0.1;
                    context.strokeStyle = '#C2DFFF';
                    context.stroke();
                }
            }

            if (distance(points[i], mouse) < minimumDistance + 1) {
                context.beginPath();
                context.moveTo(points[i].x, points[i].y);
                context.lineTo(mouse.x, mouse.y);
                context.lineWidth = 0.1;
                context.strokeStyle = '#E0FFFF';
                context.stroke();
            }
        }

    }

    function drawPoint(point) {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, 2 * Math.PI, true);
        context.fill();
    }

    function calcWeightedMovingDistance(point) {
        var xWeightedMovingDistance = 0;
        var yWeightedMovingDistance = 0;
        var count = 0;

        for (var i = 0; i < number; i++) {
            var d = distance(point, points[i]);
            if (d == 0 || d > minimumDistance)
                continue;

            count++;
            xWeightedMovingDistance += (minimumDistance - d) * (point.x > points[i].x ? 1 : -1);
            yWeightedMovingDistance += (minimumDistance - d) * (point.y > points[i].y ? 1 : -1);
        }

        if (count == 0) {
            xWeightedMovingDistance = 0;
            yWeightedMovingDistance = 0;
        } else {
            xWeightedMovingDistance = xWeightedMovingDistance / count / minimumDistance * movingStep;
            yWeightedMovingDistance = yWeightedMovingDistance / count / minimumDistance * movingStep;
        }


        if (Math.abs(xWeightedMovingDistance) < 0.5 && Math.abs(yWeightedMovingDistance) < 0.5) {
            xWeightedMovingDistance = point.xDirection * Math.floor((Math.random() * movingStep) + 1);
            yWeightedMovingDistance = point.yDirection * Math.floor((Math.random() * movingStep) + 1);
        }

        return {xWeightedMovalDistance: xWeightedMovingDistance, yWeightedMovalDistance: yWeightedMovingDistance}
    }
    function randomMove(point) {
        var movingDistance = calcWeightedMovingDistance(point);

        point.x += Math.floor(movingDistance.xWeightedMovalDistance);
        point.y += Math.floor(movingDistance.yWeightedMovalDistance);

        if (point.x > canvas.width || point.x < 0 || point.y > canvas.height || point.y < 0)
            point = spawnPoint();

        return point;
    }

    function moveToMouse(mouse, point) {
        var d = distance(mouse, point);
        var x = (mouse.x - point.x > 0 ? 1 : -1) * (d - minimumDistance > 0 ? 1 : -1) * Math.abs(d - minimumDistance) / 20;
        var y = (mouse.y - point.y > 0 ? 1 : -1) * (d - minimumDistance > 0 ? 1 : -1) * Math.abs(d - minimumDistance) / 20;

        var movingDistance = calcWeightedMovingDistance(point);

        point.x += x > movingDistance ? movingDistance : (x * 25 + movingDistance.xWeightedMovalDistance) * movingStep / 25;
        point.y += y > movingDistance ? movingDistance : (y * 25 + movingDistance.yWeightedMovalDistance) * movingStep  / 25;

        return point;
    }
})
