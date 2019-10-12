package edu.eci.arsw.collabpaint.controllers;


import edu.eci.arsw.collabpaint.messages.TestResponse;
import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class NewpointController {

    @MessageMapping("/newpoint")
    @SendTo("/topic/newpoint")
    public Point test(Point p) throws Exception {

        return p;
    }

}
