var app = (function () {

    var drawingNumber = null;

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var clickAddPoint = function (canvas, event){
        if(stompClient === null){
            alert('Connect to a specific drawing before drawing');
        }else{
            var rect = canvas.getBoundingClientRect()
            var x = event.clientX - rect.left
            var y = event.clientY - rect.top
            var ctx = canvas.getContext("2d");
            var point = new Point(x,y);
            stompClient.send("/app/newpoint."+drawingNumber, {}, JSON.stringify(point));
        }
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    var getRndColor= function() {
        var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+drawingNumber, function (eventbody) {
                var x = (JSON.parse(eventbody.body)).x;
                var y = (JSON.parse(eventbody.body)).y;
                var point = new Point(x,y);
                addPointToCanvas(point);
            });

            stompClient.subscribe('/topic/newpolygon.'+drawingNumber, function (eventbody) {
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                var point0 = null;
                ctx.fillStyle = getRndColor();
                ctx.beginPath();
                (JSON.parse(eventbody.body)).map(function (elem, index) {
                    if(index === 0){
                        point0 = elem;
                        ctx.moveTo(elem.x, elem.y);
                    }else{
                        ctx.lineTo(elem.x, elem.y);
                        if(index === (JSON.parse(eventbody.body)).length){
                            ctx.lineTo(poin0.x, point0.y);
                        }
                    }
                })
                ctx.closePath();
                ctx.fill();
            })
        });

    };
    
    

    return {

        init: function () {
            var canvas = document.getElementById("canvas");

            if(window.PointerEvent) {
                canvas.addEventListener("pointerdown", function(e){
                    clickAddPoint(canvas, e)
                });
            }
            else {
                canvas.addEventListener("mousedown", function(event){
                    clickAddPoint(canvas, e)
                });
            }

            
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
            stompClient.send("/app/newpoint."+drawingNumber, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            drawingNumber = null;
            setConnected(false);
            console.log("Disconnected");
        },

        connect: function () {
            drawingNumber = document.getElementById("dNumber").value;
            connectAndSubscribe();
        }
    };

})();