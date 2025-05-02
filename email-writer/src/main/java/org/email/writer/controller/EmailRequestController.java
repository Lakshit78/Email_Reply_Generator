package org.email.writer.controller;

import org.email.writer.model.EmailRequest;
import org.email.writer.service.EmailRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailRequestController {

    @Autowired
    private EmailRequestService email_service;

    @PostMapping("/request")
    public ResponseEntity<String> request(@RequestBody EmailRequest email) {
        String response = email_service.request(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
