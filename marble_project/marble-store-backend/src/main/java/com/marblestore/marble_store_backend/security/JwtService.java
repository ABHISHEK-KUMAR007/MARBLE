package com.marblestore.marble_store_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;

@Service
public class JwtService {

        /*
         * Move this to application.properties
         * or environment variables before
         * production deployment.
         */
        private static final String SECRET_KEY = "my-super-secret-jwt-key-for-marble-haven-prime-2026";

        private static final long JWT_EXPIRATION = 1000L * 60 * 60 * 24;

        private SecretKey getSigningKey() {

                return Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(
                                                StandardCharsets.UTF_8));
        }

        public String generateToken(
                        UserDetails userDetails) {

                List<String> roles = userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList();

                String primaryRole = roles.stream()
                                .filter(role -> role.startsWith("ROLE_"))
                                .map(role -> role.replaceFirst("ROLE_", ""))
                                .findFirst()
                                .orElse("SUB_ADMIN");

                return Jwts.builder()

                                .subject(
                                                userDetails.getUsername())

                                .claim("roles", roles)
                                .claim("role", primaryRole)

                                .issuedAt(
                                                new Date())

                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + JWT_EXPIRATION))

                                .signWith(
                                                getSigningKey())

                                .compact();
        }

        public String extractUsername(
                        String token) {

                return extractAllClaims(
                                token).getSubject();
        }

        public boolean isTokenValid(
                        String token,
                        UserDetails userDetails) {

                String username = extractUsername(token);

                return username.equalsIgnoreCase(
                                userDetails.getUsername())
                                &&
                                !isTokenExpired(token);
        }

        private boolean isTokenExpired(
                        String token) {

                return extractAllClaims(
                                token)
                                .getExpiration()
                                .before(
                                                new Date());
        }

        private Claims extractAllClaims(
                        String token) {

                return Jwts.parser()

                                .verifyWith(
                                                getSigningKey())

                                .build()

                                .parseSignedClaims(
                                                token)

                                .getPayload();
        }
}