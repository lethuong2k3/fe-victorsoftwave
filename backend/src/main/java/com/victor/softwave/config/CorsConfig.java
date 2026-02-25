package com.victor.softwave.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${frontend.url:}")
    private String frontendUrl;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> allowedOrigins = new ArrayList<>();
        allowedOrigins.add("http://localhost:5173");
        allowedOrigins.add("http://localhost:3000");
        allowedOrigins.add("https://www.victorsoftwave.com");
        allowedOrigins.add("https://victorsoftwave.com");

        // Add Railway frontend URL if provided
        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            // Trim potential whitespace and remove trailing slash, quotes, backticks
            String cleanUrl = frontendUrl.trim()
                    .replace("\"", "")
                    .replace("'", "")
                    .replace("`", "");

            if (cleanUrl.endsWith("/")) {
                cleanUrl = cleanUrl.substring(0, cleanUrl.length() - 1);
            }
            allowedOrigins.add(cleanUrl);

            // Also add the original just in case, but clean is preferred
            if (!cleanUrl.equals(frontendUrl.trim())) {
                allowedOrigins.add(frontendUrl.trim());
            }
        }

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
