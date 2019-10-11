package edu.eci.arsw.collabpaint.messages;

public class TestResponse {

    private String content = "Test";

    public TestResponse(){

    }

    public TestResponse(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
