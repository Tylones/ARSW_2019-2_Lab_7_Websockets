package edu.eci.arsw.collabpaint.controllers;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;

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
