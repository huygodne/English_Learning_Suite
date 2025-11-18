package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.TranslationRequestDTO;
import com.ptit.englishlearningsuite.dto.TranslationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    @Value("${translation.api.url:https://translation.googleapis.com/language/translate/v2}")
    private String translationApiUrl;

    @Value("${translation.api.key:}")
    private String translationApiKey;

    @Autowired
    private RestTemplate restTemplate;

    public TranslationResponseDTO translate(TranslationRequestDTO request) {
        Instant start = Instant.now();

        try {
            if (translationApiKey != null && !translationApiKey.isBlank()) {
                String translated = callGoogleTranslate(request);
                return new TranslationResponseDTO(translated, "GoogleTranslate", Duration.between(start, Instant.now()).toMillis());
            }

            String libreResult = callLibreTranslate(request);
            return new TranslationResponseDTO(libreResult, "LibreTranslate", Duration.between(start, Instant.now()).toMillis());
        } catch (Exception primaryException) {
            String fallback = callMyMemory(request);
            return new TranslationResponseDTO(fallback, "MyMemory", Duration.between(start, Instant.now()).toMillis());
        }
    }

    private String callGoogleTranslate(TranslationRequestDTO request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("q", request.getText());
        body.put("source", request.getSourceLang());
        body.put("target", request.getTargetLang());
        body.put("format", "text");
        body.put("key", translationApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        Map<?, ?> response = restTemplate.postForObject(translationApiUrl, entity, Map.class);
        return parseGoogleTranslation(response);
    }

    private String parseGoogleTranslation(Map<?, ?> response) {
        if (response == null) {
            return "Không thể dịch văn bản (API không phản hồi)";
        }
        Object data = response.get("data");
        if (!(data instanceof Map<?, ?> dataMap)) {
            return "Không thể đọc kết quả dịch";
        }
        Object translations = dataMap.get("translations");
        if (translations instanceof Iterable<?> iterable) {
            for (Object translation : iterable) {
                if (translation instanceof Map<?, ?> translationMap) {
                    Object text = translationMap.get("translatedText");
                    if (text != null) {
                        return text.toString();
                    }
                }
            }
        }
        return "Không thể đọc kết quả dịch";
    }

    private String callLibreTranslate(TranslationRequestDTO request) {
        String url = "https://libretranslate.de/translate";
        Map<String, Object> payload = new HashMap<>();
        payload.put("q", request.getText());
        payload.put("source", request.getSourceLang());
        payload.put("target", request.getTargetLang());
        payload.put("format", "text");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);
            if (response != null && response.get("translatedText") != null) {
                return response.get("translatedText").toString();
            }
        } catch (Exception ex) {
            throw new RuntimeException("Không thể dịch văn bản (LibreTranslate lỗi)", ex);
        }
        throw new RuntimeException("Không thể dịch văn bản (LibreTranslate không phản hồi)");
    }

    private String callMyMemory(TranslationRequestDTO request) {
        String encodedText = URLEncoder.encode(request.getText(), StandardCharsets.UTF_8);
        String url = String.format(
                "https://api.mymemory.translated.net/get?q=%s&langpair=%s|%s",
                encodedText,
                request.getSourceLang(),
                request.getTargetLang());
        try {
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("responseData")) {
                Object responseData = response.get("responseData");
                if (responseData instanceof Map<?, ?> data && data.get("translatedText") != null) {
                    return data.get("translatedText").toString();
                }
            }
        } catch (Exception ignored) {
        }
        return "Không thể dịch văn bản (fallback thất bại)";
    }
}


