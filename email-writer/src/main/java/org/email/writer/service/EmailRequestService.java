package org.email.writer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.email.writer.model.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailRequestService {

    @Value("${gemini.api.url}")
    private String gemini_api_url;
    @Value("${gemini.api.key}")
    private String gemini_api_key;

    private final WebClient webClient;

    public EmailRequestService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String request(EmailRequest email) {
        //Create a prompt for the gemini api;
        String prompt = gen_prompt(email);

        //Generate a request body for the gemini api
        Map<String, Object> request_body = Map.of(
                "contents", new Object[] { Map.of(
                        "parts", new Object[] { Map.of(
                                "text", prompt
                        )
                        })
                });

        //Do request and generate response
        String response = webClient.post()
                .uri(gemini_api_url + gemini_api_key)
                .header("Content-Type", "application/json")
                .bodyValue(request_body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract useful text from response and return
        return extract_response(response);
    }

    private String extract_response(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response);
            String return_response = root.get("candidates")
                    .get(0).get("content")
                    .get("parts")
                    .get(0).get("text").asText();
            return return_response;
        } catch (Exception e) {
            return "Error occurred while extracting response from gemini api. Please try again later.\n" + e.getMessage();
        }
    }

    public String gen_prompt(EmailRequest email) {
        StringBuilder sb = new StringBuilder();
        sb.append("Generate a professional email reply for the following email content. Please don't generate a subject line. ");
        if(email.getTone() != null && !email.getTone().isEmpty()) {
            sb.append("The tone of the email is " + email.getTone() + ". ");
        }
        sb.append("\nThe email content is: \n" + email.getContent());
        return sb.toString();
    }
}
