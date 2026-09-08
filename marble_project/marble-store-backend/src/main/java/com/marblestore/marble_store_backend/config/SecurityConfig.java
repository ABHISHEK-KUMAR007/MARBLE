package com.marblestore.marble_store_backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;

import com.marblestore.marble_store_backend.Services.CustomUserDetailsService;
import com.marblestore.marble_store_backend.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomUserDetailsService userDetailsService;

        @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174,http://localhost:8081,http://localhost:8082,http://127.0.0.1:8082,https://marble-sage.vercel.app,https://marble-3i65.vercel.app,https://*.onrender.com,https://*.vercel.app}")
        private String[] allowedOrigins;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        CustomUserDetailsService userDetailsService) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.userDetailsService = userDetailsService;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {

                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(
                                userDetailsService);

                provider.setPasswordEncoder(
                                passwordEncoder());

                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration
                                .getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http)
                        throws Exception {

                http

                                // JWT API - CSRF not required
                                .csrf(csrf -> csrf.disable())

                                // React frontend CORS
                                .cors(cors -> cors.configurationSource(request -> {

                                        CorsConfiguration config = new CorsConfiguration();

                                        config.setAllowedOriginPatterns(List.of(allowedOrigins));

                                        config.setAllowedMethods(
                                                        List.of(
                                                                        "GET",
                                                                        "POST",
                                                                        "PUT",
                                                                        "PATCH",
                                                                        "DELETE",
                                                                        "OPTIONS"));

                                        config.setAllowedHeaders(
                                                        List.of(
                                                                        "Authorization",
                                                                        "Content-Type"));

                                        config.setExposedHeaders(
                                                        List.of(
                                                                        "Authorization"));

                                        config.setAllowCredentials(true);

                                        return config;
                                }))

                                .authorizeHttpRequests(auth -> auth

                                                // Allow ERROR dispatcher
                                                .dispatcherTypeMatchers(jakarta.servlet.DispatcherType.ERROR)
                                                .permitAll()

                                                // CORS preflight
                                                .requestMatchers(
                                                                HttpMethod.OPTIONS,
                                                                "/**")
                                                .permitAll()

                                                // Login is public
                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/api/company",
                                                                "/api/company/**",
                                                                "/api/products/**",
                                                                "/api/categories/**",
                                                                "/api/blogs/**",
                                                                "/api/testimonials/**",
                                                                "/api/banners/**",
                                                                "/api/gallery/**",
                                                                "/api/videos/**",
                                                                "/api/projects/**",
                                                                "/api/inquiries",
                                                                "/api/inquiries/**",
                                                                "/api/upload",
                                                                "/uploads/**",
                                                                "/error")
                                                .permitAll()

                                                // Admin Management requires SUPER_ADMIN
                                                .requestMatchers(
                                                                "/api/admins",
                                                                "/api/admins/**")
                                                .hasAuthority("ROLE_SUPER_ADMIN")

                                                // Other Admin routes require any authenticated user
                                                .requestMatchers(
                                                                "/api/admin",
                                                                "/api/admin/**")
                                                .authenticated()

                                                // Everything else also requires login
                                                .anyRequest()
                                                .authenticated())

                                // No HTTP session
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authenticationProvider(
                                                authenticationProvider())

                                // JWT validation
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
