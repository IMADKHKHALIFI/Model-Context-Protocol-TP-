package net.imad.mcpclient.controllers;



import net.imad.mcpclient.agents.AIAgent;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular frontend
public class AIRestController {
    private AIAgent agent;

    public AIRestController(AIAgent agent) {
        this.agent = agent;
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String query) {
        return agent.askLLM(query);
    }
}
