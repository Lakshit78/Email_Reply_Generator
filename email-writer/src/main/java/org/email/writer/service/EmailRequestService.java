package org.email.writer.service;

import org.email.writer.model.EmailRequest;
import org.springframework.stereotype.Service;

@Service
public class EmailRequestService {

    public String request(EmailRequest email) {
        return "success";
    }
}
