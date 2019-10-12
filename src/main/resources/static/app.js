var app = (function () {

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
        var rect = canvas.getBoundingClientRect()
        var x = event.clientX - rect.left
        var y = event.clientY - rect.top
        var ctx = canvas.getContext("2d");
        var point = new Point(x,y);
        stompClient.send("/app/newpoint", {}, JSON.stringify(point));
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();

    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var x = (JSON.parse(eventbody.body)).x;
                var y = (JSON.parse(eventbody.body)).y;
                var point = new Point(x,y);
                addPointToCanvas(point);
            });
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

            
            //websocket connection
            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
            stompClient.send("/app/newpoint", {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();