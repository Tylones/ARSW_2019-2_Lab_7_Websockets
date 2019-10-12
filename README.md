# ARSW_2019-2_Lab_7_Websockets

## Name :

```
Etienne Maxence Eugene REITZ
GitHub username : Tylones
```

## Build and test instructions : 

Go in the project directory :

* To build the project , run the command : ```mvn package```
* To test the project, run the command : ```mvn test```
* To compile the project, run the command : ```mvn compile```
* To run the project, run the command : ```mvn spring-boot:run```

The application is accessible at *https://localhost:8080/* 

## The laboratory

### Backend 

* The controller with the shared ArrayList :

```java
@Controller
public class AppPointController {

    private ArrayList<Point> points = new ArrayList<Point>();

    @Autowired
    SimpMessagingTemplate mgt;

    @MessageMapping("/newpoint.{id}")
    public void handlePointEvent(Point p, @DestinationVariable String id) throws Exception {
        synchronized (points){
            points.add(p);

            if(points.size()>=3){
                mgt.convertAndSend("/topic/newpolygon."+id, points);
                points.clear();
            }
        }

        mgt.convertAndSend("/topic/newpoint."+id, p);

    }


}
```

### Frontend

* Connecting and subscribing to the two topics, with their respective callback functions :

```js
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
```

### Screenshot of the final application

In this screenshot, we can see that the first to windows are connected to the drawing 1, 
and the last window is connected to the drawing 2.

As a result, the first two windows do have the same polygons (the colors are generated randomly when 
drawing, and are not shared), and the last window has different polygons.

[final](img/final.png)  