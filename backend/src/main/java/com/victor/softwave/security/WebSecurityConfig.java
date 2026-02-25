package com.victor.softwave.security;

import com.victor.softwave.security.jwt.AuthEntryPointJwt;
import com.victor.softwave.security.jwt.AuthTokenFilter;
import com.victor.softwave.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.Customizer;

import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public FilterRegistrationBean<AuthTokenFilter> authTokenFilterRegistration(AuthTokenFilter filter) {
    FilterRegistrationBean<AuthTokenFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false);
    return registration;
  }

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/test/**").permitAll()
            .requestMatchers("/error").permitAll()
            .requestMatchers("/api/projects/featured").permitAll()
            .requestMatchers("/api/projects/**").permitAll()
            .requestMatchers("/api/clients/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/articles").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/home").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/web-design").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/seo-overall").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/website-care").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/tiktok-ads").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/facebook-ads").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/google-ads").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/projects").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/pages/clients").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/google-reviews").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/contacts").permitAll()
            .requestMatchers("/api/analytics/**").permitAll()
            .requestMatchers("/uploads/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
            .anyRequest().authenticated());

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
