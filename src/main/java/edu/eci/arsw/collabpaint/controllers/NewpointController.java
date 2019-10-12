package edu.eci.arsw.collabpaint.controllers;


import edu.eci.arsw.collabpaint.messages.TestResponse;
import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
public class NewpointController {

    @Autowired
    SimpMessagingTemplate mgt;

    @MessageMapping("/newpoint.{id}")
    public void handlePointEvent(Point p, @DestinationVariable String id) throws Exception {
        mgt.convertAndSend("/topic/newpoint."+id, p);
    }

}
