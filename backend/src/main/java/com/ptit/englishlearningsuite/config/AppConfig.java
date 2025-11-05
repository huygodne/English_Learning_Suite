package com.ptit.englishlearningsuite.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * Cung cấp một Bean RestTemplate (phiên bản gốc)
     * Gemini API rất nhanh, không cần cài đặt timeout dài.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}